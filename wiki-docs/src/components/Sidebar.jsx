import React from 'react';
import { Book, ChevronRight, Layout, Activity, Database, Server, Settings, Home, Heart, Microchip, BookOpen, Briefcase, FileText, PieChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Sidebar = ({ manifest, activePage, onPageSelect }) => {
  const navigate = useNavigate();

  const [selectedWorkspace, setSelectedWorkspace] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const workspaces = manifest.workspaces || [];

  // Dynamic category mapping with fallback
  const getCategoryTheme = (catKey) => {
    const themes = {
      'meta': { label: 'System Meta', icon: Settings, color: 'text-nordic-blue' },
      'infrastructure': { label: 'Infrastructure', icon: Server, color: 'text-nordic-sage' },
      'knowledge-base': { label: 'Knowledge Base', icon: Database, color: 'text-nordic-blue' },
      'assets': { label: 'Strategic Assets', icon: PieChart, color: 'text-indigo-400' },
      'personal': { label: 'Personal Growth', icon: Heart, color: 'text-pink-400' },
      'research': { label: 'Research & Thesis', icon: Microchip, color: 'text-nordic-mint' },
      'reading': { label: 'Reading Wiki', icon: BookOpen, color: 'text-nordic-charcoal' },
      'business': { label: 'Internal Intelligence', icon: Briefcase, color: 'text-nordic-blue' },
      'general': { label: 'General', icon: Book, color: 'text-nordic-sage' }
    };

    if (themes[catKey]) return themes[catKey];
    
    // Keyword-based fallback for unknown categories
    const k = catKey.toLowerCase();
    if (k.includes('tech') || k.includes('dev')) return { label: catKey, icon: Microchip, color: 'text-nordic-mint' };
    if (k.includes('health') || k.includes('fit')) return { label: catKey, icon: Activity, color: 'text-pink-400' };
    if (k.includes('plan') || k.includes('strat')) return { label: catKey, icon: PieChart, color: 'text-indigo-400' };
    
    return themes['general'];
  };

  // Filter pages by workspace and search query
  const filteredPages = manifest.pages.filter(p => {
    const matchWorkspace = selectedWorkspace === 'all' || p.workspace === selectedWorkspace;
    const q = searchQuery.toLowerCase();
    const matchQuery = !searchQuery || 
      p.title.toLowerCase().includes(q) || 
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) ||
      p.id.toLowerCase().includes(q);
    return matchWorkspace && matchQuery;
  });

  // Group pages by category
  const groupedPages = filteredPages.reduce((acc, page) => {
    const cat = page.category || 'general';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(page);
    return acc;
  }, {});

  const sortedCategories = [
    'meta', 
    'infrastructure', 
    'knowledge-base', 
    'assets',
    'personal', 
    'research', 
    'reading', 
    'business', 
    'general'
  ].filter(c => groupedPages[c]);

  return (
    <div className="w-80 h-screen select-none relative z-50">
      <div className="h-full glass m-4 rounded-3xl border border-white/40 flex flex-col overflow-hidden shadow-2xl">
        <motion.div 
          whileHover={{ backgroundColor: 'rgba(209, 232, 226, 0.1)' }}
          onClick={() => navigate('/')}
          className="p-8 border-b border-black/5 flex items-center gap-4 cursor-pointer group transition-colors"
        >
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-10 h-10 bg-nordic-blue rounded-xl flex items-center justify-center shadow-lg"
          >
            <Activity className="text-white w-6 h-6" strokeWidth={2.5} />
          </motion.div>
          <div>
            <h1 className="font-display font-extrabold text-lg text-nordic-charcoal leading-tight tracking-tight">LLM-Wiki Dev</h1>
            <p className="text-[10px] font-mono font-bold text-nordic-blue uppercase tracking-widest opacity-60">Autonomous Knowledge Hub</p>
          </div>
        </motion.div>

        {/* Workspace Selector */}
        <div className="px-6 py-4 border-b border-black/5 bg-black/5">
          <label className="block text-[9px] font-bold text-nordic-blue/50 uppercase tracking-widest mb-2">Workspace</label>
          <div className="relative group">
            <select 
              value={selectedWorkspace}
              onChange={(e) => setSelectedWorkspace(e.target.value)}
              className="w-full bg-white/50 border border-black/10 rounded-lg px-3 py-2 text-xs font-bold text-nordic-charcoal appearance-none focus:outline-none focus:ring-2 focus:ring-nordic-blue/20 transition-all cursor-pointer"
            >
              <option value="all">Global Ecosystem</option>
              {workspaces.map(ws => (
                <option key={ws.name} value={ws.name}>
                  {ws.name.toUpperCase()} {ws.source === 'readme' ? '📄' : ws.source === 'docs' ? '📁' : '🧠'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="px-8 mt-4 space-y-2">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/security')}
            className="flex items-center gap-2 px-3 py-1.5 bg-nordic-mint/10 border border-nordic-mint/30 rounded-full cursor-pointer hover:bg-nordic-mint/20 transition-colors"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-nordic-mint animate-pulse"></div>
            <span className="text-[9px] font-mono font-bold text-nordic-sage uppercase tracking-widest">Global Graph Synced</span>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/timeline')}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-full cursor-pointer hover:bg-indigo-500/20 transition-colors"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
            <span className="text-[9px] font-mono font-bold text-indigo-400/80 uppercase tracking-widest">Evolution Timeline</span>
          </motion.div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
          {/* Sidebar Search */}
          <div className="px-4 mb-8">
            <div className="relative group">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Knowledge..."
                className="w-full bg-white/40 border border-black/10 rounded-xl px-10 py-3 text-xs font-bold text-nordic-charcoal placeholder:text-nordic-charcoal/30 focus:outline-none focus:ring-2 focus:ring-nordic-blue/20 transition-all"
              />
              <Book className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-nordic-charcoal/20 group-focus-within:text-nordic-blue/50 transition-colors" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-md hover:bg-black/5 text-nordic-charcoal/30"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <motion.button 
            whileHover={{ x: 5, backgroundColor: 'rgba(209, 232, 226, 0.2)' }}
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-nordic-sage transition-all mb-8"
          >
            <Home className="w-4 h-4" />
            Ecosystem Overview
          </motion.button>

          {sortedCategories.map(catKey => {
            const theme = getCategoryTheme(catKey);
            const Icon = theme.icon;
            
            return (
              <div key={catKey} className="mb-10">
                <h3 className={`px-4 text-[10px] font-bold uppercase tracking-[0.3em] mb-4 flex items-center gap-2 ${theme.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {theme.label}
                </h3>
                <div className="space-y-1">
                  {groupedPages[catKey].map((page) => {
                    const isRaw = page.id.startsWith('RAW_') || page.title.toUpperCase().startsWith('RAW:');
                    return (
                      <motion.button
                        key={page.id}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onPageSelect(page)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all group ${
                          activePage?.id === page.id 
                            ? 'bg-nordic-blue text-white shadow-lg' 
                            : 'text-nordic-charcoal/70 hover:bg-black/5 hover:text-nordic-charcoal'
                        } ${isRaw ? 'opacity-70 italic' : ''}`}
                      >
                        <span className="flex items-center gap-3 font-semibold truncate text-left">
                          {isRaw && <Database className="w-3 h-3 text-nordic-blue/40 group-hover:text-nordic-blue transition-colors" />}
                          {page.title.replace(/^RAW:\s*/i, '')}
                        </span>
                        <div className="flex items-center gap-2">
                          {isRaw && (
                            <span className="text-[7px] font-mono font-bold bg-nordic-blue/10 text-nordic-blue px-1.5 py-0.5 rounded uppercase tracking-tighter">Raw</span>
                          )}
                          <ChevronRight className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${
                            activePage?.id === page.id ? 'text-white/50' : 'text-nordic-blue/40'
                          }`} />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-6 border-t border-black/5">
          <div className="flex items-center gap-3 px-4 py-3 bg-nordic-charcoal rounded-2xl shadow-xl overflow-hidden relative group">
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-2 h-2 rounded-full bg-nordic-mint shadow-[0_0_10px_rgba(209,232,226,0.8)]"
            />
            <span className="text-[10px] font-mono font-bold text-nordic-sage uppercase tracking-widest relative z-10">
              Agent Status: Active
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-nordic-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
