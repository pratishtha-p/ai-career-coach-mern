import { useState } from 'react';
import { api } from '../api';
import { InterviewResult } from './results';

export default function Interview() {
  const [f, setF] = useState({ role: '', level: 'Entry level', focus: '', count: 6 });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [res, setRes] = useState(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function go(e) {
    e.preventDefault(); setErr(''); setBusy(true);
    try { setRes((await api.interview(f)).result); } catch (x) { setErr(x.message); } finally { setBusy(false); }
  }

  return (
    <section className="panel">
      <h2>Interview practice</h2>
      <p>Questions written for the role you are applying to, with what the interviewer is checking for.</p>
      <form onSubmit={go}>
        <label className="field"><span>Role</span><input required value={f.role} onChange={set('role')} placeholder="Frontend Developer" /></label>
        <div className="row">
          <label className="field"><span>Level</span>
            <select value={f.level} onChange={set('level')}><option>Entry level</option><option>Mid level</option><option>Senior</option></select></label>
          <label className="field"><span>Number of questions</span><input type="number" min="3" max="10" value={f.count} onChange={set('count')} /></label>
        </div>
        <label className="field"><span>Topics to focus on (optional)</span><input value={f.focus} onChange={set('focus')} placeholder="React, data structures, teamwork" /></label>
        {err && <p className="err" role="alert">{err}</p>}
        <div className="actions"><button className="pill" disabled={busy}>{busy ? 'Writing questions…' : 'Generate questions'}</button></div>
      </form>
      {res && <InterviewResult r={res} />}
    </section>
  );
}
