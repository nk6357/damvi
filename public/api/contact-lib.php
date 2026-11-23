<?php
declare(strict_types=1);
namespace Damvi\Contact;
if (!defined('DAMVI_CONTACT_HANDLER')) { http_response_code(404); exit; }

function respond(int $status, array $body): never {
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}

function validate(array $data): array {
    $errors = []; $fields = [];
    if (array_diff(array_keys($data), ['problem', 'contact', 'phone', 'website', 'consent'])) $errors['problem'] = 'Запрос содержит недопустимые поля.';
    foreach (['problem', 'contact', 'phone', 'website'] as $key) {
        if (array_key_exists($key, $data) && !is_string($data[$key])) {
            $errors[$key === 'website' ? 'problem' : $key] = 'Проверьте значение поля.';
            $fields[$key] = ''; continue;
        }
        $value = $data[$key] ?? '';
        if (!mb_check_encoding($value, 'UTF-8') || preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', $value)) {
            $errors[$key === 'website' ? 'problem' : $key] = 'Удалите недопустимые символы.';
            $fields[$key] = ''; continue;
        }
        $fields[$key] = preg_replace('/^[\p{Z}\x09-\x0D\x{FEFF}]+|[\p{Z}\x09-\x0D\x{FEFF}]+$/uD', '', $value);
    }
    if (($fields['website'] ?? '') !== '') $errors['problem'] = 'Запрос отклонён.';
    if (($data['consent'] ?? null) !== true) $errors['consent'] = 'Подтвердите согласие на обработку персональных данных.';
    if (!isset($errors['problem'])) {
        if ($fields['problem'] === '') $errors['problem'] = 'Опишите задачу.';
        elseif (mb_strlen($fields['problem'], 'UTF-8') > 2500) $errors['problem'] = 'Сократите описание до 2500 символов.';
    }
    $email = "/^[\\w!#\$%&'*+\\/=?^{}|~-]+(?:\\.[\\w!#\$%&'*+\\/=?^{}|~-]+)*@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z]{2,63}$/iD";
    $telegram = '~^(?:@[a-z0-9_]{5,32}|(?:https?://)?(?:t\.me|telegram\.me)/[a-z0-9_]{5,32}/?)$~iD';
    if (!isset($errors['contact'])) {
        if ($fields['contact'] === '') $errors['contact'] = 'Укажите, куда вам ответить.';
        elseif (strlen($fields['contact']) > 254 || !(preg_match($email, $fields['contact']) || preg_match($telegram, $fields['contact']))) $errors['contact'] = 'Укажите корректный email, @username или ссылку t.me.';
    }
    if (!isset($errors['phone'])) {
        if ($fields['phone'] === '' || $fields['phone'] === '+7') $errors['phone'] = 'Укажите номер для связи.';
        elseif (!preg_match('/^\+7[0-9 ().-]{10,30}$/D', $fields['phone']) || !preg_match('/^7\d{10}$/D', preg_replace('/\D/', '', $fields['phone']))) $errors['phone'] = 'Введите 10 цифр после +7.';
    }
    return [$fields, $errors];
}

