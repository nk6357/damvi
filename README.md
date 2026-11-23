# DAMVI

Сайт DAMVI с отдельными HTML-страницами и PHP-формой для Beget.
Заявки направляются на **office@damvi.ru** через почтовую службу хостинга.
Пароль от ящика сайту не нужен. Установка и обязательная проверка доставки: [BEGET.md](BEGET.md).
Защита формы и границы защиты: [FORM-SECURITY.txt](FORM-SECURITY.txt).

## Сборка и локальный просмотр

Требуются Node.js 18+ для сборки и PHP 8.2+ с mbstring для формы.

```bash
npm run build:local
npm run dev
```

По умолчанию PHP-просмотр открывается на http://127.0.0.1:4174.
Если сервер уже запущен на 4173, он использует те же файлы.
Для настоящей отправки нужен закрытый private/contact.php по примеру contact.example.php и настроенная почтовая служба. Без них форма вернёт ошибку, а не ложный успех.

## Проверки

```bash
npm run build:local
npm run build
node scripts/build-pages.mjs
node scripts/check-seo.mjs
node scripts/check-navigation.mjs
npm run check:search
python3 tests/check-contact.py
node tests/check-build-security.mjs
```

Почтовый тест запускает временный PHP-сервер без реальной отправки; тест сборки проверяет исключение старых/служебных файлов. Для проверки .htaccess доступен `python3 tests/check-web-security.py` (требуется Apache 2.4).
Усиление сайта: [SITE-SECURITY.txt](SITE-SECURITY.txt). Внешняя DDoS-защита ещё не подключена: [DDOS-BEGET.txt](DDOS-BEGET.txt).

## Публикация

`npm run build` создаёт dist/beget/public_html. На Beget загружается его содержимое.
`npm run package:beget` дополнительно формирует пакет с инструкцией и пустым примером закрытого конфига. Закрытые настройки и тесты в public_html не копируются.

GitHub Pages — тестовая статическая версия с noindex. Она не исполняет PHP и не отправляет форму; посетителю показывается соответствующее сообщение и контактная почта. `npm run dev:node` — только старый статический просмотр, его почтовый API отключён.

## Редактирование

— услуги, контакты, проекты и шаблоны: public/app.js, public/other-services.js;
— дизайн и локальные шрифты Inter: public/styles.css и public/assets;
— метаданные: public/seo.js;
— юридические проекты: public/legal-documents.js;
— почтовый обработчик: public/api/contact.php и public/api/contact-lib.php;
— политика лимитов: 2 попытки на IP, после второй 10 минут ожидания, дополнительно 20/мин и 100/час суммарно.
