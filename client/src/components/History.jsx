import { useEffect, useState } from 'react';
import { api } from '../api';
import { ResumeResult, InterviewResult, RoadmapResult } from './results';

const VIEW = { resume: ResumeResult, interview: InterviewResult, roadmap: RoadmapResult };
const LABEL = { resume: 'Résumé review', interview: 'Interview practice', roadmap: 'Learning roadmap' };

export default function History() {
  const [items, setItems] = useState(null);
  const [open, setOpen] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => { api.history().then(setItems).catch((x) => setErr(x.message)); }, []);
  async function del(id) {
    await api.remove(id);
    setItems(items.filter((i) => i._id !== id));
  }

  return (
    <section className="panel">
      <h2>Saved</h2>
      <p>Everything you generate is kept here.</p>
      {err && <p className="err" role="alert">{err}</p>}
      {items && !items.length && <p className="empty">Nothing saved yet. Run a résumé review, interview practice or roadmap and it will appear here.</p>}
      {(items || []).map((i) => {
        const V = VIEW[i.type];
        return (
          <div key={i._id}>
            <div className="hist">
              <div><b>{i.title}</b><small>{LABEL[i.type]}, {new Date(i.createdAt).toLocaleDateString()}</small></div>
              <div>
                <button onClick={() => setOpen(open === i._id ? null : i._id)}>{open === i._id ? 'Hide' : 'View'}</button>
                <button onClick={() => del(i._id)}>Delete</button>
              </div>
            </div>
            {open === i._id && <V r={i.result} />}
          </div>
        );
      })}
    </section>
  );
}
