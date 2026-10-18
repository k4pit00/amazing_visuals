
const SUPABASE_URL = 'https://hiurjqyihctwgxdchjsd.supabase.co';

// Вставь публичный Publishable key или старый anon key из Supabase.
// Никогда не вставляй сюда service_role или secret key.
const SUPABASE_ANON_KEY = 'sb_publishable_foJKsc51qNjfvrLgCDpoMQ_VX4SpzFO';

const loginButtons = [
  document.getElementById('discord-login'),
  document.getElementById('discord-login-bottom')
].filter(Boolean);

const statusMessage = document.getElementById('status');

function showMessage(message) {
  statusMessage.textContent = message;
}

if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.trim() === '') {
  loginButtons.forEach(button => {
    button.addEventListener('click', () => {
      showMessage('Добавь публичный ключ Supabase в script.js.');
    });
  });
} else if (window.supabase) {
  loginButtons.forEach(button => {
    button.addEventListener('click', () => {
      showMessage('Сначала добавь публичный ключ Supabase в файл script.js.');
    });
  });
} else if (window.supabase) {
  const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  loginButtons.forEach(button => {
    button.addEventListener('click', async () => {
      loginButtons.forEach(item => {
        item.disabled = true;
      });

      showMessage('Перенаправляем в Discord...');

      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo:
            window.location.origin + window.location.pathname
        }
      });

      if (error) {
        showMessage('Ошибка входа: ' + error.message);

        loginButtons.forEach(item => {
          item.disabled = false;
        });
      }
    });
  });

  async function checkSession() {
    const { data, error } = await supabaseClient.auth.getSession();

    if (error) {
      showMessage('Не удалось проверить сессию: ' + error.message);
      return;
    }

    if (data.session) {
      const user = data.session.user;
      const name =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        'пользователь';

      loginButtons.forEach(button => {
        const label = button.querySelector('span');

        if (label) {
          label.textContent = 'Вы вошли через Discord';
        } else {
          button.textContent = 'Вы вошли через Discord';
        }

        button.disabled = true;
        button.title = 'Вы вошли как ' + name;
      });

      showMessage('Вы вошли через Discord: ' + name);
    }
  }

  checkSession();
} else {
  showMessage('Не удалось загрузить Supabase. Обнови страницу.');
}
