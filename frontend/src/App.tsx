import React, { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SceneContainer } from './components/ThreeScene/SceneContainer';
import { SearchBar } from './components/UI/SearchBar';
import { SkillInput } from './components/UI/SkillInput';
import { ReadinessScore } from './components/UI/ReadinessScore';
import { GapCard } from './components/UI/GapCard';
import { MarketPulse } from './components/UI/MarketPulse';
import { RoadmapPanel } from './components/UI/RoadmapPanel';
import { Header } from './components/Layout/Header';
import { useGaugeStore } from './store/gaugeStore';
import { useGaugeData } from './hooks/useGaugeData';
import { AlertCircle, Database } from 'lucide-react';

function LandingView({ onSearch }: { onSearch: (title: string) => void }) {
  return (
    <motion.div
      key="landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 24px',
        textAlign: 'center',
        zIndex: 10,
      }}
    >
      <motion.h1
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 'clamp(2.5rem, 8vw, 5rem)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: 'var(--text-primary)',
          marginBottom: 16,
          lineHeight: 1.1,
        }}
      >
        GAUGE
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.6 }}
        style={{
          color: 'var(--text-secondary)',
          fontSize: '1.15rem',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          marginBottom: 48,
          maxWidth: 500,
        }}
      >
        Know exactly where you stand before you apply.
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <SearchBar onSearch={onSearch} />
      </motion.div>
    </motion.div>
  );
}

