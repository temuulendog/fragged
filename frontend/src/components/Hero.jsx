import { useState } from 'react';
import { T, KEYFRAMES } from '../theme';
import { Masthead } from './ui';

const Hero = ({ onSubmit, error }) => {
  const [steamId, setSteamId] = useState('');
  const [focused, setFocused] = useState(false);

  const parseInput = (raw) => {
    const s = raw.trim();
    const profileMatch = s.match(/steamcommunity\.com\/profiles\/(\d{17})/);
    if (profileMatch) return { id: profileMatch[1], type: 'id' };
    const vanityMatch = s.match(/steamcommunity\.com\/id\/([^/\s?]+)/);
    if (vanityMatch) return { id: vanityMatch[1], type: 'vanity' };
    if (/^\d{17}$/.test(s)) return { id: s, type: 'id' };
    if (s.length > 0) return { id: s, type: 'vanity' };
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsed = parseInput(steamId);
    if (parsed) onSubmit(parsed.id, parsed.type);
  };

  return (
    <>
      <style>{KEYFRAMES}</style>
      <section style={{
        minHeight: '100vh', background: T.bg, color: T.fg,
        fontFamily: T.display, display: 'flex', flexDirection: 'column',
      }}>
        <Masthead />

        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', padding: '40px 22px',
        }}>
          <div className="fr-sec" style={{ width: '100%', maxWidth: 620 }}>
            <div className="mono" style={{ fontSize: 10, color: T.mut, letterSpacing: '.24em', marginBottom: 20 }}>
              CS2 · Steam · Leetify · Faceit
            </div>

            <h1 style={{
              fontFamily: T.display, fontWeight: 900,
              fontSize: 'clamp(40px, 8vw, 72px)', lineHeight: .96,
              letterSpacing: '-.02em', textTransform: 'uppercase', margin: 0,
            }}>
              Paste your steam id.<br />See the <span style={{ color: T.acc }}>damage</span>.
            </h1>

            <form onSubmit={handleSubmit} style={{
              display: 'flex', marginTop: 30,
              border: `1px solid ${focused ? T.acc : T.line}`,
              transition: 'border-color 160ms ease',
            }}>
              <input
                type="text"
                value={steamId}
                onChange={e => setSteamId(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="steamcommunity.com/id/… or 17-digit id"
                style={{
                  flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none',
                  color: T.fg, fontFamily: T.mono, fontSize: 13, padding: '15px 16px',
                }}
              />
              <button type="submit" style={{
                background: T.acc, color: T.ink, border: 'none', padding: '0 22px', cursor: 'pointer',
                fontFamily: T.display, fontWeight: 800, fontSize: 13, letterSpacing: '.12em', textTransform: 'uppercase',
              }}>
                Roast me
              </button>
            </form>

            {error
              ? <p style={{ marginTop: 14, fontSize: 12, color: T.loss, fontFamily: T.mono, letterSpacing: '.02em' }}>{error}</p>
              : <p className="mono" style={{ marginTop: 14, fontSize: 9, color: T.dim }}>Profile must be public</p>
            }
          </div>
        </div>

        <div className="mono" style={{ textAlign: 'center', padding: 16, fontSize: 9, color: T.dim, display: 'flex', justifyContent: 'center', gap: 14 }}>
          <span>csstat.com</span>
          <a href="/privacy.html" style={{ color: T.mut, textDecoration: 'none' }}>Privacy</a>
        </div>
      </section>
    </>
  );
};

export default Hero;
