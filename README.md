# Vip шторы

Сайт на React + Vite. Заявки сохраняются в Supabase и приходят в Telegram.

## Запуск

```bash
npm install
npm run dev
```

Откройте http://127.0.0.1:5173

## Подключение заявок

### 1. Supabase

1. Создайте проект на [supabase.com](https://supabase.com)
2. SQL Editor → выполните `supabase/schema.sql`
3. Settings → API → скопируйте **Project URL** и ключ **service_role**

### 2. Telegram-бот

1. [@BotFather](https://t.me/BotFather) → `/newbot` → сохраните токен
2. Напишите боту `/start`
3. Узнайте свой `chat_id` через [@userinfobot](https://t.me/userinfobot)

### 3. Переменные окружения

Скопируйте `.env.example` → `.env.local` и заполните:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_OWNER_CHAT_ID`

Те же значения — в **Vercel → Settings → Environment Variables**.

### 4. Деплой

1. Залейте репозиторий на GitHub
2. Импортируйте проект на [vercel.com](https://vercel.com)
3. Привяжите webhook бота:

```bash
curl "https://api.telegram.org/bot<ТОКЕН>/setWebhook?url=https://ВАШ-ПРОЕКТ.vercel.app/api/telegram"
```

### 5. Проверка

1. Отправьте заявку с сайта
2. Сообщение должно прийти в Telegram
3. В боте: `/find Иван`, `/find 8918` или `/last`

## Структура

| Путь | Назначение |
|------|------------|
| `src/` | React-сайт |
| `api/lead.js` | Приём заявок |
| `api/telegram.js` | Webhook бота |
| `lib/` | Серверная логика |
| `supabase/schema.sql` | Таблица `leads` |
| `.env.example` | Шаблон секретов |

## Команды

- `npm run dev` — разработка
- `npm run build` — сборка
- `npm run preview` — превью сборки
