<?php
// Copy to SITE/private/contact.php, next to public_html, never inside it.
// No mailbox password, SMTP login, Telegram token or access to reading mail.
return [
    'origins' => ['https://damvi.ru', 'https://www.damvi.ru'],
    // Generate privately: php -r 'echo bin2hex(random_bytes(32)), PHP_EOL;'
    // Replace the empty value; do not commit the actual secret.
    'rate_secret' => '',
];
