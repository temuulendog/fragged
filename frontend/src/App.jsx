import { useState, useEffect, useCallback } from 'react';
import Hero from './components/Hero';
import Loading from './components/Loading';
import Results from './components/results/Results';
import Roast from './components/Roast';

const MOCK_ROAST = `Your stats have been analyzed. The verdict is in. We've seen worse — but not much worse. Keep grinding.`;

const HOME_TITLE = 'FRAGGED — CS2 Stats Tracker | csstat.com';

// Resolve the current URL into a search intent, or null for the home page.
// /player/<id> is the canonical path; ?q= is the legacy jksteamcommunity deep-link.
function routeFromUrl() {
  const m = window.location.pathname.match(/^\/player\/([a-zA-Z0-9_-]+)\/?$/);
  if (m) {
    const id = m[1];
    return { id, type: /^\d{17}$/.test(id) ? 'id' : 'vanity' };
  }
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (q) {
    const explicit = params.get('type');
    const type = explicit === 'vanity' || explicit === 'id'
      ? explicit
      : /^\d{17}$/.test(q) ? 'id' : 'vanity';
    return { id: q, type };
  }
  return null;
}

export default function App() {
  const [state, setState] = useState('hero');
  const [player, setPlayer] = useState(null);
  const [roastText, setRoastText] = useState('');
  const [error, setError] = useState('');

  // Fetch a player and sync the URL. `pushUrl` = true for user-initiated searches
  // (adds a history entry); false when reacting to an existing URL (initial load /
  // back-forward), where we only canonicalize the path in place.
  const loadPlayer = useCallback(async (steamId, type = 'id', pushUrl = true) => {
    const nav = (url) => window.history[pushUrl ? 'pushState' : 'replaceState']({}, '', url);
    setState('loading');
    setError('');
    try {
      const API = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3001`;
      const res = await fetch(`${API}/api/player/${steamId}?type=${type}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        setState('hero');
        document.title = HOME_TITLE;
        nav('/');
        return;
      }
      setPlayer(data);
      setRoastText(MOCK_ROAST);
      setState('results');
      document.title = `${data.name} — CS2 Stats | FRAGGED`;
      nav(`/player/${data.steamId}`); // always the resolved steam64 — canonical + shareable
    } catch {
      setError('Could not reach the server.');
      setState('hero');
      document.title = HOME_TITLE;
      nav('/');
    }
  }, []);

  const goHome = useCallback(() => {
    setPlayer(null);
    setRoastText('');
    setError('');
    setState('hero');
    document.title = HOME_TITLE;
  }, []);

  const handleSubmit = (steamId, type = 'id') => loadPlayer(steamId, type, true);

  const handleReset = () => {
    goHome();
    if (window.location.pathname !== '/') window.history.pushState({}, '', '/');
  };

  // Initial route on load + browser back/forward.
  useEffect(() => {
    const sync = () => {
      const route = routeFromUrl();
      if (route) loadPlayer(route.id, route.type, false);
      else goHome();
    };
    sync();
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {state === 'loading' && <Loading />}
      {state === 'hero' && <Hero onSubmit={handleSubmit} error={error} />}
      {state === 'results' && player && (
        <>
          <Results player={player} onSearch={handleSubmit} onReset={handleReset} />
          <Roast roastText={roastText} onReset={handleReset} />
        </>
      )}
    </>
  );
}
