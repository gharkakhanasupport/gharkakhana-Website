import { useEffect, useRef } from 'react';
import anime from 'animejs';

export function PhoneVideo() {
  const accentRef = useRef(null);

  useEffect(() => {
    if (!accentRef.current) return;

    const animation = anime({
      targets: accentRef.current,
      scale: [1, 1.04, 1],
      duration: 2400,
      easing: 'easeInOutSine',
      loop: true,
    });

    return () => animation.pause();
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[340px]">
      <div ref={accentRef} className="absolute -right-3 -top-3 h-24 w-24 rounded-full bg-brand-yellow/10 blur-2xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-brand-brown/15 bg-brand-cream p-2 shadow-soft">
        <div className="absolute left-1/2 top-3 z-20 h-1.5 w-24 -translate-x-1/2 rounded-full bg-text/10" />
        <video
          className="h-auto w-full rounded-[1.55rem] bg-brand-beige/35 object-contain"
          src="/videos/gkk_screen.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
      </div>
    </div>
  );
}
