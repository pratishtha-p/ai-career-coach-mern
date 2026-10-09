export const Ring = ({ n }) => <div className="ring" style={{ '--p': n }}><span>{n}</span></div>;
const List = ({ items }) => <ul>{(items || []).map((x, i) => <li key={i}>{x}</li>)}</ul>;

export function ResumeResult({ r }) {
  return (
    <div className="result">
      <div className="score"><Ring n={r.score} /><p>{r.summary}</p></div>
      <div className="cols">
        <div><h3>What is working</h3><List items={r.strengths} /></div>
        <div><h3>What to fix</h3><List items={r.improvements} /></div>
      </div>
      {!!r.missingKeywords?.length && <><h3>Keywords to add</h3><div className="chips">{r.missingKeywords.map((k) => <span className="chip" key={k}>{k}</span>)}</div></>}
      {!!r.atsTips?.length && <div style={{ marginTop: 36 }}><h3>Formatting for applicant tracking systems</h3><List items={r.atsTips} /></div>}
    </div>
  );
}

export function InterviewResult({ r }) {
  return (
    <div className="result">
      {(r.questions || []).map((q, i) => (
        <div className="qitem" key={i}>
          <span className="chip">{q.type}</span>
          <p className="q">{q.question}</p>
          <details><summary>What the interviewer wants and how to answer</summary>
            <p style={{ marginTop: 8 }}><b>Looking for:</b> {q.lookFor}</p>
            <p style={{ marginTop: 8 }}><b>Strong answer:</b> {q.outline}</p>
          </details>
        </div>
      ))}
    </div>
  );
}

export function RoadmapResult({ r }) {
  return (
    <div className="result">
      <h3>{r.title}</h3>
      <p style={{ color: 'var(--muted)', margin: '8px 0 32px', maxWidth: '38em' }}>{r.summary}</p>
      {(r.phases || []).map((p, i) => (
        <div className="phase" key={i}>
          <small>{p.weeks}</small>
          <h3>{p.name}</h3>
          <p>{p.focus}</p>
          <div className="chips" style={{ margin: '12px 0' }}>{(p.topics || []).map((t) => <span className="chip" key={t}>{t}</span>)}</div>
          <p><b>Build:</b> {p.project}</p>
          {!!p.resources?.length && <p style={{ color: 'var(--muted)' }}><b>Learn from:</b> {p.resources.join(', ')}</p>}
        </div>
      ))}
    </div>
  );
}
