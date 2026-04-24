import { useState } from 'react';

const Hero = ({ onSubmit, error }) => {
  const [steamId, setSteamId] = useState('');
  const [focused, setFocused] = useState(false);

  const parseInput = (raw) => {
    const s = raw.trim();
    // Full profile URL: steamcommunity.com/profiles/76561198...
    const profileMatch = s.match(/steamcommunity\.com\/profiles\/(\d{17})/);
    if (profileMatch) return { id: profileMatch[1], type: 'id' };
    // Custom URL: steamcommunity.com/id/vanityname
    const vanityMatch = s.match(/steamcommunity\.com\/id\/([^\/\s?]+)/);
    if (vanityMatch) return { id: vanityMatch[1], type: 'vanity' };
    // Plain Steam64 ID
    if (/^\d{17}$/.test(s)) return { id: s, type: 'id' };
    // Assume anything else is a vanity URL name
    if (s.length > 0) return { id: s, type: 'vanity' };
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsed = parseInput(steamId);
    if (parsed) onSubmit(parsed.id, parsed.type);
  };

  return (
    <section style={s.section}>
      <div style={s.bgShapes} aria-hidden="true">
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ ...s.shape, ...s[`shape${i}`] }} />
        ))}
      </div>
      <div style={s.grain} />
      <div style={s.inner}>
        <h1 style={s.wordmark}>FRAGGED</h1>
        <p style={s.tagline}>Enter your Steam ID. Get destroyed.</p>
        <form onSubmit={handleSubmit} style={s.form}>
          <input
            type="text"
            value={steamId}
            onChange={e => setSteamId(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Steam ID, profile link, or custom URL..."
            style={{ ...s.input, ...(focused ? s.inputFocused : {}) }}
          />
          <button type="submit" style={s.cta}>ROAST ME →</button>
          {error
            ? <p style={{ ...s.hint, color: '#8b3a3a', opacity: 1 }}>{error}</p>
            : <p style={s.hint}>Your Steam profile must be set to public</p>
          }
        </form>
      </div>
    </section>
  );
};

const s = {
  section: {
    minHeight: '100vh',
    background: '#0d1f17',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  bgShapes: { position: 'absolute', inset: 0, pointerEvents: 'none' },
  shape: {
    position: 'absolute',
    borderRadius: '50%',
    border: '1px solid rgba(212,131,74,0.04)',
    animation: 'fraggedFloat 20s ease-in-out infinite',
  },
  shape0: { width: 400, height: 400, top: '-10%', left: '-8%', animationDelay: '0s', background: 'radial-gradient(circle, rgba(212,131,74,0.03) 0%, transparent 70%)' },
  shape1: { width: 600, height: 600, bottom: '-15%', right: '-10%', animationDelay: '-7s', background: 'radial-gradient(circle, rgba(74,124,89,0.03) 0%, transparent 70%)' },
  shape2: { width: 200, height: 200, top: '20%', right: '15%', animationDelay: '-3s', border: '1px solid rgba(212,131,74,0.05)' },
  shape3: { width: 300, height: 300, bottom: '25%', left: '10%', animationDelay: '-12s', border: '1px solid rgba(74,124,89,0.04)' },
  shape4: { width: 150, height: 150, top: '55%', right: '5%', animationDelay: '-5s', borderRadius: '30%', border: '1px solid rgba(212,131,74,0.03)' },
  shape5: { width: 250, height: 250, top: '10%', left: '40%', animationDelay: '-9s', border: '1px solid rgba(245,240,232,0.02)' },
  grain: {
    position: 'absolute', inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
    backgroundSize: '256px 256px', opacity: 0.5, mixBlendMode: 'overlay', pointerEvents: 'none',
  },
  inner: {
    position: 'relative', zIndex: 1,
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    width: '100%', maxWidth: 560, padding: '0 24px',
  },
  wordmark: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 800,
    fontSize: 'clamp(80px, 18vw, 160px)',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#f5f0e8',
    lineHeight: 0.9,
    textAlign: 'center',
    marginBottom: 24,
    filter: 'drop-shadow(0 0 60px rgba(212,131,74,0.08))',
    userSelect: 'none',
  },
  tagline: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 17, color: 'rgba(245,240,232,0.55)',
    textAlign: 'center', marginBottom: 40, letterSpacing: '0.01em', lineHeight: 1.5,
  },
  form: { width: '100%', display: 'flex', flexDirection: 'column', gap: 12 },
  input: {
    width: '100%', background: 'rgba(10,24,16,0.8)',
    border: '1px solid rgba(245,240,232,0.15)', borderRadius: 999,
    color: '#f5f0e8', fontFamily: "'Inter', sans-serif",
    fontSize: 16, padding: '16px 28px', outline: 'none',
    transition: 'border-color 200ms, box-shadow 200ms', backdropFilter: 'blur(8px)',
  },
  inputFocused: {
    borderColor: 'rgba(212,131,74,0.50)',
    boxShadow: '0 0 0 2px rgba(212,131,74,0.25), 0 0 24px rgba(212,131,74,0.12)',
  },
  cta: {
    width: '100%', background: '#d4834a', color: '#0d1f17',
    fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
    fontSize: 18, letterSpacing: '0.10em', textTransform: 'uppercase',
    border: 'none', borderRadius: 8, padding: '18px 0', cursor: 'pointer',
    boxShadow: '0 4px 28px rgba(212,131,74,0.35)',
    transition: 'background 150ms, box-shadow 150ms, transform 150ms',
  },
  hint: {
    fontFamily: "'Inter', sans-serif", fontSize: 12,
    color: 'rgba(245,240,232,0.28)', textAlign: 'center', marginTop: 4,
  },
};

export default Hero;
