import { useState } from 'react';
import { api } from '../api';
import { ResumeResult } from './results';

export default function Resume() {
  const [role, setRole] = useState('');
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [res, setRes] = useState(null);

  async function go(e) {
    e.preventDefault(); setErr(''); setBusy(true);
    try {
      const f = new FormData();
      f.append('targetRole', role);
      f.append('resumeText', text);
      if (file) f.append('resume', file);
      setRes((await api.analyzeResume(f)).result);
    } catch (x) { setErr(x.message); } finally { setBusy(false); }
  }

  return (
    <section className="panel">
      <h2>Résumé review</h2>
      <p>Get a score, specific fixes and the keywords your target role expects.</p>
      <form onSubmit={go}>
        <label className="field"><span>Target role</span><input required value={role} onChange={(e) => setRole(e.target.value)} placeholder="Software Engineer" /></label>
        <label className="field"><span>Résumé (PDF, up to 5 MB)</span><input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0] || null)} /></label>
        <label className="field"><span>Or paste the text</span><textarea value={text} onChange={(e) => setText(e.target.value)} /></label>
        {err && <p className="err" role="alert">{err}</p>}
        <div className="actions"><button className="pill" disabled={busy || (!file && text.trim().length < 80)}>{busy ? 'Reviewing your résumé…' : 'Review résumé'}</button></div>
      </form>
      {res && <ResumeResult r={res} />}
    </section>
  );
}
