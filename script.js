
const SUPABASE_URL = 'https://hiurjqyihctwgxdchjsd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_foJKsc51qNjfvrLgCDpoMQ_VX4SpzFO';

const loginButtons = [
  document.getElementById('discord-login'),
  document.getElementById('discord-login-bottom')
].filter(Boolean);

const statusMessage = document.getElementById('status');

function showMessage(message) {
  if (statusMessage) {
    statusMessage.textContent = message;
  }
}

if (!window.supabase) {
  showMessage('Supabase не загрузился. Проверь интернет и подключение библиотеки.');
} else {
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
          redirectTo: window.location.origin + window.location.pathname
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

  supabaseClient.auth.getSession().then(({ data, error }) => {
    if (error) {
      showMessage('Ошибка сессии: ' + error.message);
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
          label.textContent = 'Войти через Discord';
        } else {
          button.textContent = 'Войти через Discord';
        }

        button.disabled = false;
        button.title = 'Выполнен вход: ' + name;
      });

      showMessage('Ты вошёл через Discord: ' + name);
    }
  });
}
