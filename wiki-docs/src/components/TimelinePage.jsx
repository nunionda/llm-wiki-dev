import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Clock, GitBranch, Shield, BookOpen, Zap, Filter, Activity, TrendingUp, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const EVENT_TYPES = {
  governance: { label: 'Governance', icon: Shield, color: 'text-indigo-400', bg: 'bg-indigo-500/20', border: 'border-indigo-500/30' },
  bookkeeper: { label: 'Bookkeeper', icon: BookOpen, color: 'text-nordic-mint', bg: 'bg-nordic-mint/20', border: 'border-nordic-mint/30' },
  dispatch: { label: 'Dispatch', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30' },
  refactor: { label: 'Refactor', icon: GitBranch, color: 'text-rose-400', bg: 'bg-rose-500/20', border: 'border-rose-500/30' },
  apm: { label: 'Project Mgr', icon: TrendingUp, color: 'text-cyan-400', bg: 'bg-cyan-500/20', border: 'border-cyan-500/30' },
  system: { label: 'System', icon: Activity, color: 'text-white/50', bg: 'bg-white/10', border: 'border-white/20' }
};

const TimelinePage = () => {
  const navigate = useNavigate();
  const [deliveryLog, setDeliveryLog] = useState({ actions: [] });
  const [healthReport, setHealthReport] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      try {
        const [logRes, healthRes] = await Promise.all([
          fetch('/src/delivery-log.json').catch(() => null),
          fetch('/src/health-report.json').catch(() => null)
        ]);
        if (logRes?.ok) setDeliveryLog(await logRes.json());
        if (healthRes?.ok) setHealthReport(await healthRes.json());
      } catch (e) {
        console.warn('Timeline: data load partial failure');
      }
    };
    load();
  }, []);

  const filteredEvents = useMemo(() => {
    const actions = deliveryLog.actions || [];
    if (activeFilter === 'all') return actions;
    return actions.filter(a => a.type === activeFilter);
  }, [deliveryLog, activeFilter]);

  // Group events by date
  const groupedByDate = useMemo(() => {
    const groups = {};
    filteredEvents.forEach(event => {
      const date = event.timestamp ? new Date(event.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown';
      if (!groups[date]) groups[date] = [];
      groups[date].push(event);
    });
    return groups;
  }, [filteredEvents]);

  // Stats
  const stats = useMemo(() => {
    const actions = deliveryLog.actions || [];
    const typeCounts = {};
    actions.forEach(a => {
      const t = a.type || 'system';
      typeCounts[t] = (typeCounts[t] || 0) + 1;
    });
    return {
      total: actions.length,
      typeCounts,
      uniqueTypes: Object.keys(typeCounts).length
    };
  }, [deliveryLog]);

  // Mini sparkline data: event count per unique date
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

  const filterTypes = ['all', ...Object.keys(EVENT_TYPES)];

  return (
    <div className="flex-1 flex overflow-hidden bg-nordic-charcoal font-sans text-white relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-nordic-mint/5 rounded-full blur-[100px] pointer-events-none" />

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
              <span className="px-4 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.2em] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Live Chronicle
              </span>
            </div>
            <h1 className="text-5xl font-display font-extrabold mb-4 leading-tight tracking-tight">
              Knowledge <br/><span className="text-nordic-sage">Evolution</span>
            </h1>
            <p className="text-nordic-blue font-mono text-sm uppercase tracking-[0.2em] opacity-80">
              Historical Activity & Growth Tracking
            </p>
          </div>

          {/* Health Score Badge */}
          {healthReport && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-right"
            >
              <div className="inline-flex flex-col items-end p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
                <span className={`text-4xl font-display font-bold mb-1 ${
                  healthReport.composite >= 80 ? 'text-nordic-mint' : healthReport.composite >= 60 ? 'text-yellow-400' : 'text-rose-400'
                }`}>{healthReport.grade}</span>
                <p className="text-2xl font-mono font-bold">{healthReport.composite}<span className="text-sm opacity-50">/100</span></p>
                <p className="text-[10px] uppercase font-mono tracking-widest opacity-60 mt-1">Health Score</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
            className="p-6 bg-white/5 border border-white/10 rounded-2xl">
            <p className="text-[10px] font-mono uppercase tracking-widest opacity-50 mb-2">Total Events</p>
            <p className="text-3xl font-mono font-bold">{stats.total}</p>
          </motion.div>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            className="p-6 bg-white/5 border border-white/10 rounded-2xl">
            <p className="text-[10px] font-mono uppercase tracking-widest opacity-50 mb-2">Event Types</p>
            <p className="text-3xl font-mono font-bold">{stats.uniqueTypes}</p>
          </motion.div>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
            className="p-6 bg-white/5 border border-white/10 rounded-2xl">
            <p className="text-[10px] font-mono uppercase tracking-widest opacity-50 mb-2">Activity Density</p>
            {/* Mini sparkline */}
            <div className="flex items-end gap-[2px] h-8">
              {sparklineData.map((d, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(d.pct, 8)}%` }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.05 }}
                  className="flex-1 bg-gradient-to-t from-indigo-500/40 to-indigo-400/80 rounded-t-sm min-w-[3px]"
                  title={`${d.date}: ${d.count} events`}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Filter Bar */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}
          className="flex items-center gap-3 mb-10 flex-wrap"
        >
          <Filter className="w-4 h-4 text-white/40" />
          {filterTypes.map(type => {
            const meta = type === 'all' ? null : EVENT_TYPES[type];
            return (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                  activeFilter === type 
                    ? 'bg-white/15 text-white border border-white/30' 
                    : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white/70'
                }`}
              >
                {type === 'all' ? 'All' : meta?.label || type}
                {type !== 'all' && stats.typeCounts[type] && (
                  <span className="ml-2 opacity-50">{stats.typeCounts[type]}</span>
                )}
              </button>
            );
          })}
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10" />

          <AnimatePresence mode="popLayout">
            {Object.entries(groupedByDate).map(([date, events], gi) => (
              <motion.div 
                key={date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: gi * 0.05 }}
                className="mb-10"
              >
                {/* Date Header */}
                <div className="flex items-center gap-4 mb-6 ml-1">
                  <div className="w-3 h-3 rounded-full bg-white/20 border-2 border-white/40 relative z-10" />
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-white/30" />
                    <span className="text-xs font-mono font-bold text-white/40 uppercase tracking-widest">{date}</span>
                  </div>
                </div>

                {/* Event Cards */}
                <div className="ml-14 space-y-3">
                  {events.map((event, i) => {
                    const type = event.type || 'system';
                    const meta = EVENT_TYPES[type] || EVENT_TYPES.system;
                    const Icon = meta.icon;
                    const time = event.timestamp ? new Date(event.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '--:--';

                    return (
                      <motion.div
                        key={event.id || i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: gi * 0.05 + i * 0.03 }}
                        className={`p-5 rounded-2xl border backdrop-blur-sm ${meta.bg} ${meta.border} group hover:scale-[1.01] transition-transform`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${meta.bg}`}>
                            <Icon className={`w-4 h-4 ${meta.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1.5">
                              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${meta.color}`}>
                                {meta.label}
                              </span>
                              <span className="text-[10px] font-mono text-white/30">{time}</span>
                              {event.target && (
                                <span className="text-[10px] font-mono text-white/20 truncate">→ {event.target}</span>
                              )}
                            </div>
                            <p className="text-sm text-white/80 leading-relaxed">{event.message}</p>
                          </div>
                          <span className={`shrink-0 px-2 py-1 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
                            event.status === 'success' ? 'bg-nordic-mint/20 text-nordic-mint' : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {event.status || 'done'}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredEvents.length === 0 && (
            <div className="ml-14 py-16 text-center">
              <p className="text-white/30 text-sm font-mono">No events match the current filter.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-24 pt-8 border-t border-white/10 flex items-center gap-8 opacity-60">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-mono">Immutable Event Log</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button 
              onClick={() => navigate('/security')}
              className="text-xs font-mono text-nordic-mint hover:text-white transition-colors"
            >
              Trust Center →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelinePage;
