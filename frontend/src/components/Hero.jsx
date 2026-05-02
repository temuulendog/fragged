import { useState } from 'react';

const T = {
  bg: '#06060c',
  bg2: '#0c0c18',
  text: '#f4f4f8',
  text2: '#a8a8c0',
  textMuted: '#6a6a82',
  textDim: '#4a4a5e',
  accent: '#a78bfa',
  accent2: '#22d3ee',
  pink: '#ec4899',
  bad: '#f87171',
};

const HERO_KEYFRAMES = `
@keyframes hero-fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes hero-pulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50%      { opacity: 1; transform: scale(1.04); }
}
@keyframes hero-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes hero-spinReverse {
  from { transform: rotate(360deg); }
  to   { transform: rotate(0deg); }
}
@keyframes hero-shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes hero-gridShift {
  0%   { background-position: 0 0; }
  100% { background-position: 56px 56px; }
}
@keyframes hero-floatGlow {
  0%, 100% { transform: translate(0, 0); }
  33%      { transform: translate(40px, -30px); }
  66%      { transform: translate(-30px, 40px); }
}
@keyframes hero-blink {
  0%, 50%   { opacity: 1; }
  51%, 100% { opacity: 0; }
}
.hero-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 48px rgba(167, 139, 250, 0.45),
              0 0 0 1px rgba(167, 139, 250, 0.6);
}
.hero-cta:active { transform: translateY(0); }
.hero-input:focus {
  border-color: rgba(167, 139, 250, 0.55) !important;
  box-shadow: 0 0 0 2px rgba(167, 139, 250, 0.20),
              0 0 36px rgba(167, 139, 250, 0.15) !important;
}
.hero-wordmark {
  background: linear-gradient(180deg, #ffffff 0%, #d8d3ff 60%, #a78bfa 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 60px rgba(167, 139, 250, 0.35))
          drop-shadow(0 0 18px rgba(34, 211, 238, 0.18));
}
.hero-tag-pill {
  background: linear-gradient(135deg, rgba(167,139,250,0.10) 0%, rgba(34,211,238,0.08) 100%);
  border: 1px solid rgba(167, 139, 250, 0.25);
  background-size: 200% 100%;
  animation: hero-shimmer 6s ease-in-out infinite;
}
.hero-orbit-ring {
  border: 1px solid rgba(167, 139, 250, 0.10);
  border-top-color: rgba(167, 139, 250, 0.45);
  border-right-color: rgba(34, 211, 238, 0.30);
}
`;

