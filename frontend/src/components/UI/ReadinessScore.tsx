import React from 'react';
import { motion } from 'framer-motion';
import { useAnimatedScore } from '../../hooks/useAnimatedScore';
import { getScoreColor } from '../../utils/skillColors';

interface ReadinessScoreProps {
  score: number;
}

export function ReadinessScore({ score }: ReadinessScoreProps) {
  const animatedScore = useAnimatedScore(score, 1500);
  const color = getScoreColor(animatedScore);

  const SIZE = 200;
  const STROKE = 8;
  const RADIUS = (SIZE - STROKE) / 2 - 4;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const offset = CIRCUMFERENCE * (1 - animatedScore / 100);

  const label = animatedScore >= 71 ? 'Hire Ready 🎉' : animatedScore >= 41 ? 'Making Progress' : 'Skill Gaps Found';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: '12px', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
        Readiness Score
      </p>

      <motion.div
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 0.3, delay: 1.5 }}
        style={{ position: 'relative', width: SIZE, height: SIZE }}
      >
        <svg width={SIZE} height={SIZE} style={{ position: 'absolute', top: 0, left: 0 }}>
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={color} stopOpacity="1" />
            </linearGradient>
          </defs>
          {/* Background ring */}
          <circle
            cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
            fill="none" stroke="#1a1a2e" strokeWidth={STROKE}
          />
          {/* Progress ring */}
          <motion.circle
            cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
            fill="none"
            stroke="url(#scoreGrad)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>

        {/* Center content */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <motion.span
            style={{
              fontSize: '48px', fontWeight: 700,
              fontFamily: 'Space Grotesk, sans-serif',
              color: color, lineHeight: 1,
              textShadow: `0 0 20px ${color}60`,
            }}
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ delay: 0.3 }}
          >
            {animatedScore}
          </motion.span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '11px', fontFamily: 'Inter, sans-serif', marginTop: 4 }}>
            Hire Ready
          </span>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        style={{
          color, fontSize: '13px', fontFamily: 'Inter, sans-serif',
          fontWeight: 500, margin: 0, textAlign: 'center',
        }}
      >
        {label}
      </motion.p>
      <p style={{ color: 'var(--text-muted)', fontSize: '11px', fontFamily: 'Inter, sans-serif', margin: 0 }}>
        vs. market avg: 61
      </p>
    </div>
  );
}
