// panel.js
(async function () {
  const greeting = document.getElementById('greeting');
  const roleEl = document.getElementById('role');
  const logoutBtn = document.getElementById('logout');
  const adminBtn = document.getElementById('to-admin');

  try {
    const r = await API.current();
    const user = r.payload;

    greeting.textContent = `Hola, ${user.first_name} ${user.last_name}! 👋`;
    roleEl.textContent = `Tu rol es: ${user.role}`;

    if (user.role !== 'admin') {
      adminBtn.style.display = 'none'; 
    }

  } catch (err) {
    // si no está logueado, redirige a inicio
    location.href = '/';
    return;
  }

  logoutBtn.addEventListener('click', async () => {
    await API.logout();
    location.href = '/';
  });

  adminBtn.addEventListener('click', () => {
    location.href = '/admin.html';
  });
})();
