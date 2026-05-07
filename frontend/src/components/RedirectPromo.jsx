const T = {
  text: '#f4f4f8',
  text2: '#a8a8c0',
  textMuted: '#6a6a82',
  accent: '#a78bfa',
  accent2: '#22d3ee',
};

const MONO = "'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace";

const RP_KEYFRAMES = `
@keyframes rp-fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes rp-pulse {
  0%, 100% { opacity: 0.75; transform: scale(1); }
  50%      { opacity: 1;    transform: scale(1.18); }
}
@keyframes rp-bounce {
  0%, 100% { transform: translateY(0);   opacity: 0.45; }
  50%      { transform: translateY(6px); opacity: 1; }
}
@keyframes rp-jkGlow {
  0%, 100% {
    text-shadow: 0 0 10px rgba(167, 139, 250, 0.55),
                 0 0 22px rgba(167, 139, 250, 0.30);
  }
  50% {
    text-shadow: 0 0 16px rgba(167, 139, 250, 0.95),
                 0 0 32px rgba(167, 139, 250, 0.55),
                 0 0 48px rgba(34, 211, 238, 0.30);
  }
}
@keyframes rp-borderGlow {
  0%, 100% {
    box-shadow: 0 8px 36px rgba(167, 139, 250, 0.18),
                0 0 0 1px rgba(167, 139, 250, 0.20),
                inset 0 0 22px rgba(167, 139, 250, 0.04);
  }
  50% {
    box-shadow: 0 12px 48px rgba(167, 139, 250, 0.32),
                0 0 0 1px rgba(167, 139, 250, 0.40),
                inset 0 0 28px rgba(167, 139, 250, 0.08);
  }
}
@keyframes rp-caret {
  0%, 50%   { opacity: 1; }
  51%, 100% { opacity: 0; }
}
.rp-card:hover {
  transform: translateY(-2px);
  border-color: rgba(167, 139, 250, 0.45) !important;
}
`;

const RedirectPromo = () => (
  <>
    <style>{RP_KEYFRAMES}</style>
    <div style={{
      marginTop: 36, width: '100%',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
      animation: 'rp-fadeUp 800ms cubic-bezier(0.16,1,0.3,1) 380ms both',
    }}>

      {/* NEW pill */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '7px 16px', borderRadius: 999,
        background: 'linear-gradient(135deg, rgba(167,139,250,0.20) 0%, rgba(34,211,238,0.12) 100%)',
        border: '1px solid rgba(167, 139, 250, 0.50)',
        boxShadow: '0 0 28px rgba(167, 139, 250, 0.25)',
        fontSize: 11, letterSpacing: '0.20em', textTransform: 'uppercase',
        color: T.text, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700,
        backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
      }}>
        <span style={{
          display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
          background: T.accent, boxShadow: `0 0 12px ${T.accent}`,
          animation: 'rp-pulse 1.6s ease-in-out infinite',
        }} />
        New — Instant Steam Redirect
      </div>

      {/* Glass card with mock browser bar */}
      <a
        href="https://jksteamcommunity.com/id/temka1k"
        target="_blank" rel="noopener noreferrer"
        className="rp-card"
        style={{
          textDecoration: 'none', width: '100%', maxWidth: 540,
          background: 'rgba(12, 12, 24, 0.70)',
          border: '1px solid rgba(167, 139, 250, 0.22)',
          borderRadius: 14, padding: 16,
          backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
          transition: 'transform 220ms cubic-bezier(0.16,1,0.3,1), border-color 220ms',
          animation: 'rp-borderGlow 3.2s ease-in-out infinite',
          cursor: 'pointer', display: 'block',
        }}
      >
        {/* Mock URL bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'rgba(6, 6, 12, 0.70)',
          border: '1px solid rgba(120, 120, 180, 0.14)',
          borderRadius: 10, padding: '11px 14px',
        }}>
          {/* Traffic lights */}
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f57' }} />
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#febc2e' }} />
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#28c840' }} />
          </div>

          {/* Lock */}
          <span style={{ fontSize: 11, color: T.textMuted, flexShrink: 0, lineHeight: 1 }}>🔒</span>

          {/* URL */}
          <div style={{
            fontFamily: MONO, fontSize: 14, color: T.text2,
            overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
            letterSpacing: '0.01em',
          }}>
            <span style={{ color: T.textMuted }}>https://</span>
            <span style={{
              color: T.accent, fontWeight: 700,
              animation: 'rp-jkGlow 2.4s ease-in-out infinite',
            }}>jk</span>
            <span style={{ color: T.text }}>steamcommunity.com</span>
            <span style={{ color: T.text2 }}>/id/temka1k</span>
            <span style={{
              color: T.accent, marginLeft: 1,
              animation: 'rp-caret 1s steps(1) infinite',
            }}>|</span>
          </div>
        </div>
      </a>

      {/* Description */}
      <p style={{
        margin: 0, fontSize: 13, color: T.text2, textAlign: 'center',
        letterSpacing: '0.01em', lineHeight: 1.6,
        fontFamily: "'Inter', sans-serif", maxWidth: 480,
      }}>
        Add{' '}
        <span style={{
          color: T.accent, fontWeight: 700,
          padding: '2px 8px', borderRadius: 6,
          background: 'rgba(167, 139, 250, 0.14)',
          border: '1px solid rgba(167, 139, 250, 0.30)',
          fontFamily: MONO, fontSize: 12,
        }}>jk</span>
        {' '}to the start of any{' '}
        <span style={{ color: T.text, fontWeight: 600 }}>steamcommunity.com</span>
        {' '}URL — instant redirect to their FRAGGED profile
      </p>

      {/* Bouncing arrow */}
      <div style={{
        fontSize: 18, color: T.accent, marginTop: 2,
        animation: 'rp-bounce 1.8s ease-in-out infinite',
        textShadow: `0 0 10px ${T.accent}`,
      }}>↓</div>
    </div>
  </>
);

export default RedirectPromo;
