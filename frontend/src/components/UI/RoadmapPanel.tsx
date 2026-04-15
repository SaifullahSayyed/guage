import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, CheckCircle, Clock, BookOpen, Youtube, Github, Code } from 'lucide-react';
import { useGaugeStore } from '../../store/gaugeStore';
import type { RoadmapWeek } from '../../types';

function PlatformIcon({ platform }: { platform: string }) {
  const p = platform.toLowerCase();
  if (p.includes('youtube')) return <Youtube size={16} color="#ff0000" />;
  if (p.includes('github')) return <Github size={16} color="#ffffff" />;
  if (p.includes('coursera')) return <BookOpen size={16} color="#0056d3" />;
  return <Code size={16} color="#7c3aed" />;
}

function TypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    Video: '#ef4444',
    Course: '#3b82f6',
    Project: '#10b981',
    Documentation: '#f59e0b',
    Tutorial: '#a855f7',
  };
  const color = colors[type] || '#6b7280';
  return (
    <span style={{
      background: `${color}22`, border: `1px solid ${color}44`,
      borderRadius: '100px', padding: '2px 8px',
      color, fontSize: '10px', fontFamily: 'Inter, sans-serif', fontWeight: 600,
    }}>
      {type}
    </span>
  );
}

function ResourceCard({ week }: { week: RoadmapWeek }) {
  const [completed, setCompleted] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: week.week * 0.1 }}
      style={{
        background: completed ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${completed ? 'rgba(16,185,129,0.3)' : 'var(--border-subtle)'}`,
        borderRadius: '12px',
        padding: '14px',
        marginBottom: 10,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ color: 'var(--brand-purple-light)', fontSize: '11px', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>
          WEEK {week.week}
        </span>
        <TypeBadge type={week.resource.type} />
      </div>

      <p style={{ margin: '0 0 6px', color: 'var(--text-primary)', fontSize: '13px', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
        {week.resource.title}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <PlatformIcon platform={week.resource.platform} />
        <span style={{ color: 'var(--text-secondary)', fontSize: '11px', fontFamily: 'Inter, sans-serif' }}>
          {week.resource.platform}
        </span>
        <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>·</span>
        <Clock size={11} color="var(--text-muted)" />
        <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontFamily: 'Inter, sans-serif' }}>
          {week.resource.duration_hours}h
        </span>
      </div>

      <p style={{ margin: '0 0 10px', color: 'var(--text-secondary)', fontSize: '11px', fontFamily: 'Inter, sans-serif', lineHeight: 1.5, fontStyle: 'italic' }}>
        "{week.resource.why}"
      </p>

      <div style={{ display: 'flex', gap: 8 }}>
        <a
          href={week.resource.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            color: 'var(--brand-purple-light)', fontSize: '12px',
            fontFamily: 'Inter, sans-serif', textDecoration: 'none',
            flex: 1,
          }}
        >
          <ExternalLink size={12} />
          Open resource
        </a>
        <button
          onClick={() => setCompleted(!completed)}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: completed ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${completed ? 'rgba(16,185,129,0.3)' : 'var(--border-subtle)'}`,
            borderRadius: '8px',
            padding: '4px 10px',
            color: completed ? '#10b981' : 'var(--text-muted)',
            fontSize: '11px', fontFamily: 'Inter, sans-serif',
            cursor: 'pointer',
          }}
        >
          <CheckCircle size={11} />
          {completed ? 'Done!' : 'Mark done'}
        </button>
      </div>
    </motion.div>
  );
}

function SkeletonCard({ index }: { index: number }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '12px',
      padding: '14px',
      marginBottom: 10,
    }}>
      <div className="skeleton" style={{ height: 12, width: '30%', borderRadius: 6, marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 14, width: '80%', borderRadius: 6, marginBottom: 6 }} />
      <div className="skeleton" style={{ height: 11, width: '50%', borderRadius: 6, marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 11, width: '90%', borderRadius: 6 }} />
    </div>
  );
}

export function RoadmapPanel() {
  const { isRoadmapOpen, setRoadmapOpen, roadmapData, isRoadmapLoading, selectedGapSkill } = useGaugeStore();

  return (
    <AnimatePresence>
      {isRoadmapOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setRoadmapOpen(false)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 100,
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed', right: 0, top: 0, bottom: 0,
              width: 380, maxWidth: '92vw',
              background: 'var(--bg-secondary)',
              borderLeft: '1px solid var(--border-subtle)',
              zIndex: 101,
              overflowY: 'auto',
              padding: '24px',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '18px', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>
                  {selectedGapSkill} Roadmap
                </h2>
                <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>
                  3-week free learning path
                </p>
              </div>
              <button
                onClick={() => setRoadmapOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-subtle)',
                  borderRadius: '8px', padding: '8px', cursor: 'pointer', color: 'var(--text-secondary)',
                  display: 'flex', alignItems: 'center',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            {isRoadmapLoading ? (
              <>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', fontFamily: 'Inter, sans-serif', marginBottom: 16 }}>
                  Generating your personalized roadmap with AI...
                </p>
                {[0, 1, 2].map((i) => <SkeletonCard key={i} index={i} />)}
              </>
            ) : roadmapData ? (
              <>
                {roadmapData.weeks.map((week) => (
                  <ResourceCard key={week.week} week={week} />
                ))}

                {/* Project idea */}
                <div style={{
                  background: 'rgba(124,58,237,0.08)',
                  border: '1px solid rgba(124,58,237,0.2)',
                  borderRadius: '12px',
                  padding: '14px',
                  marginTop: 6,
                }}>
                  <p style={{ margin: '0 0 6px', color: 'var(--brand-purple-light)', fontSize: '11px', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>
                    PORTFOLIO PROJECT
                  </p>
                  <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '13px', fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}>
                    {roadmapData.project_idea}
                  </p>
                </div>

                <div style={{
                  marginTop: 12, padding: '10px 14px',
                  background: 'rgba(16,185,129,0.08)',
                  border: '1px solid rgba(16,185,129,0.2)',
                  borderRadius: '10px',
                  color: '#10b981', fontSize: '12px', fontFamily: 'Inter, sans-serif',
                }}>
                  ⏱ Time to hireable: <strong>{roadmapData.time_to_hireable}</strong>
                </div>
              </>
            ) : null}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
