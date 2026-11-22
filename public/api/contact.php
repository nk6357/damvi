<?php
declare(strict_types=1);
ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
function reply(int $status, array $body): never {
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') reply(405, ['ok'=>false, 'message'=>'Метод не поддерживается.']);
if (!str_starts_with(strtolower($_SERVER['CONTENT_TYPE'] ?? ''), 'application/json')) reply(415, ['ok'=>false]);
$configFile = dirname(__DIR__, 2) . '/private/telegram.php';
if (!is_file($configFile)) reply(503, ['ok'=>false, 'message'=>'Форма временно недоступна. Напишите в Telegram @nk6357.']);
$config = require $configFile;
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (!$origin || !in_array($origin, $config['origins'] ?? [], true)) reply(403, ['ok'=>false, 'message'=>'Запрос отклонён.']);
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 20000) reply(413, ['ok'=>false]);
$raw = file_get_contents('php://input', false, null, 0, 20001);
if ($raw === false || strlen($raw) > 20000) reply(413, ['ok'=>false]);
try { $data = json_decode($raw, true, 8, JSON_THROW_ON_ERROR); }
catch (Throwable $e) { reply(400, ['ok'=>false]); }
if (!is_array($data)) reply(400, ['ok'=>false]);
foreach (['problem','contact','phone','website'] as $key) {
    if (isset($data[$key]) && !is_string($data[$key])) reply(422, ['ok'=>false]);
}
if (!empty($data['website'])) reply(422, ['ok'=>false, 'message'=>'Запрос отклонён.']);
$trim = static fn(string $value): string => preg_replace('/^[\p{Z}\x09-\x0D\x{FEFF}]+|[\p{Z}\x09-\x0D\x{FEFF}]+$/uD', '', $value);
$problem = $trim($data['problem'] ?? '');
$contact = $trim($data['contact'] ?? '');
$phone = $trim($data['phone'] ?? '');
$errors = [];
if (($data['consent'] ?? null) !== true) $errors['consent'] = 'Подтвердите согласие на обработку персональных данных.';
if ($problem === '') $errors['problem'] = 'Опишите задачу.';
elseif (mb_strlen($problem, 'UTF-8') > 2500) $errors['problem'] = 'Сократите описание до 2500 символов.';
$email = "/^[\\w!#\$%&'*+\\/=?^{}|~-]+(?:\\.[\\w!#\$%&'*+\\/=?^{}|~-]+)*@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z]{2,63}$/iD";
$telegram = '~^(?:@[a-z0-9_]{5,32}|(?:https?://)?(?:t\.me|telegram\.me)/[a-z0-9_]{5,32}/?)$~iD';
if ($contact === '') $errors['contact'] = 'Укажите, куда вам ответить.';
elseif (strlen($contact) > 254 || !(preg_match($email, $contact) || preg_match($telegram, $contact))) $errors['contact'] = 'Укажите корректный email, @username или ссылку t.me.';
if ($phone === '' || $phone === '+7') $errors['phone'] = 'Укажите номер для связи.';
elseif (!preg_match('/^\+7[0-9 ().-]{10,30}$/D', $phone) || !preg_match('/^7\d{10}$/D', preg_replace('/\D/', '', $phone))) $errors['phone'] = 'Введите 10 цифр после +7.';
if ($errors) reply(422, ['ok'=>false, 'errors'=>$errors]);
$token = $config['bot_token'] ?? '';
$chat = (string)($config['chat_id'] ?? '');
if (!preg_match('/^\d+:[A-Za-z0-9_-]{20,}$/D', $token) || !preg_match('/^-?[1-9]\d*$/D', $chat) || !function_exists('curl_init')) reply(503, ['ok'=>false, 'message'=>'Форма временно недоступна. Напишите в Telegram @nk6357.']);
// Fixed-size file, outside public_html; an exclusive lock makes limits atomic.
$statePath = dirname($configFile) . '/contact-rate.json';
$stateFile = fopen($statePath, 'c+');
if (!$stateFile || !flock($stateFile, LOCK_EX)) reply(503, ['ok'=>false]);
chmod($statePath, 0600);
$state = json_decode(stream_get_contents($stateFile), true) ?: [];
$now = time();
$state = array_filter($state, fn($v) => is_array($v) && ($v['start'] ?? 0) > $now - 3600);
$ip = hash_hmac('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown', $token);
$ipKey = 'ip:' . $ip;
$global = $state['global'] ?? ['start'=>$now, 'count'=>0];
$visitor = $state[$ipKey] ?? ['start'=>$now, 'count'=>0, 'last'=>0];
if ($global['count'] >= 100 || $visitor['count'] >= 5 || ($visitor['last'] ?? 0) > $now - 60) {
    flock($stateFile, LOCK_UN); fclose($stateFile);
    header('Retry-After: 60'); reply(429, ['ok'=>false, 'message'=>'Слишком много запросов. Попробуйте позже.']);
}
$global['count']++; $visitor['count']++; $visitor['last']=$now;
$state['global']=$global; $state[$ipKey]=$visitor;
rewind($stateFile); ftruncate($stateFile, 0); fwrite($stateFile, json_encode($state)); fflush($stateFile);
flock($stateFile, LOCK_UN); fclose($stateFile);
// Plain text only: never interpret visitor content as HTML, commands or URLs to fetch.
$text = "Новая заявка DAMVI\n\nПроблема:\n".$problem."\n\nTelegram / email: ".$contact;
if ($phone !== '') $text .= "\nТелефон: ".$phone;
$text .= "\n\nСогласие на обработку данных: подтверждено отдельным флажком."
    ."\nВерсия текста согласия: 2026-11-23.2-preview"
    ."\nВремя получения: ".gmdate('Y-m-d\\TH:i:s\\Z');
$curl = curl_init('https://api.telegram.org/bot'.$token.'/sendMessage');
curl_setopt_array($curl, [CURLOPT_POST=>true, CURLOPT_POSTFIELDS=>json_encode(['chat_id'=>$chat,'text'=>$text,'link_preview_options'=>['is_disabled'=>true]], JSON_UNESCAPED_UNICODE), CURLOPT_HTTPHEADER=>['Content-Type: application/json'], CURLOPT_RETURNTRANSFER=>true, CURLOPT_CONNECTTIMEOUT=>5, CURLOPT_TIMEOUT=>15, CURLOPT_FOLLOWLOCATION=>false, CURLOPT_PROTOCOLS=>CURLPROTO_HTTPS, CURLOPT_SSL_VERIFYPEER=>true, CURLOPT_SSL_VERIFYHOST=>2]);
$response = curl_exec($curl);
$code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);
$result = is_string($response) ? json_decode($response, true) : null;
if ($code !== 200 || empty($result['ok'])) reply(502, ['ok'=>false, 'message'=>'Не удалось отправить заявку. Напишите в Telegram @nk6357.']);
reply(200, ['ok'=>true, 'message'=>'Заявка отправлена. Напишем вам по указанному контакту']);
