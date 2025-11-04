const API = {
  async login({ email, password }) {
    const res = await fetch('/api/sessions/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Login falló');
    return res.json();
  },

  async current() {
    const res = await fetch('/api/sessions/current', { credentials: 'include' });
    if (!res.ok) throw new Error('No autenticado');
    return res.json();
  },

  async logout() {
    const res = await fetch('/api/sessions/logout', { method: 'POST', credentials: 'include' });
    return res.json();
  },

  async createUser(data) {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Error creando');
    return res.json();
  }
  // /public/js/api.js
async listUsers() {
  const res = await fetch('/api/users', { credentials: 'include' });
  if (!res.ok) throw new Error((await res.json()).message || 'Error listando');
  return res.json();
},

async updateUser(id, data) {
  const res = await fetch(`/api/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Error actualizando');
  return res.json();
},

async deleteUser(id) {
  const res = await fetch(`/api/users/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Error eliminando');
  return res.json();
}

};
