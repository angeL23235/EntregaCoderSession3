(async function () {
  const meEl = document.getElementById('me');
  const logoutBtn = document.getElementById('logout-btn');
  const createForm = document.getElementById('create-form');
  const createMsg = document.getElementById('create-msg');
  const listMsg = document.getElementById('list-msg');
  const refreshBtn = document.getElementById('refresh-btn');
  const tbody = document.getElementById('users-body');
  const rowTpl = document.getElementById('row-tpl');
  const modal = document.getElementById('edit-modal');
  const editForm = document.getElementById('edit-form');
  const editMsg = document.getElementById('edit-msg');
  const cancelEdit = document.getElementById('cancel-edit');

  let me;
  try {
    const r = await API.current();
    me = r.payload;
    meEl.textContent = `${me.first_name} ${me.last_name} (${me.role})`;
  } catch (_) {
    location.href = '/';
    return;
  }

  let isAdmin = me.role === 'admin';

  async function loadUsers() {
    tbody.innerHTML = '';
    listMsg.textContent = '';
    if (!isAdmin) {
      location.href = '/panel.html';
      return;
    }

    try {
      const r = await API.listUsers();
      const users = r.payload || [];
      for (const u of users) {
        const tr = rowTpl.content.cloneNode(true);
        tr.querySelector('.name').textContent = `${u.first_name} ${u.last_name}`;
        tr.querySelector('.email').textContent = u.email;
        tr.querySelector('.age').textContent = u.age ?? '';
        tr.querySelector('.role').textContent = u.role;
        tr.querySelector('.id').textContent = u._id;

        tr.querySelector('.edit').addEventListener('click', () => openEdit(u));

        tr.querySelector('.del').addEventListener('click', async () => {
          const allowed = isAdmin || me._id === u._id;
          if (!allowed) return alert('No autorizado');
          if (!confirm('¿Eliminar usuario?')) return;
          try {
            await API.deleteUser(u._id);
            await loadUsers();
          } catch (e) {
            alert(e.message || 'Error eliminando');
          }
        });

        tbody.appendChild(tr);
      }
      if (!users.length) listMsg.textContent = 'No hay usuarios.';
    } catch (e) {
      listMsg.textContent = e.message || 'Error cargando usuarios';
    }
  }

  createForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    createMsg.textContent = '';
    const fd = new FormData(createForm);
    const data = Object.fromEntries(fd.entries());
    try {
      await API.createUser(data);
      createForm.reset();
      createMsg.textContent = 'Usuario creado.';
      if (isAdmin) await loadUsers();
    } catch (e2) {
      createMsg.textContent = e2.message || 'Error creando';
    }
  });

  function openEdit(u) {
    editForm.uid.value = u._id;
    editForm.first_name.value = u.first_name;
    editForm.last_name.value = u.last_name;
    editForm.email.value = u.email;
    editForm.age.value = u.age ?? '';
    editForm.password.value = '';
    editForm.role.value = u.role;
    editMsg.textContent = '';
    modal.showModal();
  }

  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    editMsg.textContent = '';
    const fd = new FormData(editForm);
    const uid = fd.get('uid');

    const payload = {
      first_name: fd.get('first_name'),
      last_name: fd.get('last_name'),
      email: fd.get('email'),
      age: fd.get('age') ? Number(fd.get('age')) : undefined,
      role: fd.get('role')
    };
    const pwd = fd.get('password');
    if (pwd) payload.password = pwd;

    const allowed = isAdmin || me._id === uid;
    if (!allowed) return alert('No autorizado');

    try {
      await API.updateUser(uid, payload);
      modal.close();
      await loadUsers();
    } catch (e2) {
      editMsg.textContent = e2.message || 'Error guardando';
    }
  });

  cancelEdit.addEventListener('click', () => modal.close());
  refreshBtn.addEventListener('click', loadUsers);

  logoutBtn.addEventListener('click', async () => {
    await API.logout();
    location.href = '/';
  });

  await loadUsers();
})();
