import { useState } from 'react';
import { useAuth } from '../AuthContext';
import Resume from '../components/Resume';
import Interview from '../components/Interview';
import Roadmap from '../components/Roadmap';
import History from '../components/History';

const TABS = [
  ['resume', 'Résumé review', Resume],
  ['interview', 'Interview practice', Interview],
  ['roadmap', 'Learning roadmap', Roadmap],
  ['history', 'Saved', History]
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('resume');
  const Panel = TABS.find((t) => t[0] === tab)[2];
  return (
    <>
      <header className="shell bar">
        <span className="mark">Career Coach</span>
        <div className="user"><span>{user.name}</span><button onClick={logout}>Sign out</button></div>
      </header>
      <main className="shell" style={{ paddingBottom: 96 }}>
        <div className="tabs" role="tablist">
          {TABS.map(([id, label]) => (
            <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>
        <Panel />
      </main>
    </>
  );
}
