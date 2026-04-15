import React, { useState, KeyboardEvent } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGaugeStore } from '../../store/gaugeStore';

interface SearchBarProps {
  onSearch: (title: string) => void;
  compact?: boolean;
}

const EXAMPLE_CHIPS = ['Machine Learning Engineer', 'Product Manager', 'Full Stack Developer'];

export function SearchBar({ onSearch, compact = false }: SearchBarProps) {
  const { jobTitle, setJobTitle, isLoading } = useGaugeStore();
  const [focused, setFocused] = useState(false);

  const handleSubmit = () => {
    if (jobTitle.trim()) onSearch(jobTitle.trim());
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div style={{ width: '100%' }}>
      <motion.div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: compact ? '100%' : '600px',
          maxWidth: '90vw',
          height: compact ? '48px' : '64px',
          background: 'rgba(255,255,255,0.05)',
          border: `1px solid ${focused ? 'var(--brand-purple)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '100px',
          padding: '0 8px 0 20px',
          gap: 8,
          boxShadow: focused ? '0 0 0 4px var(--brand-purple-glow)' : 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
        layout
      >
        <Search size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
        <input
          id="job-title-search"
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKey}
          placeholder={compact ? 'Job title...' : 'Enter any job title... e.g. Data Scientist'}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontSize: compact ? '14px' : '16px',
            fontFamily: 'Inter, sans-serif',
          }}
          disabled={isLoading}
        />
        <motion.button
          id="search-analyze-btn"
          onClick={handleSubmit}
          disabled={isLoading || !jobTitle.trim()}
          whileTap={{ scale: 0.97 }}
          style={{
            background: 'var(--brand-purple)',
            border: 'none',
            borderRadius: '100px',
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: compact ? '13px' : '14px',
            padding: compact ? '8px 18px' : '12px 24px',
            cursor: isLoading || !jobTitle.trim() ? 'not-allowed' : 'pointer',
            opacity: isLoading || !jobTitle.trim() ? 0.6 : 1,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'opacity 0.2s',
          }}
        >
          {isLoading ? (
            <>
              <span style={{
                width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff', borderRadius: '50%',
                animation: 'spin 0.8s linear infinite', display: 'inline-block',
              }} />
              Analyzing
            </>
          ) : (
            <>Analyze →</>
          )}
        </motion.button>
      </motion.div>

      {/* Example chips — only on landing */}
      {!compact && (
        <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
          {EXAMPLE_CHIPS.map((chip) => (
            <motion.button
              key={chip}
              onClick={() => { setJobTitle(chip); onSearch(chip); }}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: 'rgba(124,58,237,0.12)',
                border: '1px solid rgba(124,58,237,0.25)',
                borderRadius: '100px',
                color: 'var(--brand-purple-light)',
                fontSize: '13px',
                fontFamily: 'Inter, sans-serif',
                padding: '8px 16px',
                cursor: 'pointer',
              }}
            >
              {chip}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
