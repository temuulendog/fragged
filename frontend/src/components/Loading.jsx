import { useState, useEffect } from 'react';
import { T, KEYFRAMES } from '../theme';

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
    <>
      <style>{KEYFRAMES}</style>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 100, background: T.bg,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 26, fontFamily: T.display,
      }}>
        <div style={{ fontFamily: T.display, fontWeight: 900, fontSize: 34, letterSpacing: '.16em', textTransform: 'uppercase', color: T.fg }}>
          FR<span style={{ color: T.acc }}>A</span>GGED
        </div>

        {/* Indeterminate hairline bar */}
        <div style={{ position: 'relative', width: 240, height: 2, background: T.line, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, height: '100%', width: '40%', background: T.acc, animation: 'fr-load 1.1s linear infinite' }} />
        </div>

        <div className="mono" style={{
          fontSize: 11, color: T.mut, minHeight: 16,
          opacity: visible ? 1 : 0, transition: 'opacity 300ms ease',
        }}>
          {MESSAGES[msgIndex]}
        </div>
      </div>
    </>
  );
};

export default Loading;
