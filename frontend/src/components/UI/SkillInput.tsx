import React, { useState, KeyboardEvent } from 'react';
import { X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGaugeStore } from '../../store/gaugeStore';

export function SkillInput() {
  const { userSkills, addUserSkill, removeUserSkill } = useGaugeStore();
  const [inputVal, setInputVal] = useState('');

  const handleAdd = () => {
    const v = inputVal.trim();
    if (v) { addUserSkill(v); setInputVal(''); }
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div style={{ width: '100%' }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: '12px', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Your Skills
      </p>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '100px',
        padding: '6px 8px 6px 14px',
        gap: 8,
      }}>
        <input
          id="skill-input"
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type a skill + Enter"
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: 'var(--text-primary)', fontSize: '13px', fontFamily: 'Inter, sans-serif',
          }}
        />
        <button
          onClick={handleAdd}
          disabled={!inputVal.trim()}
          style={{
            background: 'rgba(124,58,237,0.2)',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: '50%',
            width: 28, height: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: inputVal.trim() ? 'pointer' : 'not-allowed',
            opacity: inputVal.trim() ? 1 : 0.4,
            color: 'var(--brand-purple-light)',
            flexShrink: 0,
          }}
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Skill chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
        <AnimatePresence>
          {userSkills.map((skill) => (
            <motion.span
              key={skill}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: 'rgba(124,58,237,0.15)',
                border: '1px solid rgba(124,58,237,0.3)',
                borderRadius: '100px',
                padding: '4px 10px',
                fontSize: '12px',
                fontFamily: 'Inter, sans-serif',
                color: 'var(--brand-purple-light)',
              }}
              whileHover={{ rotate: -1, boxShadow: '0 0 10px rgba(124,58,237,0.3)' }}
            >
              {skill}
              <button
                onClick={() => removeUserSkill(skill)}
                style={{
                  background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                  color: 'var(--brand-purple-light)', display: 'flex', alignItems: 'center',
                  opacity: 0.7,
                }}
              >
                <X size={10} />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      {userSkills.length === 0 && (
        <p style={{ color: 'var(--text-muted)', fontSize: '11px', fontFamily: 'Inter, sans-serif', marginTop: 8 }}>
          Add your skills to see your readiness score update live
        </p>
      )}
    </div>
  );
}
