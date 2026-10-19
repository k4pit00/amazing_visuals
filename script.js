/* AmazingVisual — Discord OAuth via Supabase.
 * Replace SUPABASE_ANON_KEY with your project's public/publishable key.
 * Never put a service_role or secret key in browser code.
 */
(() => {
  'use strict';

  const SUPABASE_URL = 'https://hiurjqyihctwgxdchjsd.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_foJKsc51qNjfvrLgCDpoMQ_VX4SpzFO';
  const REDIRECT_URL = 'https://k4pit00.github.io/amazing_visuals/';

  const $ = (selector) => document.querySelector(selector);
  const loginButtons = document.querySelectorAll('.discord-login, [data-discord-login]');
  const loginButtonOriginals = new Map();
  const profile = $('#userProfile');
  const profileTrigger = $('#profileTrigger');
  const profileMenu = $('#profileMenu');
  const profileAvatar = $('#profileAvatar');
  const profileName = $('#profileName');
  const logoutButton = $('#logoutButton');
  const toast = $('#toast');
  const mobileMenu = $('#mobileMenu');
  const nav = $('#nav');
  let supabaseClient;
  let toastTimeout;

  function notify(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 3600);
  }

  function setBusy(busy) {
    loginButtons.forEach((button) => {
      if (busy) {
        loginButtonOriginals.set(button, button.innerHTML);
        button.disabled = true;
        button.textContent = 'Переход в Discord…';
      } else {
        button.disabled = false;
        if (loginButtonOriginals.has(button)) button.innerHTML = loginButtonOriginals.get(button);
      }
    });
  }

  function getDisplayName(user) {
    const metadata = user?.user_metadata || {};
    return metadata.full_name || metadata.name || metadata.global_name || metadata.preferred_username || metadata.user_name || user?.email?.split('@')[0] || 'Discord пользователь';
  }

  function getAvatar(user) {
    const metadata = user?.user_metadata || {};
    return metadata.avatar_url || metadata.picture || '';
  }

  function renderUser(user) {
    const loggedIn = Boolean(user);
    loginButtons.forEach((button) => { button.classList.toggle('hidden', loggedIn); });
    if (profile) profile.classList.toggle('hidden', !loggedIn);
    if (!loggedIn) {
      if (profileMenu) profileMenu.classList.add('hidden');
      if (profileTrigger) profileTrigger.setAttribute('aria-expanded', 'false');
      if (profileAvatar) { profileAvatar.removeAttribute('src'); profileAvatar.alt = ''; }
      if (profileName) profileName.textContent = 'Профиль';
      return;
    }
    if (profileName) profileName.textContent = getDisplayName(user);
    if (profileAvatar) {
      const avatar = getAvatar(user);
      if (avatar) {
        profileAvatar.src = avatar;
        profileAvatar.alt = `Аватар ${getDisplayName(user)}`;
        profileAvatar.onerror = () => { profileAvatar.onerror = null; profileAvatar.removeAttribute('src'); };
      } else {
        profileAvatar.removeAttribute('src');
        profileAvatar.alt = '';
      }
    }
  }

  async function startDiscordLogin() {
    if (!supabaseClient) {
      notify('Авторизация не настроена. Проверьте ключ Supabase в script.js.');
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'discord',
        options: { redirectTo: REDIRECT_URL }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Discord OAuth error:', error);
      notify('Не удалось открыть вход через Discord. Проверьте настройки Supabase.');
      setBusy(false);
    }
  }

  async function logout() {
    if (!supabaseClient) return;
    if (logoutButton) logoutButton.disabled = true;
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;
      renderUser(null);
      notify('Вы вышли из аккаунта.');
    } catch (error) {
      console.error('Supabase sign-out error:', error);
      notify('Не удалось выйти. Попробуйте ещё раз.');
    } finally {
      if (logoutButton) logoutButton.disabled = false;
    }
  }

  loginButtons.forEach((button) => button.addEventListener('click', startDiscordLogin));
  if (logoutButton) logoutButton.addEventListener('click', logout);

  if (profileTrigger && profileMenu) {
    profileTrigger.addEventListener('click', () => {
      const isOpen = !profileMenu.classList.contains('hidden');
      profileMenu.classList.toggle('hidden', isOpen);
      profileTrigger.setAttribute('aria-expanded', String(!isOpen));
    });
    document.addEventListener('click', (event) => {
      if (profile && !profile.contains(event.target)) {
        profileMenu.classList.add('hidden');
        profileTrigger.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        profileMenu.classList.add('hidden');
        profileTrigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (mobileMenu && nav) {
    mobileMenu.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      mobileMenu.setAttribute('aria-expanded', String(isOpen));
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      nav.classList.remove('open');
      mobileMenu.setAttribute('aria-expanded', 'false');
    }));
  }

  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  if (!window.supabase?.createClient) {
    console.error('Supabase JS CDN failed to load.');
    return;
  }

  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });

  supabaseClient.auth.getSession().then(({ data, error }) => {
    if (error) console.error('Could not restore Supabase session:', error);
    renderUser(data?.session?.user || null);
    setBusy(false);
  });

  supabaseClient.auth.onAuthStateChange((_event, session) => {
    renderUser(session?.user || null);
    setBusy(false);
  });
})();
