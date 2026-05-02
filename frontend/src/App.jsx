import { useState } from 'react';
import Hero from './components/Hero';
import Loading from './components/Loading';
import Results from './components/Results';
import Roast from './components/Roast';

const MOCK_ROAST = `Your stats have been analyzed. The verdict is in. We've seen worse — but not much worse. Keep grinding.`;

export default function App() {
  const [state, setState] = useState('hero');
  const [player, setPlayer] = useState(null);
  const [roastText, setRoastText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (steamId, type = 'id') => {
    setState('loading');
    setError('');
    try {
      const API = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3001`;
      const res = await fetch(`${API}/api/player/${steamId}?type=${type}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        setState('hero');
        return;
      }
      setPlayer(data);
      setRoastText(MOCK_ROAST);
      setState('results');
    } catch (err) {
      setError('Could not reach the server.');
      setState('hero');
    }
  };

  const handleReset = () => {
    setPlayer(null);
    setRoastText('');
    setError('');
    setState('hero');
  };

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
