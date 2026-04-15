import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ChevronRight } from 'lucide-react';
import type { Skill } from '../../types';
import { useGaugeStore } from '../../store/gaugeStore';

interface GapCardProps {
  skill: Skill;
  index: number;
}

function Sparkline({ trend }: { trend: string }) {
  // Simple up/down/flat sparkline
  const paths = {
    rising: 'M 0 20 L 15 15 L 30 10 L 45 5',
    stable: 'M 0 12 L 15 13 L 30 11 L 45 12',
    declining: 'M 0 5 L 15 8 L 30 14 L 45 20',
  };
  const colors = { rising: '#f59e0b', stable: '#6b7280', declining: '#374151' };
  const path = paths[trend as keyof typeof paths] || paths.stable;
  const color = colors[trend as keyof typeof colors] || '#6b7280';

  return (
    <svg width="45" height="24" viewBox="0 0 45 24" fill="none">
      <path d={path} stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function GapCard({ skill, index }: GapCardProps) {
  const { fetchRoadmap } = useGaugeStore();

  return (
    <motion.div
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.8 + index * 0.12, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      style={{
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border-subtle)',
        borderLeft: '3px solid var(--skill-gap)',
        borderRadius: '16px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
      }}
      className="gap-card"
      onClick={() => fetchRoadmap(skill.name)}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '15px', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>
            {skill.name}
          </h3>
          <p style={{ margin: '2px 0 0', color: 'var(--text-muted)', fontSize: '11px', fontFamily: 'Inter, sans-serif' }}>
            {skill.category}
          </p>
        </div>
        <span style={{
          background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)',
          borderRadius: '100px', padding: '3px 10px',
          color: 'var(--skill-gap)', fontSize: '11px', fontFamily: 'Inter, sans-serif', fontWeight: 600,
          flexShrink: 0,
        }}>
          {skill.frequency}% of jobs
        </span>
      </div>

      {/* Demand bar */}
      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '4px', height: 4, marginBottom: 10 }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${skill.frequency}%` }}
          transition={{ delay: 0.9 + index * 0.12, duration: 0.8, ease: 'easeOut' }}
          style={{ height: '100%', background: 'var(--skill-gap)', borderRadius: '4px' }}
        />
      </div>

      {/* Trend + link */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Sparkline trend={skill.trend_label} />
          <span style={{
            color: skill.trend_label === 'rising' ? '#f59e0b' : 'var(--text-muted)',
            fontSize: '11px', fontFamily: 'Inter, sans-serif',
          }}>
            {skill.trend_label === 'rising' ? `▲ +${Math.round(skill.trend_velocity * 100)}%` : skill.trend_label}
          </span>
        </div>
        <span style={{
          color: 'var(--brand-purple-light)', fontSize: '12px', fontFamily: 'Inter, sans-serif',
          display: 'flex', alignItems: 'center', gap: 2,
        }}>
          See resources <ChevronRight size={12} />
        </span>
      </div>
    </motion.div>
  );
}
