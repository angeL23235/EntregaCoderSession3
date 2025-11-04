(async function () {
  const form = document.getElementById('login-form');
  const err = document.getElementById('login-error');

  try {
    const me = await API.current();
    if (me?.payload) {
      location.href = me.payload.role === 'admin' ? '/admin.html' : '/panel.html';
    }

  } catch (_) { }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    err.textContent = '';
    const fd = new FormData(form);
    const email = fd.get('email');
    const password = fd.get('password');
    try {
      await API.login({ email, password });
      // login.js
      await API.login({ email, password });
      const me = await API.current();
      location.href = me.payload?.role === 'admin' ? '/admin.html' : '/panel.html';

    } catch (e) {
      err.textContent = e.message || 'Error de autenticación';
    }
  });
})();
