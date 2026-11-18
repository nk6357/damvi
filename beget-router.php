<?php
// Development router only. Upload public/ contents to Beget, not this file.
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$root = __DIR__ . '/public';
if ($path === '/api/contact' || $path === '/api/contact.php') {
    require $root . '/api/contact.php';
    return;
}
$file = realpath($root . $path);
if ($path !== '/' && $file && str_starts_with($file, $root . DIRECTORY_SEPARATOR) && is_file($file)) return false;
if (str_starts_with($path, '/api/')) { http_response_code(404); exit; }
header('Content-Type: text/html; charset=utf-8');
readfile($root . '/index.html');
