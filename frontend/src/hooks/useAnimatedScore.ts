import { useState, useEffect, useRef } from 'react';

export function useAnimatedScore(target: number, duration = 1500): number {
  const [current, setCurrent] = useState(0);
  const prevTarget = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (target === prevTarget.current) return;
    prevTarget.current = target;

    const start = current;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(start + (target - start) * eased));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return current;
}
