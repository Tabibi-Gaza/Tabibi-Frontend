import { useEffect, useRef, useState } from 'react';

const animations = {
  fadeUp: { start: 'translateY(50px)', end: 'translateY(0)' },
  fadeLeft: { start: 'translateX(-60px)', end: 'translateX(0)' },
  fadeRight: { start: 'translateX(60px)', end: 'translateX(0)' },
  zoom: { start: 'scale(0.8)', end: 'scale(1)' },
};

export default function ScrollReveal({ children, animation = 'fadeUp', delay = 0, duration = 600 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const a = animations[animation] || animations.fadeUp;

  return (
    <div
      ref={ref}
      style={{
        transition: `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
        transform: visible ? a.end : a.start,
        opacity: visible ? 1 : 0,
      }}
    >
      {children}
    </div>
  );
}
