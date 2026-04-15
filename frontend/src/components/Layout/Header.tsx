import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useGaugeStore } from '../../store/gaugeStore';
import { SearchBar } from '../UI/SearchBar';

export function Header({ onSearch }: { onSearch: (title: string) => void }) {
  const { skillData, resetAll } = useGaugeStore();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 24px',
        background: 'rgba(5,5,8,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky', top: 0, zIndex: 50,
        gap: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <span style={{
          fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
          fontSize: '22px', color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
        }}>
          GAUGE
        </span>
        {skillData && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'rgba(124,58,237,0.15)',
              border: '1px solid rgba(124,58,237,0.3)',
              borderRadius: '100px',
              padding: '3px 12px',
              fontSize: '12px',
              fontFamily: 'Inter, sans-serif',
              color: 'var(--brand-purple-light)',
            }}
          >
            {skillData.job_title}
          </motion.span>
        )}
      </div>

      {skillData && (
        <div style={{ flex: 1, maxWidth: 400 }}>
          <SearchBar onSearch={onSearch} compact />
        </div>
      )}

      {skillData && (
        <motion.button
          onClick={resetAll}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '100px',
            padding: '8px 14px',
            color: 'var(--text-secondary)',
            fontSize: '13px', fontFamily: 'Inter, sans-serif',
            cursor: 'pointer', flexShrink: 0,
          }}
        >
          <RefreshCw size={13} />
          New Search
        </motion.button>
      )}
    </motion.header>
  );
}
