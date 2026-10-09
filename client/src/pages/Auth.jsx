import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Auth() {
  const [params] = useSearchParams();
  const [mode, setMode] = useState(params.get('mode') === 'register' ? 'register' : 'login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const { user, login, register } = useAuth();
  const nav = useNavigate();
  if (user) return <Navigate to="/app" replace />;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  async function submit(e) {
    e.preventDefault(); setErr(''); setBusy(true);
    try {
      mode === 'login' ? await login(form) : await register(form);
      nav('/app');
    } catch (x) { setErr(x.message); } finally { setBusy(false); }
  }

  return (
    <>
      <header className="shell bar"><Link to="/" className="mark">Career Coach</Link></header>
      <main className="shell auth">
        <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
        <form onSubmit={submit}>
          {mode === 'register' && <label className="field"><span>Name</span><input required value={form.name} onChange={set('name')} autoComplete="name" /></label>}
          <label className="field"><span>Email</span><input required type="email" value={form.email} onChange={set('email')} autoComplete="email" /></label>
          <label className="field"><span>Password</span><input required type="password" minLength={6} value={form.password} onChange={set('password')} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></label>
          {err && <p className="err" role="alert">{err}</p>}
          <div className="actions"><button className="pill" disabled={busy}>{busy ? 'One moment…' : mode === 'login' ? 'Sign in' : 'Create account'}</button></div>
        </form>
        <p className="swap">
          {mode === 'login' ? 'New here? ' : 'Already have an account? '}
          <a href="#" onClick={(e) => { e.preventDefault(); setErr(''); setMode(mode === 'login' ? 'register' : 'login'); }}>
            {mode === 'login' ? 'Create an account' : 'Sign in'}
          </a>
        </p>
      </main>
    </>
  );
}
