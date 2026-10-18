const modal = document.querySelector('#authModal');
const closeModalButton = document.querySelector('#closeModal');
const registerForm = document.querySelector('#registerForm');
const loginForm = document.querySelector('#loginForm');
const nickInput = document.querySelector('#nickname');
const nickCounter = document.querySelector('#nickCounter');
const formError = document.querySelector('#formError');
const loginError = document.querySelector('#loginError');
const authTitle = document.querySelector('#authTitle');
const authSubtitle = document.querySelector('#authSubtitle');
const toast = document.querySelector('#toast');
let toastTimer;

function openAuth(mode = 'register') {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  setAuthMode(mode);
  document.body.style.overflow = 'hidden';
}
function closeAuth() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
function setAuthMode(mode) {
  const isRegister = mode === 'register';
  registerForm.classList.toggle('hidden', !isRegister);
  loginForm.classList.toggle('hidden', isRegister);
  document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.tab === mode));
  authTitle.textContent = isRegister ? 'Создать аккаунт' : 'С возвращением';
  authSubtitle.textContent = isRegister ? 'Присоединяйся к сообществу AmazingVisual.' : 'Войди в свой профиль AmazingVisual.';
  formError.textContent = '';
  loginError.textContent = '';
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}
document.querySelectorAll('[data-open-auth]').forEach(button => button.addEventListener('click', () => openAuth(button.dataset.openAuth)));
document.querySelectorAll('[data-tab]').forEach(button => button.addEventListener('click', () => setAuthMode(button.dataset.tab)));
closeModalButton.addEventListener('click', closeAuth);
modal.addEventListener('click', event => { if (event.target === modal) closeAuth(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeAuth(); });
nickInput.addEventListener('input', () => {
  if (nickInput.value.length > 16) nickInput.value = nickInput.value.slice(0, 16);
  nickCounter.textContent = nickInput.value.length;
  formError.textContent = '';
});
registerForm.addEventListener('submit', event => {
  event.preventDefault();
  const nickname = nickInput.value.trim();
  const email = document.querySelector('#email').value.trim();
  const password = document.querySelector('#password').value;
  const confirmPassword = document.querySelector('#confirmPassword').value;
  if (!nickname) return formError.textContent = 'Введи игровой ник.';
  if ([...nickname].length > 16) return formError.textContent = 'Ник должен содержать не более 16 символов.';
  if (!/^[\p{L}\p{N}_ .-]+$/u.test(nickname)) return formError.textContent = 'Используй буквы, цифры, пробел, точку, дефис или _.';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return formError.textContent = 'Введи корректный адрес электронной почты.';
  if (password.length < 8) return formError.textContent = 'Пароль должен содержать минимум 8 символов.';
  if (password !== confirmPassword) return formError.textContent = 'Пароли не совпадают.';
  formError.textContent = 'Проверка пройдена, но регистрация ещё не подключена к серверу.';
});
loginForm.addEventListener('submit', event => {
  event.preventDefault();
  loginError.textContent = 'Вход пока не подключён к серверу.';
});
const mobileMenu = document.querySelector('#mobileMenu');
const nav = document.querySelector('#nav');
mobileMenu.addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));
document.querySelector('#year').textContent = new Date().getFullYear();