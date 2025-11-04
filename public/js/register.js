(async function () {
  const form = document.getElementById('register-form');
  const msg = document.getElementById('reg-msg');

  try {
    const me = await API.current();
    if (me?.payload) {
      location.href = me.payload.role === 'admin' ? '/admin.html' : '/panel.html';
    }

  } catch (_) { }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = '';

    const fd = new FormData(form);
    const first_name = fd.get('first_name')?.trim();
    const last_name = fd.get('last_name')?.trim();
    const email = fd.get('email')?.trim().toLowerCase();
    const age = fd.get('age') ? Number(fd.get('age')) : undefined;
    const password = fd.get('password');
    const password2 = fd.get('password2');
    const role = fd.get('role') || 'user';

    // validaciones rápidas en cliente
    if (!first_name || !last_name || !email || !password || !password2) {
      msg.textContent = 'Por favor completa todos los campos obligatorios.';
      return;
    }
    if (password !== password2) {
      msg.textContent = 'Las contraseñas no coinciden.';
      return;
    }
    if (password.length < 6) {
      msg.textContent = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    try {
      await API.createUser({ first_name, last_name, email, age, password, role });
      msg.textContent = 'Cuenta creada. Iniciando sesión...';

      await API.login({ email, password });
      const me = await API.current();
      location.href = me.payload?.role === 'admin' ? '/admin.html' : '/panel.html';

      location.href = '/panel.html';
    } catch (e2) {
      msg.textContent = e2.message || 'No se pudo registrar';
    }
  });
})();
