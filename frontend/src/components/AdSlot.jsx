import { useEffect, useRef } from 'react';
import { T } from '../theme';
import { AD_CLIENT, AD_SLOT_RESULTS } from '../ads';

// Editorial-framed AdSense unit: hairline top border + tiny mono "ADVERTISEMENT"
// label, matching the stat-sheet grid. Renders nothing until a real ad-unit slot
// id is set in src/ads.js (i.e. after the site is approved), so nothing looks
// empty or broken during review.
export default function AdSlot({ slot = AD_SLOT_RESULTS, label = 'Advertisement' }) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!slot || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // adsbygoogle script not loaded yet — harmless; a later mount retries.
    }
  }, [slot]);

  if (!slot) return null;

  return (
    <div className="fr-sec" style={{ borderTop: `1px solid ${T.line}`, padding: '14px 22px' }}>
      <div className="mono" style={{ fontSize: 8, color: T.dim, marginBottom: 8 }}>{label}</div>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
