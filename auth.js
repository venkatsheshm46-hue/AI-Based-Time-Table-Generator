/* ═══════════════════════════════════════════
   AUTH.JS — Login / Session Management
═══════════════════════════════════════════ */

const Auth = (() => {
  const SESSION_KEY = 'ttp_session';

  function getSession() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); }
    catch { return null; }
  }
  function setSession(user) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }
  function clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
  }

  function currentUser() { return getSession(); }
  function isAdmin()     { const u = getSession(); return u && u.role === 'admin'; }
  function isLoggedIn()  { return !!getSession(); }

  function init() {
    const loginForm = document.getElementById('login-form');
    const togglePwd = document.getElementById('toggle-password');
    const pwdInput  = document.getElementById('login-password');

    /* Toggle password visibility */
    if (togglePwd) {
      togglePwd.addEventListener('click', () => {
        const isText = pwdInput.type === 'text';
        pwdInput.type = isText ? 'password' : 'text';
        togglePwd.innerHTML = isText
          ? '<i data-lucide="eye"></i>'
          : '<i data-lucide="eye-off"></i>';
        lucide.createIcons({ nodes: [togglePwd] });
      });
    }

    /* Handle login */
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email    = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const btn      = document.getElementById('login-btn');
        const errEl    = document.getElementById('login-error');

        btn.innerHTML = '<div class="spinner"></div><span>Signing in...</span>';
        btn.disabled  = true;
        errEl.classList.add('hidden');

        setTimeout(() => {
          const user = DB.findUser(email, password);
          if (user) {
            setSession({ id: user.id, name: user.name, email: user.email, role: user.role });
            DB.logActivity(`${user.name} logged in`, 'info');
            App.showApp(user);
          } else {
            errEl.classList.remove('hidden');
            btn.innerHTML = '<span>Sign In</span><i data-lucide="arrow-right"></i>';
            lucide.createIcons({ nodes: [btn] });
            btn.disabled = false;
          }
        }, 600);
      });
    }

    /* Logout */
    document.getElementById('logout-btn')?.addEventListener('click', () => {
      const user = getSession();
      if (user) DB.logActivity(`${user.name} logged out`, 'info');
      clearSession();
      App.showLogin();
    });

    /* Auto-login if session exists */
    const existing = getSession();
    if (existing) {
      App.showApp(existing);
    } else {
      document.getElementById('page-login').classList.add('active');
    }
  }

  return { init, currentUser, isAdmin, isLoggedIn, clearSession };
})();