const Hero = ({ onSubmit, error }) => {
  const [steamId, setSteamId] = useState('');

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
      <style>{HERO_KEYFRAMES}</style>
      <section style={{
        minHeight: '100vh',
        background: T.bg,
        backgroundImage: `
          radial-gradient(ellipse 80% 60% at 50% 0%, rgba(167, 139, 250, 0.16) 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 100% 100%, rgba(34, 211, 238, 0.10) 0%, transparent 55%),
          radial-gradient(ellipse 60% 50% at 0% 100%, rgba(236, 72, 153, 0.08) 0%, transparent 55%)
        `,
        color: T.text,
        fontFamily: 'Inter, sans-serif',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>

        {/* Animated grid backdrop (matches Results) */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(167, 139, 250, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(167, 139, 250, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent)',
          pointerEvents: 'none',
          animation: 'hero-gridShift 80s linear infinite',
        }} />

        {/* Drifting glows */}
        <div style={{
          position: 'absolute', width: 520, height: 520,
          top: '-10%', left: '-8%', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167, 139, 250, 0.18) 0%, transparent 65%)',
          animation: 'hero-floatGlow 22s ease-in-out infinite',
          pointerEvents: 'none', filter: 'blur(20px)',
        }} />
        <div style={{
          position: 'absolute', width: 600, height: 600,
          bottom: '-15%', right: '-12%', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.14) 0%, transparent 65%)',
          animation: 'hero-floatGlow 28s ease-in-out infinite reverse',
          pointerEvents: 'none', filter: 'blur(24px)',
        }} />

        {/* Orbiting rings around the wordmark */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 720, height: 720, marginTop: -360, marginLeft: -360,
          borderRadius: '50%',
          border: '1px solid rgba(167, 139, 250, 0.06)',
          pointerEvents: 'none',
          animation: 'hero-spin 60s linear infinite',
        }}>
          <div style={{
            position: 'absolute', top: -3, left: '50%',
            width: 6, height: 6, marginLeft: -3, borderRadius: '50%',
            background: T.accent, boxShadow: `0 0 14px ${T.accent}`,
          }} />
        </div>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 920, height: 920, marginTop: -460, marginLeft: -460,
          borderRadius: '50%',
          border: '1px dashed rgba(34, 211, 238, 0.06)',
          pointerEvents: 'none',
          animation: 'hero-spinReverse 90s linear infinite',
        }}>
          <div style={{
            position: 'absolute', bottom: -3, left: '50%',
            width: 5, height: 5, marginLeft: -2.5, borderRadius: '50%',
            background: T.accent2, boxShadow: `0 0 12px ${T.accent2}`,
          }} />
        </div>

        {/* Top accent line */}
        <div style={{
          position: 'absolute', top: 0, left: '15%', right: '15%', height: 1,
          background: `linear-gradient(90deg, transparent, ${T.accent}, ${T.accent2}, transparent)`,
          opacity: 0.5,
        }} />

        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          width: '100%', maxWidth: 620, padding: '0 24px',
        }}>

          {/* Tag pill */}
          <div className="hero-tag-pill" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 14px', borderRadius: 999,
            fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: T.text2, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 600,
            marginBottom: 28,
            animation: 'hero-fadeUp 600ms cubic-bezier(0.16,1,0.3,1) both, hero-shimmer 6s ease-in-out infinite',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: T.accent, boxShadow: `0 0 8px ${T.accent}`,
              animation: 'hero-pulse 2s ease-in-out infinite',
            }} />
            CS2 Stats Tracker · Steam · Leetify · Faceit
          </div>

          {/* Wordmark */}
          <h1 className="hero-wordmark" style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(86px, 18vw, 180px)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            lineHeight: 0.9,
            textAlign: 'center',
            margin: 0,
            marginBottom: 14,
            userSelect: 'none',
            animation: 'hero-fadeUp 800ms cubic-bezier(0.16,1,0.3,1) 80ms both',
          }}>FRAGGED</h1>

          {/* Tagline */}
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 18, color: T.text2,
            textAlign: 'center', margin: 0, marginBottom: 40,
            letterSpacing: '0.01em', lineHeight: 1.5,
            animation: 'hero-fadeUp 800ms cubic-bezier(0.16,1,0.3,1) 180ms both',
          }}>
            Enter your Steam ID. <span style={{ color: T.accent }}>Get destroyed.</span>
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{
            width: '100%', display: 'flex', flexDirection: 'column', gap: 12,
            animation: 'hero-fadeUp 800ms cubic-bezier(0.16,1,0.3,1) 280ms both',
          }}>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 22, top: '50%', transform: 'translateY(-50%)',
                color: T.textMuted, pointerEvents: 'none',
                fontSize: 16,
              }}>⌕</span>
              <input
                className="hero-input"
                type="text"
                value={steamId}
                onChange={e => setSteamId(e.target.value)}
                placeholder="Steam ID, profile link, or custom URL..."
                style={{
                  width: '100%',
                  background: 'rgba(12, 12, 24, 0.7)',
                  border: '1px solid rgba(120, 120, 180, 0.18)',
                  borderRadius: 12,
                  color: T.text,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 16, padding: '18px 28px 18px 48px',
                  outline: 'none',
                  transition: 'border-color 200ms, box-shadow 200ms',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  boxShadow: '0 0 24px rgba(0,0,0,0.35) inset',
                }}
              />
            </div>

            <button
              type="submit"
              className="hero-cta"
              style={{
                width: '100%',
                position: 'relative',
                background: 'linear-gradient(135deg, #a78bfa 0%, #22d3ee 100%)',
                color: '#0a0a14',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800,
                fontSize: 19, letterSpacing: '0.16em', textTransform: 'uppercase',
                border: 'none', borderRadius: 12, padding: '18px 0', cursor: 'pointer',
                boxShadow: '0 8px 32px rgba(167, 139, 250, 0.35), 0 0 0 1px rgba(167, 139, 250, 0.4)',
                transition: 'transform 180ms cubic-bezier(0.16,1,0.3,1), box-shadow 180ms',
                overflow: 'hidden',
              }}
            >
              <span style={{ position: 'relative', zIndex: 1 }}>ROAST ME →</span>
            </button>

            {error
              ? <p style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 13,
                  color: T.bad, textAlign: 'center', margin: '4px 0 0',
                  letterSpacing: '0.02em',
                }}>{error}</p>
              : <p style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 12,
                  color: T.textMuted, textAlign: 'center', margin: '4px 0 0',
                }}>Your Steam profile must be set to public</p>
            }
          </form>

          {/* Feature row */}
          <div style={{
            display: 'flex', gap: 28, marginTop: 56, flexWrap: 'wrap',
            justifyContent: 'center',
            animation: 'hero-fadeUp 800ms cubic-bezier(0.16,1,0.3,1) 380ms both',
          }}>
            {[
              { label: 'Premier Rank', accent: T.bad },
              { label: 'Aim & Utility', accent: T.accent },
              { label: 'Match History', accent: T.accent2 },
              { label: 'Faceit + Leetify', accent: T.pink },
            ].map(({ label, accent }) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 12, color: T.text2,
                letterSpacing: '0.10em', textTransform: 'uppercase',
                fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 600,
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: accent, boxShadow: `0 0 10px ${accent}`,
                }} />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom credit */}
        <div style={{
          position: 'absolute', bottom: 24, left: 0, right: 0,
          textAlign: 'center', fontSize: 11, color: T.textDim,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 600,
        }}>
          csstat.com
        </div>
      </section>
    </>
  );
};

export default Hero;
