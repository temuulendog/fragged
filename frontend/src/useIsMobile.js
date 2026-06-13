import { useState, useEffect } from 'react';

// True on phone-sized viewports. Drives the desktop→single-column layout switches
// in the results page — the components use inline styles, which can't carry CSS
// media queries, so layout decisions are made in JS off the window width.
export default function useIsMobile(breakpoint = 640) {
  const get = () => (typeof window !== 'undefined' ? window.innerWidth <= breakpoint : false);
  const [mobile, setMobile] = useState(get);
  useEffect(() => {
    const onResize = () => setMobile(get());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return mobile;
}
