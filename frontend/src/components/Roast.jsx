import { useState, useEffect, useRef } from 'react';
import { T } from '../theme';

const ROAST_CSS = `@keyframes fr-blink { 0%,50% { opacity:1; } 51%,100% { opacity:0; } }`;

const Roast = ({ roastText, onReset }) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    const startTimer = setTimeout(() => {
      setDisplayed('');
      setDone(false);
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
    }, 500);
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
      <style>{ROAST_CSS}</style>
      <section style={{ background: T.bg, color: T.fg, fontFamily: T.display, paddingBottom: 40 }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>

          {/* Verdict strip */}
          <div style={{ borderTop: `1px solid ${T.line}`, background: T.surf, padding: '20px 22px', display: 'flex', gap: 14, alignItems: 'baseline' }}>
            <span className="mono" style={{ fontSize: 9, color: T.acc, whiteSpace: 'nowrap' }}>Verdict —</span>
            <div style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.5, flex: 1 }}>
              {displayed}
              {!done && <span style={{ display: 'inline-block', width: 2, height: '1em', background: T.acc, marginLeft: 2, verticalAlign: 'text-bottom', animation: 'fr-blink 1s step-end infinite' }} />}
            </div>
          </div>

          {/* Buttons */}
          {done && (
            <div className="fr-sec" style={{ display: 'flex', gap: 12, padding: '16px 22px', flexWrap: 'wrap' }}>
              <button
                onClick={handleShare}
                style={{
                  flex: 1, minWidth: 180, background: T.acc, color: T.ink, border: 'none', cursor: 'pointer',
                  fontFamily: T.display, fontWeight: 800, fontSize: 13, letterSpacing: '.12em', textTransform: 'uppercase', padding: '14px 0',
                }}
              >Share my shame</button>
              <button
                onClick={onReset}
                style={{
                  flex: 1, minWidth: 180, background: 'transparent', color: T.fg, cursor: 'pointer',
                  border: `1px solid ${T.line}`,
                  fontFamily: T.display, fontWeight: 700, fontSize: 13, letterSpacing: '.12em', textTransform: 'uppercase', padding: '14px 0',
                }}
              >Try another player</button>
            </div>
          )}

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 22px', borderTop: `1px solid ${T.line}`, fontFamily: T.mono, fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: T.dim }}>
            <span>csstat.com</span>
            <span>Steam · Leetify · Faceit</span>
          </div>
        </div>
      </section>
    </>
  );
};

export default Roast;
