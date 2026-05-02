import { useState, useEffect, useRef } from 'react';

const T = {
  bg: '#06060c',
  surface: 'linear-gradient(145deg, rgba(28, 28, 46, 0.55) 0%, rgba(14, 14, 24, 0.7) 100%)',
  border: 'rgba(120, 120, 180, 0.10)',
  borderStrong: 'rgba(167, 139, 250, 0.22)',
  text: '#f4f4f8',
  text2: '#a8a8c0',
  textMuted: '#6a6a82',
  accent: '#a78bfa',
  accent2: '#22d3ee',
  pink: '#ec4899',
};

const ROAST_KEYFRAMES = `
@keyframes roast-fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes roast-blink {
  0%, 50%   { opacity: 1; }
  51%, 100% { opacity: 0; }
}
@keyframes roast-shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.roast-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 36px rgba(167, 139, 250, 0.40),
              0 0 0 1px rgba(167, 139, 250, 0.5);
}
.roast-btn-primary:active { transform: translateY(0); }
.roast-btn-outline:hover {
  border-color: rgba(167, 139, 250, 0.55);
  background: rgba(167, 139, 250, 0.06);
  transform: translateY(-2px);
}
`;

const Roast = ({ roastText, onReset }) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed('');
    setDone(false);
    const startTimer = setTimeout(() => {
      const interval = setInterval(() => {
        if (indexRef.current < roastText.length) {
          setDisplayed(roastText.slice(0, indexRef.current + 1));
          indexRef.current++;
        } else {
          clearInterval(interval);
          setDone(true);
        }
      }, 22);
      return () => clearInterval(interval);
    }, 600);
    return () => clearTimeout(startTimer);
  }, [roastText]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'FRAGGED', text: roastText.slice(0, 200) + '...' });
    } else {
      navigator.clipboard?.writeText(roastText);
      alert('Roast copied to clipboard!');
    }
  };

  return (
    <>
      <style>{ROAST_KEYFRAMES}</style>
      <section style={{
        background: T.bg,
        backgroundImage: `
          radial-gradient(ellipse 60% 40% at 50% 100%, rgba(167, 139, 250, 0.10) 0%, transparent 60%),
          radial-gradient(ellipse 40% 30% at 100% 100%, rgba(34, 211, 238, 0.06) 0%, transparent 55%)
        `,
        paddingBottom: 80,
        position: 'relative',
        color: T.text,
        fontFamily: 'Inter, sans-serif',
      }}>
        {/* Top divider line — gradient */}
        <div style={{
          height: 1, marginBottom: 36,
          background: `linear-gradient(90deg, transparent 10%, ${T.accent} 35%, ${T.accent2} 65%, transparent 90%)`,
          opacity: 0.5,
        }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px' }}>
          {/* Section title */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24,
            animation: 'roast-fadeUp 600ms cubic-bezier(0.16,1,0.3,1) both',
          }}>
            <div style={{
              width: 4, height: 32,
              background: `linear-gradient(180deg, ${T.accent}, ${T.accent2})`,
              borderRadius: 2, boxShadow: `0 0 12px ${T.accent}`,
            }} />
            <h2 style={{
              fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800,
              fontSize: 'clamp(34px,4.4vw,46px)', letterSpacing: '0.14em',
              textTransform: 'uppercase', color: T.text, margin: 0,
              textShadow: `0 0 24px ${T.accent}33`,
            }}>The Verdict</h2>
          </div>

          {/* Roast card */}
          <div style={{
            background: T.surface,
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            border: `1px solid ${T.border}`,
            borderRadius: 16,
            padding: '36px 40px',
            position: 'relative',
            overflow: 'hidden',
            animation: 'roast-fadeUp 700ms cubic-bezier(0.16,1,0.3,1) 100ms both',
          }}>
            {/* top accent line */}
            <div style={{
              position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
              background: `linear-gradient(90deg, transparent, ${T.borderStrong}, transparent)`,
              pointerEvents: 'none',
            }} />
            {/* Decorative quote */}
            <div style={{
              position: 'absolute', top: 8, left: 24,
              fontSize: 160, lineHeight: 0.8,
              color: T.accent, opacity: 0.08,
              fontFamily: 'Georgia, serif', userSelect: 'none',
              fontWeight: 700,
            }}>"</div>

            <div style={{
              fontFamily: "'Inter',sans-serif", fontSize: 16, lineHeight: 1.8,
              color: T.text, position: 'relative', zIndex: 1, paddingLeft: 8,
            }}>
              {displayed.split('\n\n').map((para, i) => (
                <p key={i} style={{ margin: 0, marginBottom: i < displayed.split('\n\n').length - 1 ? 16 : 0 }}>{para}</p>
              ))}
              {!done && (
                <span style={{
                  display: 'inline-block', width: 2, height: '1em',
                  background: T.accent, marginLeft: 2, verticalAlign: 'text-bottom',
                  animation: 'roast-blink 1s step-end infinite',
                  boxShadow: `0 0 8px ${T.accent}`,
                }} />
              )}
            </div>
          </div>

          {/* Buttons */}
          {done && (
            <div style={{
              display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap',
              animation: 'roast-fadeUp 600ms cubic-bezier(0.16,1,0.3,1) both',
            }}>
              <button
                className="roast-btn-primary"
                onClick={handleShare}
                style={{
                  flex: 1, minWidth: 200,
                  background: `linear-gradient(135deg, ${T.accent} 0%, ${T.accent2} 100%)`,
                  color: '#0a0a14',
                  fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800,
                  fontSize: 16, letterSpacing: '0.14em', textTransform: 'uppercase',
                  border: 'none', borderRadius: 10, padding: '16px 0', cursor: 'pointer',
                  boxShadow: '0 6px 24px rgba(167, 139, 250, 0.30), 0 0 0 1px rgba(167, 139, 250, 0.4)',
                  transition: 'transform 180ms cubic-bezier(0.16,1,0.3,1), box-shadow 180ms',
                }}
              >SHARE MY SHAME</button>
              <button
                className="roast-btn-outline"
                onClick={onReset}
                style={{
                  flex: 1, minWidth: 200,
                  background: 'transparent', color: T.text,
                  fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700,
                  fontSize: 16, letterSpacing: '0.14em', textTransform: 'uppercase',
                  border: `1px solid ${T.borderStrong}`, borderRadius: 10,
                  padding: '16px 0', cursor: 'pointer',
                  transition: 'all 180ms cubic-bezier(0.16,1,0.3,1)',
                }}
              >TRY ANOTHER PLAYER</button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Roast;