function LoadingOverlay() {
  const messages = ['Scanning job market...', 'Extracting skills...', 'Calculating your gap...'];
  const [msgIdx, setMsgIdx] = React.useState(0);

  React.useEffect(() => {
    const t = setInterval(() => setMsgIdx((i) => (i + 1) % messages.length), 1500);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        zIndex: 20,
      }}
    >
      <div style={{ position: 'relative', width: 80, height: 80, marginBottom: 24 }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: 'radial-gradient(circle, #7c3aed, #4c1d95)',
          animation: 'pulse-dot 1.5s ease infinite',
          boxShadow: '0 0 40px rgba(124,58,237,0.6)',
        }} />
        <div style={{
          position: 'absolute', top: -8, left: -8, right: -8, bottom: -8,
          borderRadius: '50%',
          border: '2px solid rgba(124,58,237,0.3)',
          animation: 'spin 2s linear infinite',
        }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={msgIdx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          style={{
            color: 'var(--text-secondary)',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
          }}
        >
          {messages[msgIdx]}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}

function AnalysisView() {
  const { skillData, usingFallback } = useGaugeStore();
  if (!skillData) return null;

  const gapSkills = skillData.skills.filter((s) => !s.owned)
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 3);

  return (
    <motion.div
      key="analysis"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      style={{
        display: 'flex',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <motion.div
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        style={{
          width: 300,
          minWidth: 260,
          flexShrink: 0,
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
          overflowY: 'auto',
          borderRight: '1px solid var(--border-subtle)',
          pointerEvents: 'auto',
          zIndex: 50,
        }}
        className="left-panel"
      >
        <ReadinessScore score={skillData.readiness_score} />
        <div style={{ height: 1, background: 'var(--border-subtle)' }} />
        <SkillInput />
        <div style={{ height: 1, background: 'var(--border-subtle)' }} />
        <MarketPulse items={skillData.market_pulse} />
      </motion.div>

      <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
        <div style={{
          position: 'absolute', bottom: 20, left: 20, zIndex: 5,
          display: 'flex', flexDirection: 'column', gap: 6,
          pointerEvents: 'none',
        }}>
          {[
            { color: '#10b981', label: 'Skills you own' },
            { color: '#f43f5e', label: 'Gap skills (pulsing = hot)' },
            { color: '#374151', label: 'Market skills' },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, boxShadow: `0 0 6px ${item.color}` }} />
              <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontFamily: 'Inter, sans-serif' }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div style={{
          position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
          zIndex: 5,
          background: 'rgba(5,5,8,0.7)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '100px',
          padding: '4px 14px',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontFamily: 'Inter, sans-serif' }}>
            Analyzed <strong style={{ color: 'var(--brand-purple-light)' }}>{skillData.total_postings_analyzed}</strong> job postings
          </span>
          {usingFallback && (
            <span style={{
              background: 'rgba(245,158,11,0.15)',
              border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: '100px',
              padding: '2px 8px',
              color: '#f59e0b',
              fontSize: '10px',
              fontFamily: 'Inter, sans-serif',
            }}>
              Using cached market data
            </span>
          )}
        </div>

        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'auto' }}>
          <SceneContainer skills={skillData.skills} showGlobe={true} />
        </div>
      </div>

      <motion.div
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        style={{
          width: 320,
          minWidth: 280,
          flexShrink: 0,
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          overflowY: 'auto',
          borderLeft: '1px solid var(--border-subtle)',
          pointerEvents: 'auto',
          zIndex: 50,
        }}
        className="right-panel"
      >
        <div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '12px', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
            Top Skill Gaps
          </p>
          {gapSkills.length > 0 ? (
            gapSkills.map((skill, i) => (
              <GapCard key={skill.name} skill={skill} index={i} />
            ))
          ) : (
            <div style={{
              padding: '20px', textAlign: 'center',
              border: '1px solid var(--border-subtle)', borderRadius: '12px',
            }}>
              <p style={{ color: '#10b981', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                🎉 You have all top skills!
              </p>
            </div>
          )}
        </div>

        <div style={{ marginTop: 8 }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '12px', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
            All Market Skills
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {skillData.skills.slice(0, 12).map((skill) => (
              <div key={skill.name} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 0',
                borderBottom: '1px solid var(--border-subtle)',
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                  background: skill.owned ? '#10b981' : skill.trend_label === 'rising' ? '#f43f5e' : '#374151',
                }} />
                <span style={{ flex: 1, color: 'var(--text-primary)', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>
                  {skill.name}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontFamily: 'Inter, sans-serif' }}>
                  {skill.frequency}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function App() {
  const { skillData, isLoading, error } = useGaugeStore();
  const { search } = useGaugeData();

  const showLanding = !skillData && !isLoading;
  const showLoading = isLoading;
  const showAnalysis = !!skillData && !isLoading;

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      background: 'var(--bg-primary)', overflow: 'hidden',
    }}>
      {(showAnalysis) && <Header onSearch={search} />}

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          zIndex: showLanding ? 0 : 1,
          pointerEvents: showLanding ? 'auto' : 'none',
          opacity: showAnalysis ? 0 : 1,
          transition: 'opacity 0.5s',
        }}>
          <SceneContainer skills={[]} showGlobe={false} />
        </div>

        <AnimatePresence mode="wait">
          {showLanding && (
            <LandingView key="landing" onSearch={search} />
          )}
          {showLoading && (
            <LoadingOverlay key="loading" />
          )}
          {showAnalysis && (
            <div key="analysis" style={{ position: 'absolute', inset: 0 }}>
              <AnalysisView />
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              style={{
                position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(244,63,94,0.15)',
                border: '1px solid rgba(244,63,94,0.3)',
                borderRadius: '12px',
                padding: '12px 20px',
                display: 'flex', alignItems: 'center', gap: 10,
                zIndex: 50, maxWidth: '90vw',
              }}
            >
              <AlertCircle size={16} color="#f43f5e" />
              <span style={{ color: 'var(--text-primary)', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>
                {error}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <RoadmapPanel />

      <style>{`
        @media (max-width: 900px) {
          .left-panel { display: none !important; }
          .right-panel { display: none !important; }
        }
        @media (max-width: 767px) {
          .left-panel { display: flex !important; width: 100% !important; border-right: none !important; }
          .right-panel { display: flex !important; width: 100% !important; border-left: none !important; }
        }
      `}</style>
    </div>
  );
}
