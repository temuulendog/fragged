import { useState, useEffect } from 'react';

const MESSAGES = [
  'Fetching your stats...',
  'Counting your deaths...',
  'Calculating shame...',
  'Reviewing your life choices...',
  'Consulting the algorithm...',
];

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
    <div style={s.overlay}>
      <div style={s.grain} />
      <div style={s.inner}>
        <svg width="64" height="64" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(245,240,232,0.07)" strokeWidth="4"/>
          <circle
            cx="32" cy="32" r="26" fill="none" stroke="#d4834a" strokeWidth="4"
            strokeDasharray="163" strokeDashoffset="40" strokeLinecap="round"
            style={{ transformOrigin: 'center', animation: 'fraggedSpin 1.2s linear infinite' }}
          />
        </svg>
        <div style={{ ...s.message, opacity: visible ? 1 : 0 }}>{MESSAGES[msgIndex]}</div>
        <div style={s.sub}>This will only take a moment</div>
      </div>
    </div>
  );
};

const s = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(13,31,23,0.97)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
  },
  grain: {
    position: 'absolute', inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
    backgroundSize: '256px 256px', opacity: 0.4, pointerEvents: 'none',
  },
  inner: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, position: 'relative', zIndex: 1 },
  message: {
    fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
    fontSize: 26, letterSpacing: '0.06em', textTransform: 'uppercase',
    color: '#f5f0e8', transition: 'opacity 300ms ease', textAlign: 'center',
  },
  sub: { fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'rgba(245,240,232,0.30)' },
};

export default Loading;
