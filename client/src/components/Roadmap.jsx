import { useState } from 'react';
import { api } from '../api';
import { RoadmapResult } from './results';

export default function Roadmap() {
  const [f, setF] = useState({ goal: '', skills: '', weeks: 12, hours: 10 });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [res, setRes] = useState(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function go(e) {
    e.preventDefault(); setErr(''); setBusy(true);
    try { setRes((await api.roadmap(f)).result); } catch (x) { setErr(x.message); } finally { setBusy(false); }
  }

  return (
    <section className="panel">
      <h2>Learning roadmap</h2>
      <p>A plan sized to the weeks and hours you actually have.</p>
      <form onSubmit={go}>
        <label className="field"><span>Role you are working towards</span><input required value={f.goal} onChange={set('goal')} placeholder="Full-stack Developer" /></label>
        <label className="field"><span>Skills you already have</span><input value={f.skills} onChange={set('skills')} placeholder="HTML, CSS, basic JavaScript" /></label>
        <div className="row">
          <label className="field"><span>Weeks available</span><input type="number" min="2" max="52" value={f.weeks} onChange={set('weeks')} /></label>
          <label className="field"><span>Hours per week</span><input type="number" min="1" max="60" value={f.hours} onChange={set('hours')} /></label>
        </div>
        {err && <p className="err" role="alert">{err}</p>}
        <div className="actions"><button className="pill" disabled={busy}>{busy ? 'Building your plan…' : 'Build roadmap'}</button></div>
      </form>
      {res && <RoadmapResult r={res} />}
    </section>
  );
}
