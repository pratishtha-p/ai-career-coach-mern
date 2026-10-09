import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Landing() {
  const { user } = useAuth();
  return (
    <>
      <header className="shell bar">
        <span className="mark">Career Coach</span>
        <Link to={user ? '/app' : '/auth'} className="pill ghost">{user ? 'Open workspace' : 'Sign in'}</Link>
      </header>
      <main className="shell hero">
        <div>
          <h1>Know exactly where your résumé stands, and what to do next.</h1>
          <p className="lead">Upload your résumé for a scored review, practise with interview questions written for your target role, and follow a week-by-week plan that closes your skill gaps.</p>
          <Link to="/auth?mode=register" className="pill">Create a free account</Link>
        </div>
        <aside className="specimen" aria-label="Sample résumé review">
          <div className="score">
            <div className="ring" style={{ '--p': 82 }}><span>82</span></div>
            <p>Strong projects. Your impact needs numbers.</p>
          </div>
          <p>“Built a REST API” tells a recruiter little. “Built a REST API serving 2,000 requests a day” tells them you shipped.</p>
          <div className="chips"><span className="chip">Docker</span><span className="chip">System design</span><span className="chip">CI/CD</span></div>
        </aside>
      </main>
      <section className="shell trio">
        <div><h3>Résumé review</h3><p>A score out of 100, what is working, what to fix, and the keywords your target role expects.</p></div>
        <div><h3>Interview practice</h3><p>Technical, behavioural and situational questions, each with what the interviewer is looking for.</p></div>
        <div><h3>Learning roadmap</h3><p>Phases sized to the weeks and hours you have, each ending in a project for your portfolio.</p></div>
      </section>
    </>
  );
}
