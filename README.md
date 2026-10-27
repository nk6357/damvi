# DAMVI

Сайт агентства цифровых решений для бизнеса, собранный по утверждённым макетам.

## Запуск

Требуется Node.js 18 или новее.

```bash
cd /Users/nk6357/Documents/Codex/2026-10-27/new-chat-2/damvi-site
npm run dev
```

Локальный адрес: `http://localhost:4173`.

## Настройка заявок

Скопируйте `.env.example` в `.env` и заполните:

- `RESEND_API_KEY` — API-ключ Resend;
- `CONTACT_TO_EMAIL` — почта, куда должны приходить заявки;
- `CONTACT_FROM_EMAIL` — верифицированный адрес отправителя в Resend.

Пока переменные не заполнены, сервер не имитирует успех: форма покажет, что приём заявок ещё не настроен.

## Где редактировать контент

- услуги, цены, контакты и проекты: объект `config` в `public/app.js`;
- тексты страниц услуг: функции `servicePage`, `otherPage` и `projectsPage` в `public/app.js`;
- дизайн и адаптивность: `public/styles.css`;
- логотипы и монограмма: `public/assets/`.

## Маршруты

- `/`
- `/services/websites`
- `/services/chatbots`
- `/services/ai-automation`
- `/services/geo`
- `/services/seo`
- `/services/support`
- `/services/other`
- `/projects`
- `/privacy`

## Шрифты

Для заголовков используется системный `Arial Black` с запасным `Impact`; для основного и ценового текста — `Arial`/`Helvetica`. Это реальные системные шрифты с кириллицей, подобранные как близкое воспроизведение растровых референсов, а не заявленный «точно определённый» исходный шрифт.