// Two-request burst; second attempt starts a full 600-second cooldown.
// No raw IP, problem, contact, phone or consent is saved here.
function reserve(string $path, string $secret, string $ip, int $now, array $limits = []): int {
    $limits += ['client' => [600, 2], 'hour' => [3600, 100], 'minute' => [60, 20]];
    [$window, $clientLimit] = $limits['client'];
    $file = @fopen($path . '.lock', 'c+');
    if (!$file) throw new \RuntimeException('Rate storage unavailable');
    $temporary = null;
    try {
        if (!flock($file, LOCK_EX)) throw new \RuntimeException('Rate lock unavailable');
        if (!chmod($path . '.lock', 0600)) throw new \RuntimeException('Rate permissions unavailable');
        clearstatcache(true, $path);
        if (is_file($path)) {
            if (filesize($path) > 1048576) throw new \RuntimeException('Rate storage too large');
            $raw = file_get_contents($path);
            if ($raw === false) throw new \RuntimeException('Rate read failed');
            $state = json_decode($raw, true, 8, JSON_THROW_ON_ERROR);
        } else $state = ['clients' => [], 'hour' => [], 'minute' => []];
        if (!is_array($state) || !is_array($state['clients'] ?? null) || !is_array($state['hour'] ?? null) || !is_array($state['minute'] ?? null)) throw new \RuntimeException('Invalid rate storage');
        $clients = [];
        foreach ($state['clients'] as $key => $client) {
            if (!is_array($client) || !is_int($client['expires'] ?? null) || !is_int($client['used'] ?? null) || !is_int($client['blocked'] ?? null)) throw new \RuntimeException('Invalid rate entry');
            if ($client['expires'] > $now) $clients[$key] = $client;
        }
        $key = hash_hmac('sha256', $ip, $secret);
        $client = $clients[$key] ?? ['used' => 0, 'blocked' => 0, 'expires' => $now + $window];
        if ($client['blocked'] > $now) return $client['blocked'] - $now;
        foreach (['hour' => $limits['hour'], 'minute' => $limits['minute']] as $period => [$seconds, $limit]) {
            $bucket = $state[$period];
            // Migrate an older fixed-window counter without granting extra quota.
            if (!array_is_list($bucket)) {
                if (!is_int($bucket['start'] ?? null) || !is_int($bucket['count'] ?? null) || $bucket['count'] < 0 || $bucket['count'] > 3000) throw new \RuntimeException('Invalid global rate');
                $bucket = array_fill(0, $bucket['count'], $bucket['start']);
            }
            foreach ($bucket as $timestamp) if (!is_int($timestamp) || $timestamp > $now) throw new \RuntimeException('Invalid global timestamp');
            $bucket = array_values(array_filter($bucket, static fn(int $timestamp): bool => $timestamp > $now - $seconds));
            if (count($bucket) >= $limit) return max(1, min($bucket) + $seconds - $now);
            $bucket[] = $now;
            $state[$period] = $bucket;
        }
        $client['used']++;
        if ($client['used'] >= $clientLimit) {
            $client['blocked'] = $now + $window;
            $client['expires'] = $now + $window;
        }
        $clients[$key] = $client;
        if (count($clients) > 1000) throw new \RuntimeException('Rate storage full');
        $state['clients'] = $clients;
        $encoded = json_encode($state, JSON_THROW_ON_ERROR);
        $temporary = tempnam(dirname($path), '.mail-rate-');
        if ($temporary === false || !chmod($temporary, 0600) || file_put_contents($temporary, $encoded) !== strlen($encoded) || !rename($temporary, $path)) throw new \RuntimeException('Rate write failed');
        $temporary = null;
        return 0;
    } finally {
        if (is_string($temporary) && is_file($temporary)) unlink($temporary);
        flock($file, LOCK_UN); fclose($file);
    }
}

function compose(array $fields, int $now): array {
    $escape = static fn(string $value): string => htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML5, 'UTF-8');
    $phone = '+' . preg_replace('/\D/', '', $fields['phone']);
    $received = gmdate('Y-m-d\TH:i:s\Z', $now);
    $plain = "Заявка с сайта 🔥\n\nОпишите, что мешает бизнесу зарабатывать:\n{$fields['problem']}\n\nКуда вам ответить?\n{$fields['contact']}\n\nНомер для связи:\n{$phone}\n\nСогласие на обработку персональных данных: подтверждено отдельным флажком.\nВерсия согласия: 2026-11-23.3\nПолучено (UTC): {$received}\n";
    $html = '<!doctype html><html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:24px;background:#f5f5f5;color:#171717;font-family:Arial,Helvetica,sans-serif">'
        . '<table role="presentation" style="width:100%;max-width:640px;margin:0 auto;border-collapse:collapse"><tr><td style="padding:24px;background:#fff;border:1px solid #e5e5e5;border-radius:20px;word-break:break-word">'
        . '<h1 style="margin:0 0 24px;font-size:26px;line-height:1.2"><strong>Заявка с сайта 🔥</strong></h1>'
        . '<p><strong>Опишите, что мешает бизнесу зарабатывать</strong></p><p>' . nl2br($escape($fields['problem']), false) . '</p>'
        . '<p><strong>Куда вам ответить?</strong></p><p>' . $escape($fields['contact']) . '</p>'
        . '<p><strong>Номер для связи</strong></p><p><a href="tel:' . $escape($phone) . '" style="color:#E63946;font-size:20px">' . $escape($fields['phone']) . '</a></p>'
        . '<p style="margin-top:24px;font-size:12px;color:#666">Согласие на обработку персональных данных подтверждено отдельным флажком.<br>Версия согласия: 2026-11-23.3<br>Получено (UTC): ' . $received . '</p>'
        . '</td></tr></table></body></html>';
    $boundary = 'damvi_' . bin2hex(random_bytes(24));
    $body = '';
    foreach (['text/plain' => $plain, 'text/html' => $html] as $type => $content) {
        $body .= '--' . $boundary . "\r\nContent-Type: {$type}; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n" . chunk_split(base64_encode($content), 76, "\r\n") . "\r\n";
    }
    $body .= '--' . $boundary . "--\r\n";
    return ['subject' => '=?UTF-8?B?' . base64_encode('Заявка с сайта 🔥') . '?=', 'body' => $body, 'headers' => [
        'From' => 'Damvi <office@damvi.ru>',
        'MIME-Version' => '1.0',
        'Content-Type' => 'multipart/alternative; boundary="' . $boundary . '"',
        'Auto-Submitted' => 'auto-generated',
        'X-Auto-Response-Suppress' => 'All',
    ]];
}
