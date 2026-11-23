<?php
// Development router only. Upload public/ contents to Beget, not this file.
$rawPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (!is_string($rawPath) || preg_match('/%(?![a-f0-9]{2})/i', $rawPath)) { http_response_code(400); exit; }
$path = rawurldecode($rawPath);
if (preg_match('/[\x00-\x1F\x7F\\\\]/', $path)) { http_response_code(400); exit; }
$root = __DIR__ . '/public';
$rules = file_get_contents($root . '/.htaccess');
if (preg_match('/^Header always set Content-Security-Policy "([^"]+)"$/m', $rules, $policy)) header('Content-Security-Policy: ' . $policy[1]);
header_remove('X-Powered-By');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()');
if (preg_match('~(^|/)\.(?!well-known(?:/|$))|^(?:/)(?:private|legal-drafts|seo|scripts|tests|node_modules|vendor)(?:/|$)|\.(?:bak|old|orig|save|swp|tmp|sql|sqlite3?|db|log|ini|env|ya?ml|zip|tar|gz|7z|rar)(?:$|/)~i', $path)
    || preg_match('~^/(?:package(?:-lock)?\.json|composer\.(?:json|lock)|(?:contact|telegram)\.example\.php|README\.md|BEGET\.md|(?:FORM-SECURITY|SITE-SECURITY|DDOS-BEGET)\.txt|route-map\.json)$~i', $path)
    || (preg_match('~\.php(?:/|$)~i', $path) && $path !== '/api/contact.php')) { http_response_code(404); exit; }
if ($path === '/api/contact' || $path === '/api/contact.php') {
    require $root . '/api/contact.php';
    return;
}
if (!in_array($_SERVER['REQUEST_METHOD'], ['GET', 'HEAD'], true)) { header('Allow: GET, HEAD'); http_response_code(405); exit; }
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
