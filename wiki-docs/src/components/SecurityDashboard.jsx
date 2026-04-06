import React, { useState, useEffect, useMemo } from 'react';
import { ShieldCheck, Network, Lock, Activity, Fingerprint, EyeOff, CheckCircle, AlertTriangle, TrendingUp, Brain, ArrowLeft, FileWarning, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// CSS-based radar chart component (4-axis)
const RadarChart = ({ dimensions }) => {
  const axes = Object.values(dimensions);
  const size = 300;
  const center = size / 2;
  const radius = 75;
  
  // 4 axes at 0°, 90°, 180°, 270°
  const angleStep = (2 * Math.PI) / 4;
  const axisAngles = [
    -Math.PI / 2,       // top
    0,                   // right
    Math.PI / 2,        // bottom
    Math.PI,            // left
  ];

  const points = axes.map((dim, i) => {
    const angle = axisAngles[i];
    const r = (dim.score / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      label: dim.label,
      score: dim.score,
      labelX: center + (radius + 36) * Math.cos(angle),
      labelY: center + (radius + 36) * Math.sin(angle),
    };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  // Grid rings
  const rings = [25, 50, 75, 100];

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full max-w-[280px]">
      {/* Grid rings */}
      {rings.map(pct => {
        const r = (pct / 100) * radius;
        const ringPoints = axisAngles.map(angle => ({
          x: center + r * Math.cos(angle),
          y: center + r * Math.sin(angle),
        }));
        const d = ringPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
        return <path key={pct} d={d} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />;
      })}

      {/* Axis lines */}
      {axisAngles.map((angle, i) => (
        <line
          key={i}
          x1={center}
          y1={center}
          x2={center + radius * Math.cos(angle)}
          y2={center + radius * Math.sin(angle)}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
      ))}

      {/* Data polygon */}
      <motion.path
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        d={pathD}
        fill="rgba(209, 232, 226, 0.15)"
        stroke="rgba(209, 232, 226, 0.6)"
        strokeWidth="2"
        style={{ transformOrigin: `${center}px ${center}px` }}
      />

      {/* Data points */}
      {points.map((p, i) => (
        <motion.circle
          key={i}
          initial={{ r: 0 }}
          animate={{ r: 4 }}
          transition={{ delay: 0.3 + i * 0.1 }}
          cx={p.x}
          cy={p.y}
          fill="rgba(209, 232, 226, 0.9)"
          stroke="rgba(209, 232, 226, 0.4)"
          strokeWidth="2"
        />
      ))}

      {/* Labels */}
      {points.map((p, i) => (
        <text
          key={`label-${i}`}
          x={p.labelX}
          y={p.labelY}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-white/60 text-[9px] font-mono"
        >
          {p.label}
        </text>
      ))}

      {/* Score labels */}
      {points.map((p, i) => (
        <text
          key={`score-${i}`}
          x={p.labelX}
          y={p.labelY + 12}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-nordic-mint text-[10px] font-mono font-bold"
        >
          {p.score}
        </text>
      ))}
    </svg>
  );
};

const SecurityDashboard = () => {
  const navigate = useNavigate();
  const [linterReport, setLinterReport] = useState({ issues: [] });
  const [insightReport, setInsightReport] = useState({ themeDensity: {}, suggestions: [], totalNodes: 0, conflicts: 0, primaryTheme: '...' });
  const [deliveryLog, setDeliveryLog] = useState({ actions: [] });
  const [healthReport, setHealthReport] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [lintRes, insightRes, logRes, healthRes] = await Promise.all([
          fetch('/src/linter-report.json').catch(() => null),
          fetch('/src/insight-report.json').catch(() => null),
          fetch('/src/delivery-log.json').catch(() => null),
          fetch('/src/health-report.json').catch(() => null)
        ]);
        if (lintRes?.ok) setLinterReport(await lintRes.json());
        if (insightRes?.ok) setInsightReport(await insightRes.json());
        if (logRes?.ok) setDeliveryLog(await logRes.json());
        if (healthRes?.ok) setHealthReport(await healthRes.json());
      } catch (e) {
        console.warn('Security Dashboard: data load partial failure');
      }
    };
    loadData();
  }, []);

  const compositeScore = healthReport?.composite ?? Math.max(0, 100 - (linterReport.issues.length * 8));
  const grade = healthReport?.grade ?? '—';
  const scoreColor = compositeScore >= 80 ? 'text-nordic-mint' : compositeScore >= 60 ? 'text-yellow-400' : 'text-rose-400';
  const badgeStyle = compositeScore >= 80 
    ? 'bg-nordic-mint/20 text-nordic-mint border-nordic-mint/30' 
    : 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';

  // Mini sparkline: events per date
  const sparklineData = useMemo(() => {
    const actions = deliveryLog.actions || [];
    const dateCounts = {};
    actions.forEach(a => {
      const d = a.timestamp ? new Date(a.timestamp).toLocaleDateString() : 'unknown';
      dateCounts[d] = (dateCounts[d] || 0) + 1;
    });
    const entries = Object.entries(dateCounts).sort(([a], [b]) => new Date(a) - new Date(b));
    const max = Math.max(...entries.map(([,v]) => v), 1);
    return entries.map(([date, count]) => ({ date, count, pct: (count / max) * 100 }));
  }, [deliveryLog]);

  return (
    <div className="flex-1 flex overflow-hidden bg-nordic-charcoal font-sans text-white relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-nordic-mint/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-nordic-blue/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="flex-1 overflow-y-auto px-12 py-16 custom-scrollbar scroll-smooth relative z-10">
        <button 
          onClick={() => navigate('/')}
          className="mb-12 flex items-center gap-3 text-nordic-sage font-bold text-sm hover:-translate-x-1 transition-transform group"
        >
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-4 h-4 text-nordic-sage" />
          </div>
          Return to Wiki Hub
        </button>

        {/* Header */}
        <div className="flex items-start justify-between mb-16">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.2em] ${badgeStyle} flex items-center gap-2 border`}>
                {compositeScore >= 80 ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                {compositeScore >= 80 ? 'Systems Nominal' : 'Review Required'}
              </span>
            </div>
            <h1 className="text-5xl font-display font-extrabold mb-4 leading-tight tracking-tight">
              Knowledge <br/><span className="text-nordic-sage">Trust Center</span>
            </h1>
            <p className="text-nordic-blue font-mono text-sm uppercase tracking-[0.2em] opacity-80">
              Autonomous Governance & Integrity Monitoring
            </p>
          </div>

          {/* Composite Score + Grade */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-right"
          >
             <div className="inline-flex flex-col items-center p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md min-w-[140px]">
               <ShieldCheck className={`w-10 h-10 ${scoreColor} mb-2`} />
               <p className={`text-4xl font-display font-bold ${scoreColor}`}>{grade}</p>
               <p className="text-2xl font-mono font-bold mt-1">{compositeScore}<span className="text-sm opacity-50">/100</span></p>
               <p className="text-[10px] uppercase font-mono tracking-widest opacity-60 mt-1">Health Score</p>
             </div>
          </motion.div>
        </div>

        {/* Radar Chart + Dimension Details */}
        {healthReport && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden mb-12"
          >
            <div className="px-8 py-6 border-b border-white/10 bg-white/5 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-nordic-sage" />
              <h3 className="font-bold text-lg">Health Dimensions</h3>
              <span className="ml-auto text-[10px] font-mono text-white/30 uppercase tracking-widest">4-Axis Analysis</span>
            </div>
            <div className="p-8 flex items-center gap-12">
              {/* Radar */}
              <div className="w-[280px] shrink-0">
                <RadarChart dimensions={healthReport.dimensions} />
              </div>
              {/* Dimension cards */}
              <div className="flex-1 grid grid-cols-2 gap-4">
                {Object.entries(healthReport.dimensions).map(([key, dim], i) => (
                  <motion.div 
                    key={key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="p-4 bg-white/5 rounded-2xl border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white/70">{dim.label}</span>
                      <span className={`text-sm font-mono font-bold ${dim.score >= 80 ? 'text-nordic-mint' : dim.score >= 50 ? 'text-yellow-400' : 'text-rose-400'}`}>
                        {dim.score}
                      </span>
                    </div>
                    <p className="text-[10px] text-white/40">{dim.desc}</p>
                    <div className="mt-3 w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${dim.score}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                        className={`h-full rounded-full ${dim.score >= 80 ? 'bg-nordic-mint' : dim.score >= 50 ? 'bg-yellow-400' : 'bg-rose-400'}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          {/* Node 1: Knowledge Nodes */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:border-nordic-mint/50 transition-colors"
          >
            <Network className="w-8 h-8 text-nordic-sage mb-6" />
            <h3 className="text-lg font-bold mb-2">Knowledge Nodes</h3>
            <p className="text-sm opacity-60 mb-6">Total indexed pages in the semantic graph.</p>
            <div className="flex justify-between items-end">
              <span className="text-2xl font-mono">{insightReport.totalNodes}<span className="text-sm opacity-50 ml-1">pages</span></span>
              <span className="px-2 py-1 bg-nordic-mint/20 text-nordic-mint text-[10px] rounded uppercase font-bold tracking-wider">Indexed</span>
            </div>
          </motion.div>

          {/* Node 2: Integrity Issues */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`p-8 bg-white/5 border rounded-3xl transition-colors ${linterReport.issues.length > 0 ? 'border-rose-500/30 hover:border-rose-500/50' : 'border-white/10 hover:border-nordic-blue/50'}`}
          >
            {linterReport.issues.length > 0 ? <FileWarning className="w-8 h-8 text-rose-400 mb-6" /> : <Lock className="w-8 h-8 text-nordic-blue mb-6" />}
            <h3 className="text-lg font-bold mb-2">Integrity Issues</h3>
            <p className="text-sm opacity-60 mb-6">Broken links and structural anomalies detected.</p>
            <div className="flex justify-between items-end">
              <span className="text-2xl font-mono">{linterReport.issues.length}<span className="text-sm opacity-50 ml-1">issues</span></span>
              <span className={`px-2 py-1 ${linterReport.issues.length === 0 ? 'bg-nordic-blue/20 text-nordic-blue' : 'bg-rose-500/20 text-rose-400'} text-[10px] rounded uppercase font-bold tracking-wider`}>
                {linterReport.issues.length === 0 ? 'Clean' : 'Review'}
              </span>
            </div>
          </motion.div>

          {/* Node 3: Activity Density (Sparkline) */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:border-indigo-400/50 transition-colors cursor-pointer"
            onClick={() => navigate('/timeline')}
          >
            <Clock className="w-8 h-8 text-indigo-400 mb-6" />
            <h3 className="text-lg font-bold mb-2">Activity Density</h3>
            <p className="text-sm opacity-60 mb-4">Agent event frequency over time.</p>
            <div className="flex items-end gap-[2px] h-8 mb-3">
              {sparklineData.map((d, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(d.pct, 10)}%` }}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.04 }}
                  className="flex-1 bg-gradient-to-t from-indigo-500/40 to-indigo-400/80 rounded-t-sm min-w-[3px]"
                />
              ))}
            </div>
            <div className="flex justify-between items-end">
              <span className="text-sm font-mono text-white/50">{(deliveryLog.actions || []).length} events</span>
              <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] rounded uppercase font-bold tracking-wider flex items-center gap-1">
                Timeline <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </motion.div>
        </div>

        {/* Theme Density Breakdown */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden mb-12"
        >
          <div className="px-8 py-6 border-b border-white/10 bg-white/5 flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-nordic-sage" />
            <h3 className="font-bold text-lg">Semantic Theme Density</h3>
          </div>
          <div className="p-8 space-y-6">
            {Object.entries(insightReport.themeDensity).map(([theme, density], i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-medium text-white/70">{theme}</span>
                  <span className="text-xs font-mono text-nordic-mint">{density}%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${density}%` }}
                    transition={{ duration: 1, delay: 0.6 + i * 0.1 }}
                    className={`h-full rounded-full ${theme === insightReport.primaryTheme ? 'bg-gradient-to-r from-nordic-mint to-nordic-blue' : 'bg-white/20'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Live Audit Trail */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden mb-12"
        >
           <div className="px-8 py-6 border-b border-white/10 bg-white/5 flex items-center gap-3">
             <Activity className="w-5 h-5 text-nordic-sage" />
             <h3 className="font-bold text-lg">Live Audit Trail</h3>
             <span className="ml-auto text-[10px] font-mono text-white/30 uppercase tracking-widest">Last {deliveryLog.actions?.length || 0} events</span>
           </div>
           <div className="p-8 relative">
              <div className="font-mono text-xs space-y-4 opacity-80">
                {(deliveryLog.actions || []).slice(0, 6).map((action, i) => {
                  const time = action.timestamp ? new Date(action.timestamp).toLocaleTimeString() : '--:--:--';
                  const typeColor = action.type === 'governance' ? 'text-indigo-400' : action.status === 'success' ? 'text-nordic-mint' : 'text-yellow-400';
                  return (
                    <div key={i} className="flex items-start gap-4">
                      <span className="text-nordic-blue/80 shrink-0">{time}</span>
                      <span className={`shrink-0 ${typeColor}`}>[{(action.type || 'SYSTEM').toUpperCase()}]</span>
                      <span className="text-white">{action.message}</span>
                    </div>
                  );
                })}
                {(!deliveryLog.actions || deliveryLog.actions.length === 0) && (
                  <div className="text-center py-8 opacity-40">
                    <p className="text-sm">No audit events recorded yet.</p>
                  </div>
                )}
              </div>
              {(deliveryLog.actions || []).length > 6 && (
                <button 
                  onClick={() => navigate('/timeline')}
                  className="mt-6 flex items-center gap-2 text-indigo-400 text-xs font-mono hover:text-white transition-colors"
                >
                  View Full Timeline <ArrowRight className="w-3 h-3" />
                </button>
              )}
           </div>
        </motion.div>

        {/* Integrity Issue Details */}
        {linterReport.issues.length > 0 && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-rose-500/5 border border-rose-500/20 rounded-3xl overflow-hidden mb-12"
          >
            <div className="px-8 py-6 border-b border-rose-500/10 bg-rose-500/5 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <h3 className="font-bold text-lg">Active Integrity Issues</h3>
              <span className="ml-auto px-3 py-1 bg-rose-500/20 text-rose-300 text-[10px] rounded-full uppercase font-bold tracking-wider">
                {linterReport.issues.length} issues
              </span>
            </div>
            <div className="p-8 space-y-4">
              {linterReport.issues.map((issue, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-white/3 rounded-2xl border border-white/5">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${issue.severity === 'high' ? 'bg-rose-500' : 'bg-rose-300'}`} />
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider">{issue.type}</span>
                      <span className="text-[10px] font-mono text-white/30">in {issue.node}</span>
                    </div>
                    <p className="text-sm text-white/80">{issue.msg}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <div className="mt-24 pt-8 border-t border-white/10 flex items-center gap-8 opacity-60">
           <div className="flex items-center gap-2">
             <EyeOff className="w-4 h-4" />
             <span className="text-xs font-mono">Zero Knowledge Provider</span>
           </div>
           <div className="flex items-center gap-2">
             <Fingerprint className="w-4 h-4" />
             <span className="text-xs font-mono">Immutable Audit Trail</span>
           </div>
           <div className="flex items-center gap-2 ml-auto">
             <span className="text-xs font-mono text-white/30">Last scan: {healthReport?.lastUpdated ? new Date(healthReport.lastUpdated).toLocaleString() : insightReport.lastUpdated ? new Date(insightReport.lastUpdated).toLocaleString() : 'N/A'}</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;
