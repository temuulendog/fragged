import { useState, useEffect } from 'react';

const T = {
  bg: '#06060c',
  text: '#f4f4f8',
  text2: '#a8a8c0',
  textMuted: '#6a6a82',
  accent: '#a78bfa',
  accent2: '#22d3ee',
};

const MESSAGES = [
  'Fetching your stats...',
  'Counting your deaths...',
  'Calculating shame...',
  'Reviewing your life choices...',
  'Consulting the algorithm...',
];

const KF = `
@keyframes ld-spin     { from { transform: rotate(0); } to { transform: rotate(360deg); } }
@keyframes ld-spinRev  { from { transform: rotate(360deg); } to { transform: rotate(0); } }
@keyframes ld-pulse    { 0%,100% { opacity: 0.55; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } }
@keyframes ld-floatGlow {
  0%,100% { transform: translate(0, 0); }
  33%     { transform: translate(40px, -30px); }
  66%     { transform: translate(-30px, 40px); }
}
@keyframes ld-fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes ld-dot {
  0%, 80%, 100% { opacity: 0.25; transform: scale(1); }
  40%           { opacity: 1;    transform: scale(1.3); }
}
`;

const Loading = () => {
  const [msgIndex, setMsgIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setMsgIndex(i => (i + 1) % MESSAGES.length);
        setVisible(true);
      }, 300);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{KF}</style>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: T.bg,
        backgroundImage: `
          radial-gradient(ellipse 70% 50% at 50% 0%, rgba(167, 139, 250, 0.16) 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 100% 100%, rgba(34, 211, 238, 0.10) 0%, transparent 55%),
          radial-gradient(ellipse 60% 50% at 0% 100%, rgba(236, 72, 153, 0.06) 0%, transparent 55%)
        `,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', fontFamily: 'Inter, sans-serif',
      }}>

        {/* Drifting glows */}
        <div style={{
          position: 'absolute', width: 480, height: 480,
          top: '-10%', left: '-8%', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167, 139, 250, 0.18) 0%, transparent 65%)',
          animation: 'ld-floatGlow 22s ease-in-out infinite',
          pointerEvents: 'none', filter: 'blur(20px)',
        }} />
        <div style={{
          position: 'absolute', width: 540, height: 540,
          bottom: '-15%', right: '-12%', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.14) 0%, transparent 65%)',
          animation: 'ld-floatGlow 28s ease-in-out infinite reverse',
          pointerEvents: 'none', filter: 'blur(24px)',
        }} />

        {/* Subtle grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(167, 139, 250, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(167, 139, 250, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, black, transparent)',
          pointerEvents: 'none',
        }} />

        {/* Inner content */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28,
        }}>

          {/* Spinner — concentric arcs in purple + cyan */}
          <div style={{ position: 'relative', width: 88, height: 88 }}>
            {/* Outer purple arc */}
            <svg width="88" height="88" viewBox="0 0 88 88" style={{
              position: 'absolute', inset: 0,
              animation: 'ld-spin 1.4s linear infinite',
              filter: `drop-shadow(0 0 12px ${T.accent})`,
            }}>
              <circle cx="44" cy="44" r="38" fill="none"
                stroke="rgba(167, 139, 250, 0.10)" strokeWidth="3" />
              <circle cx="44" cy="44" r="38" fill="none"
                stroke={T.accent} strokeWidth="3"
                strokeDasharray="70 240" strokeLinecap="round" />
            </svg>
            {/* Inner cyan arc, reverse */}
            <svg width="88" height="88" viewBox="0 0 88 88" style={{
              position: 'absolute', inset: 0,
              animation: 'ld-spinRev 2.0s linear infinite',
              filter: `drop-shadow(0 0 10px ${T.accent2})`,
            }}>
              <circle cx="44" cy="44" r="26" fill="none"
                stroke="rgba(34, 211, 238, 0.10)" strokeWidth="2" />
              <circle cx="44" cy="44" r="26" fill="none"
                stroke={T.accent2} strokeWidth="2"
                strokeDasharray="40 120" strokeLinecap="round" />
            </svg>
            {/* Center pulse */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              width: 8, height: 8, marginTop: -4, marginLeft: -4,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`,
              boxShadow: `0 0 16px ${T.accent}, 0 0 24px ${T.accent2}`,
              animation: 'ld-pulse 1.4s ease-in-out infinite',
            }} />
          </div>

          {/* Message */}
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
            fontSize: 26, letterSpacing: '0.10em', textTransform: 'uppercase',
            color: T.text, textAlign: 'center',
            opacity: visible ? 1 : 0,
            transition: 'opacity 300ms ease',
            minHeight: 32,
            background: `linear-gradient(135deg, ${T.text} 0%, ${T.accent} 100%)`,
            WebkitBackgroundClip: 'text', backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: `drop-shadow(0 0 18px rgba(167, 139, 250, 0.30))`,
          }}>{MESSAGES[msgIndex]}</div>

          {/* Three-dot loader */}
          <div style={{ display: 'flex', gap: 10, marginTop: -6 }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                width: 6, height: 6, borderRadius: '50%',
                background: T.accent,
                boxShadow: `0 0 8px ${T.accent}`,
                animation: `ld-dot 1.4s ease-in-out ${i * 0.16}s infinite`,
              }} />
            ))}
          </div>

          {/* Sub */}
          <div style={{
            fontSize: 12, color: T.textMuted,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600,
            marginTop: -8,
          }}>This will only take a moment</div>
        </div>
      </div>
    </>
  );
};

export default Loading;
