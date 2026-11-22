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
$build = __DIR__ . '/dist/local';
if (is_file($build . '/route-map.json')) {
    $map = json_decode(file_get_contents($build . '/route-map.json'), true);
    $route = rtrim($path, '/') ?: '/';
    if (isset($map['aliases'][$route])) {
        header('Location: ' . $map['aliases'][$route], true, 301);
        exit;
    }
    if (in_array($route, $map['routes'], true)) {
        readfile($route === '/' ? $build . '/index.html' : $build . '/_pages' . $route . '.html');
    } else {
        http_response_code(404);
        readfile($build . '/404.html');
    }
} else {
    readfile($root . '/index.html');
}
