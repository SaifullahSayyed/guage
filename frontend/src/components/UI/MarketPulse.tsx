import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MarketPulseItem } from '../../types';

interface MarketPulseProps {
  items: MarketPulseItem[];
}

export function MarketPulse({ items }: MarketPulseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(items.slice(0, 5));
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setVisible(items);
  }, [items]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % Math.max(visible.length, 1));
    }, 3000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [visible.length]);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '12px', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
          Market Pulse
        </p>
        <span style={{
          width: 7, height: 7, borderRadius: '50%', background: '#10b981',
          boxShadow: '0 0 8px #10b981',
          animation: 'pulse-dot 2s ease infinite',
          display: 'inline-block',
        }} />
        <span style={{ color: 'var(--text-muted)', fontSize: '10px', fontFamily: 'Inter, sans-serif' }}>LIVE</span>
      </div>

      <div style={{ overflow: 'hidden', maxHeight: 160 }}>
        {visible.map((item, i) => (
          <motion.div
            key={item.skill}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: i === currentIndex ? 1 : 0.45, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '6px 0',
              borderBottom: i < visible.length - 1 ? '1px solid var(--border-subtle)' : 'none',
              transform: i === currentIndex ? 'none' : undefined,
            }}
          >
            <span style={{ color: 'var(--text-primary)', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>
              {item.skill}
            </span>
            <span style={{
              color: '#f59e0b', fontSize: '11px', fontFamily: 'Inter, sans-serif', fontWeight: 600,
              background: 'rgba(245,158,11,0.12)', padding: '2px 8px',
              borderRadius: '100px',
            }}>
              {item.growth}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
