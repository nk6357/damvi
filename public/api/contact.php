<?php
declare(strict_types=1);
ini_set('display_errors', '0');
define('DAMVI_CONTACT_HANDLER', true);
require __DIR__ . '/contact-lib.php';
use function Damvi\Contact\{respond, validate, reserve, compose};
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header_remove('X-Powered-By');
header('Content-Security-Policy: default-src \'none\'; frame-ancestors \'none\'; base-uri \'none\'; form-action \'none\'');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'message' => 'Метод не поддерживается.']);
}
if (!preg_match('~^application/json(?:\s*;\s*charset=utf-8)?\s*$~iD', $_SERVER['CONTENT_TYPE'] ?? '')) respond(415, ['ok' => false]);
if (($_SERVER['HTTP_SEC_FETCH_SITE'] ?? '') === 'cross-site') respond(403, ['ok' => false, 'message' => 'Запрос отклонён.']);
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 20000) respond(413, ['ok' => false]);
$unavailable = ['ok' => false, 'message' => 'Форма временно недоступна. Напишите на office@damvi.ru.'];
$configFile = dirname(__DIR__, 2) . '/private/contact.php';
if (!is_file($configFile)) respond(503, $unavailable);
try {
    $config = require $configFile;
    if (!is_array($config) || !is_string($config['rate_secret'] ?? null) || strlen($config['rate_secret']) < 32 || !is_array($config['origins'] ?? null)) throw new RuntimeException('Invalid config');
} catch (Throwable $error) { respond(503, $unavailable); }
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin === '' || !in_array($origin, $config['origins'], true)) respond(403, ['ok' => false, 'message' => 'Запрос отклонён.']);
$ip = $_SERVER['REMOTE_ADDR'] ?? '';
if (!filter_var($ip, FILTER_VALIDATE_IP)) respond(503, $unavailable);
try {
    // Separate ingress budget also throttles malformed JSON and invalid fields.
    $wait = reserve(dirname($configFile) . '/request-rate.json', $config['rate_secret'], $ip, time(), [
        'client' => [60, 20], 'hour' => [3600, 3000], 'minute' => [60, 300],
    ]);
    if ($wait > 0) {
        header('Retry-After: ' . $wait);
        respond(429, ['ok' => false, 'retry_after' => $wait, 'message' => 'Слишком много запросов. Попробуйте позже.']);
    }
} catch (Throwable $error) { respond(503, $unavailable); }
$raw = file_get_contents('php://input', false, null, 0, 20001);
if ($raw === false || strlen($raw) > 20000) respond(413, ['ok' => false]);
try { $data = json_decode($raw, true, 8, JSON_THROW_ON_ERROR); }
catch (Throwable $error) { respond(400, ['ok' => false, 'message' => 'Не удалось прочитать данные формы.']); }
if (!is_array($data) || array_is_list($data)) respond(400, ['ok' => false]);
[$fields, $errors] = validate($data);
if ($errors) respond(422, ['ok' => false, 'errors' => $errors]);
if (!function_exists('mail')) respond(503, $unavailable);
// Actual peer address only; never trust visitor-supplied forwarding headers.
try {
    $message = compose($fields, time());
    // Serialize delivery and accounting; roll back the reservation if mail fails.
    // Fixed envelope and headers. No visitor content here, no mailbox login.
    $retryAfter = reserve(dirname($configFile) . '/mail-rate.json', $config['rate_secret'], $ip, time(), [],
        static fn(): bool => @mail('office@damvi.ru', $message['subject'], $message['body'], $message['headers'], '-foffice@damvi.ru')
    );
    if ($retryAfter > 0) {
        header('Retry-After: ' . $retryAfter);
        $minutes = (int)ceil($retryAfter / 60);
        respond(429, ['ok' => false, 'retry_after' => $retryAfter, 'message' => "Лимит отправки исчерпан. Попробуйте через {$minutes} мин."]);
    }
} catch (Throwable $error) { respond(503, $unavailable); }
if ($retryAfter === -1) respond(502, ['ok' => false, 'message' => 'Не удалось отправить заявку. Попробуйте позже или напишите на office@damvi.ru.']);
// Acceptance by the local MTA is not confirmation of arrival in the inbox.
respond(200, ['ok' => true, 'message' => 'Заявка отправлена. Напишем вам по указанному контакту']);
