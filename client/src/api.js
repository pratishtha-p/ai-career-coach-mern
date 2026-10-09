async function req(path, { method = 'GET', body, form } = {}) {
  const headers = {};
  const token = localStorage.getItem('cc_token');
  if (token) headers.Authorization = `Bearer ${token}`;
  let payload;
  if (form) payload = form;
  else if (body) { headers['Content-Type'] = 'application/json'; payload = JSON.stringify(body); }
  const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api' + path, { method, headers, body: payload });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong. Try again.');
  return data;
}
export const api = {
  register: (b) => req('/auth/register', { method: 'POST', body: b }),
  login: (b) => req('/auth/login', { method: 'POST', body: b }),
  me: () => req('/auth/me'),
  analyzeResume: (form) => req('/ai/resume', { method: 'POST', form }),
  interview: (b) => req('/ai/interview', { method: 'POST', body: b }),
  roadmap: (b) => req('/ai/roadmap', { method: 'POST', body: b }),
  history: () => req('/ai/history'),
  remove: (id) => req('/ai/history/' + id, { method: 'DELETE' })
};
