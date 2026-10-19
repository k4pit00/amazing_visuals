AmazingVisual — вход через Discord
==================================

В комплекте:
- index.html — сайт
- style.css — исходный стиль сайта плюс стили профиля
- script.js — Discord OAuth через Supabase

Перед публикацией проверь настройки Supabase
--------------------------------------------
1. Открой Supabase Dashboard → Authentication → Providers → Discord.
2. Включи Discord provider и заполни Discord Client ID и Client Secret из Discord Developer Portal.
3. В Supabase → Authentication → URL Configuration добавь в Redirect URLs:
   https://k4pit00.github.io/amazing_visuals/
4. В Discord Developer Portal у OAuth2 добавь redirect URL, который показывает Supabase на странице Discord provider (обычно это URL вида https://<project-ref>.supabase.co/auth/v1/callback).
5. Проверь в script.js значения SUPABASE_URL, SUPABASE_ANON_KEY и REDIRECT_URL. В этом комплекте уже указаны проект Supabase и адрес GitHub Pages из текущей настройки.
6. Загрузи index.html, style.css и script.js в корень репозитория k4pit00/amazing_visuals и опубликуй через GitHub Pages.

Безопасность
------------
- В браузере допустим только публичный/publishable ключ Supabase.
- Никогда не вставляй service_role или secret key в script.js.
- Сайт остаётся публичным: авторизация нужна только для показа профиля.
- Supabase сохраняет пользовательскую сессию в браузере. После возврата с Discord имя и аватар показываются автоматически.

Если кнопка не работает
-----------------------
Проверь настройки Discord provider в Supabase, список Redirect URLs, адрес callback в Discord Developer Portal и консоль браузера. OAuth не заработает, пока провайдер Discord не настроен в панели Supabase.
