import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { 
  FileText, 
  Calendar, 
  Tag, 
  Share2, 
  ArrowLeft, 
  ChevronRight, 
  Zap, 
  Shield, 
  Database,
  History,
  Download,
  Terminal,
  Layers,
  Network,
  Activity,
  Info,
  Presentation,
  Search,
  X,
  AlertTriangle,
  AlertCircle,
  Clock,
  Link2Off,
  Sparkles,
  PieChart,
  TrendingUp,
  Brain
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import GraphView from './GraphView';
import { Marp } from '@marp-team/marp-react';

const DocViewer = ({ doc, onBack }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [metadata, setMetadata] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analysis'); // 'analysis', 'graph', 'slides'
  const [graphData, setGraphData] = useState(null);
  const [linterReport, setLinterReport] = useState({ issues: [] });
  const [insightReport, setInsightReport] = useState({ themeDensity: {}, suggestions: [], primaryTheme: 'Scanning...' });
  
  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const fetchDoc = async () => {
    if (!doc || !doc.path) return;
    setLoading(true);
    try {
      const response = await fetch(doc.path);
      const contentType = response.headers.get('content-type') || '';
      const text = await response.text();
      
      if (contentType.includes('text/html') || text.trimStart().startsWith('<!DOCTYPE') || text.trimStart().startsWith('<html')) {
        console.warn(`Doc fetch returned HTML instead of markdown: ${doc.path}`);
        setContent('> ⚠️ This document could not be loaded. The file may be missing from the server.');
        setMetadata({ title: doc.title || id });
        setLoading(false);
        return;
      }
      
      const fmMatch = text.match(/^---\n([\s\S]*?)\n---/);
      if (fmMatch) {
        const fm = fmMatch[1];
        const meta = {};
        fm.split('\n').forEach(line => {
          const [key, ...value] = line.split(':');
          if (key) meta[key.trim()] = value.join(':').trim();
        });
        setMetadata(meta);
        setContent(text.replace(fmMatch[0], ''));
      } else {
        setContent(text);
        setMetadata({ title: doc.title || id });
      }
    } catch (e) {
      console.error("Doc not found", e);
    }
    setLoading(false);
  };

  const fetchGraph = async () => {
    try {
      const response = await fetch('/wiki/relations.json');
      if (response.ok) {
        const data = await response.json();
        setGraphData(data);
      }
    } catch (e) {
      console.error("Graph data failed", e);
    }
  };

  const fetchLinter = async () => {
    try {
      const response = await fetch('/src/linter-report.json');
      if (response.ok) {
        const data = await response.json();
        setLinterReport(data);
      }
    } catch (e) {
      console.warn("Linter report not available yet.");
    }
  };

  const fetchInsights = async () => {
    try {
      const response = await fetch('/src/insight-report.json');
      if (response.ok) {
        const data = await response.json();
        setInsightReport(data);
      }
    } catch (e) {
      console.warn("Insight report not available yet.");
    }
  };

  const refreshAllData = async () => {
    // Only fetch doc if we have one
    if (doc) fetchDoc();
    await Promise.all([
      fetchGraph(),
      fetchLinter(),
      fetchInsights()
    ]);
  };

  useEffect(() => {
    refreshAllData();
  }, [doc, id]);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (e) {
      console.error("Search failed", e);
    }
    setIsSearching(false);
  };

  const currentIssues = linterReport.issues.filter(issue => issue.node === id);
  const brokenLinks = currentIssues.filter(i => i.type === 'BROKEN_LINK').map(i => i.target);

  if (loading) return (
    <div className="flex-1 flex items-center justify-center bg-nordic-white h-screen">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Zap className="w-12 h-12 text-nordic-sage opacity-20" />
      </motion.div>
    </div>
  );

  if (!doc) return (
    <div className="flex-1 flex flex-col items-center justify-center bg-nordic-white h-screen p-12 text-center">
       <div className="w-24 h-24 bg-rose-50 rounded-[32px] flex items-center justify-center mb-8 border border-rose-100 shadow-sm">
          <AlertCircle className="w-10 h-10 text-rose-500" />
       </div>
       <h1 className="text-2xl font-display font-extrabold text-nordic-charcoal mb-4">Knowledge Node Not Found</h1>
       <p className="text-sm text-nordic-charcoal/60 max-w-md leading-relaxed mb-8">
         The strategic knowledge node you are looking for does not exist in the current manifest or has been archived.
       </p>
       <button 
         onClick={() => navigate('/')}
         className="px-8 py-4 bg-nordic-charcoal text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-nordic-charcoal/90 transition-all flex items-center gap-2"
       >
         <ArrowLeft className="w-4 h-4" /> Back to Dashboard
       </button>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex h-screen overflow-hidden p-6 gap-6 bg-nordic-white"
    >
      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 bg-nordic-charcoal/40 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-2xl glass-dark rounded-[32px] overflow-hidden shadow-2xl border border-white/10"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/10 flex items-center gap-4">
                <Search className="w-6 h-6 text-nordic-mint" />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Ask the Wiki... (Semantic Search)"
                  className="bg-transparent border-none outline-none text-xl text-white w-full font-display"
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-white/40" />
                </button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
                {isSearching ? (
                  <div className="p-8 flex flex-col items-center gap-4 opacity-40">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                      <Zap className="w-8 h-8 text-nordic-mint" />
                    </motion.div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-white">Synthesizing Results...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-2">
                    {searchResults.map((result, i) => (
                      <button 
                        key={i}
                        onClick={() => {
                          const targetId = result.path.split('/').pop().replace('.md', '');
                          navigate(`/${targetId}`);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                          setSearchResults([]);
                        }}
                        className="w-full text-left p-4 rounded-2xl hover:bg-white/5 flex flex-col gap-1 transition-colors group border border-transparent hover:border-white/10"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white group-hover:text-nordic-mint transition-colors">
                            {result.title || result.path.split('/').pop()}
                          </span>
                          <span className="text-[10px] font-mono text-white/70">Score: {(result.score * 100).toFixed(0)}%</span>
                        </div>
                        <p className="text-xs text-white line-clamp-2 italic">
                          {result.snippet || "No snippet available."}
                        </p>
                      </button>
                    ))}
                  </div>
                ) : searchQuery.length > 1 ? (
                  <div className="p-12 text-center opacity-40">
                    <p className="text-white text-sm">No semantic matches found for "{searchQuery}"</p>
                  </div>
                ) : (
                  <div className="p-12 text-center opacity-40">
                    <p className="text-white text-[10px] uppercase tracking-widest font-mono">Type to search the knowledge base</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left: Content Pane */}
      <div className="flex-[1.5] flex flex-col gap-6 h-full overflow-hidden">
        {/* Breadcrumb & Meta */}
        <div className="glass rounded-3xl p-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="bg-nordic-charcoal/5 hover:bg-nordic-charcoal/10 p-2 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-nordic-charcoal" />
            </button>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono tracking-widest text-nordic-blue opacity-60">
                {metadata.category || 'Documentation'} / {id}
              </span>
              <h1 className="text-xl font-display font-extrabold text-nordic-charcoal">
                {metadata.title || id}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Search Trigger Button */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-nordic-charcoal/5 hover:bg-nordic-charcoal/10 rounded-xl transition-all border border-nordic-charcoal/5 group"
            >
              <Search className="w-4 h-4 text-nordic-charcoal/60 group-hover:text-nordic-charcoal" />
              <span className="text-[10px] font-bold text-nordic-charcoal/40 uppercase tracking-widest">Search Wiki</span>
            </button>

            <button className="p-2 text-nordic-blue opacity-50 hover:opacity-100 transition-opacity">
              <Share2 className="w-5 h-5" />
            </button>
            <div className="px-3 py-1 bg-nordic-mint/20 text-nordic-sage text-[10px] font-bold rounded-lg uppercase border border-nordic-mint/30">
              {metadata.status || 'Verified'}
            </div>
          </div>
        </div>

        {/* Markdown Surface */}
        <div className="glass rounded-[40px] flex-1 overflow-y-auto p-12 relative group scroll-smooth custom-scrollbar bg-white/40 shadow-inner">
           {/* AI Insight Suggestion Banner */}
           <AnimatePresence>
             {insightReport.suggestions.map((suggestion, index) => (
                <motion.div 
                  key={`insight-${index}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-5 bg-gradient-to-r from-nordic-blue/10 to-nordic-mint/5 border border-nordic-blue/20 rounded-3xl flex items-center gap-4 shadow-sm"
                >
                  <div className="p-3 bg-white rounded-2xl shadow-sm">
                    <Sparkles className="w-5 h-5 text-nordic-blue" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-nordic-blue mb-1">AI Proactive Insight</p>
                    <p className="text-xs text-nordic-charcoal leading-relaxed" dangerouslySetInnerHTML={{ __html: suggestion.msg.replace(/\*\*(.*?)\*\*/g, '<b class="text-nordic-blue">$1</b>') }} />
                  </div>
                  <button className="px-4 py-2 bg-nordic-blue text-white rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-nordic-blue/90 transition-all">Expand Draft</button>
                </motion.div>
             ))}
           </AnimatePresence>

           {/* Integrity Warning Banner */}
           <AnimatePresence>
             {currentIssues.length > 0 && (
               <motion.div 
                 initial={{ opacity: 0, height: 0 }}
                 animate={{ opacity: 1, height: 'auto' }}
                 className="mb-8 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-4"
               >
                 <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                 <div className="flex-1">
                   <h4 className="text-xs font-bold text-rose-900 uppercase tracking-widest">Knowledge Integrity Warning</h4>
                   <ul className="mt-2 space-y-1">
                     {currentIssues.map((issue, index) => (
                       <li key={index} className="text-[11px] text-rose-800 flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-rose-300" />
                         <span className="font-bold">[{issue.type}]</span> {issue.msg}
                       </li>
                     ))}
                   </ul>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>

           <article className="prose prose-slate prose-lg max-w-none prose-nordic">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]} 
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                components={{
                  a: ({node, ...props}) => {
                    const isInternal = props.href?.startsWith('[[') && props.href?.endsWith(']]');
                    if (isInternal) {
                      const pageId = props.href.slice(2, -2).toLowerCase().replace(/\s+/g, '-');
                      const isBroken = brokenLinks.includes(pageId);
                      
                      return (
                        <button 
                          onClick={() => !isBroken && navigate(`/${pageId}`)} 
                          className={`font-bold transition-all ${isBroken ? 'text-rose-400 border-b-2 border-dotted border-rose-300 cursor-help' : 'text-nordic-blue hover:underline decoration-nordic-mint/50'}`}
                          title={isBroken ? `Broken link: Page '${pageId}' does not exist.` : `Navigate to ${pageId}`}
                        >
                          {isBroken && <Link2Off className="w-3 h-3 inline mr-1" />}
                          @{pageId}
                        </button>
                      );
                    }
                    return <a {...props} className="text-nordic-sage underline hover:text-nordic-charcoal transition-colors" />
                  },
                  blockquote: ({node, ...props}) => {
                    const text = props.children?.[1]?.props?.children?.[0] || "";
                    const isCallout = text.startsWith('[!');
                    
                    if (isCallout) {
                      const typeMatch = text.match(/\[!(.*?)\]/);
                      const type = typeMatch ? typeMatch[1].toUpperCase() : 'NOTE';
                      const cleanChildren = React.Children.map(props.children, child => {
                        if (typeof child.props?.children?.[0] === 'string' && child.props.children[0].startsWith('[!')) {
                          return { ...child, props: { ...child.props, children: [child.props.children[0].replace(/\[!(.*?)\]\s*/, '')] } };
                        }
                        return child;
                      });

                      const styles = {
                        CAUTION: 'border-rose-400 bg-rose-50 text-rose-900',
                        IMPORTANT: 'border-nordic-blue bg-nordic-blue/5 text-nordic-charcoal',
                        NOTE: 'border-nordic-mint bg-nordic-mint/5 text-nordic-charcoal',
                        TIP: 'border-emerald-400 bg-emerald-50 text-emerald-900'
                      }[type] || 'border-nordic-mint bg-nordic-mint/5 text-nordic-charcoal';

                      const icons = {
                        CAUTION: <AlertTriangle className="w-4 h-4 text-rose-500" />,
                        IMPORTANT: <Zap className="w-4 h-4 text-nordic-blue" />,
                        NOTE: <Info className="w-4 h-4 text-nordic-sage" />,
                        TIP: <Sparkles className="w-4 h-4 text-emerald-500" />
                      }[type] || <Info className="w-4 h-4 text-nordic-sage" />;

                      return (
                        <div className={`border-l-4 p-6 rounded-r-2xl my-6 flex flex-col gap-2 shadow-sm ${styles}`}>
                          <div className="flex items-center gap-2 mb-1">
                            {icons}
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{type}</span>
                          </div>
                          <div className="text-sm leading-relaxed">{cleanChildren}</div>
                        </div>
                      );
                    }

                    return <div className="border-l-4 border-nordic-mint/30 bg-nordic-mint/5 p-6 rounded-r-2xl my-6 italic text-nordic-charcoal/80" {...props} />;
                  }
                }}
              >
                {content}
              </ReactMarkdown>
           </article>
        </div>
      </div>

      {/* Right: Intelligence Hub */}
      <div className="flex-1 flex flex-col gap-6 h-full overflow-hidden">
        {/* Toggle Controls */}
        <div className="glass rounded-3xl p-2 flex gap-2 shadow-sm">
          {[
            { id: 'analysis', icon: Terminal, label: 'Analysis' },
            { id: 'graph', icon: Network, label: 'Graph' },
            { id: 'slides', icon: Presentation, label: 'Presentation' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-nordic-charcoal text-white shadow-lg' : 'hover:bg-nordic-charcoal/5 text-nordic-charcoal/60'}`}
            >
              <tab.icon className="w-3.5 h-3.5" /> {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'analysis' && (
            <motion.div 
              key="analysis"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col gap-6 overflow-hidden"
            >
              {/* Theme Density Dashboard */}
              <div className="glass-dark rounded-[32px] p-8 text-white relative overflow-hidden group shadow-2xl">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-6 text-nordic-mint font-bold uppercase tracking-widest text-[9px]">
                    <TrendingUp className="w-4 h-4" />
                    Knowledge Theme Density
                  </div>
                  
                  <div className="space-y-4">
                    {Object.entries(insightReport.themeDensity).map(([theme, density], index) => (
                      <div key={index} className="space-y-1.5">
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] font-medium text-white/60">{theme}</span>
                          <span className="text-[10px] font-mono text-nordic-mint">{density}%</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${density}%` }}
                            className={`h-full bg-gradient-to-r ${theme === insightReport.primaryTheme ? 'from-nordic-mint to-white' : 'from-white/20 to-white/10'}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] text-white/40 uppercase font-mono tracking-tighter">Primary Strategic Theme</p>
                      <p className="text-sm font-bold text-nordic-mint">{insightReport.primaryTheme}</p>
                    </div>
                    <Brain className="w-8 h-8 text-white/10" />
                  </div>
                </div>
              </div>

              {/* Action History / Insights */}
              <div className="glass rounded-[32px] p-8 flex-1 flex flex-col overflow-hidden bg-white/60">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <History className="w-5 h-5 text-nordic-sage" />
                    <h3 className="font-bold text-lg text-nordic-charcoal">Knowledge Audit</h3>
                  </div>
                </div>
                
                <div className="space-y-6 overflow-y-auto pr-4 custom-scrollbar">
                  {currentIssues.length > 0 ? (
                    currentIssues.map((issue, i) => (
                      <div key={i} className="flex gap-4 group">
                        <div className={`w-1 rounded-full ${issue.severity === 'high' ? 'bg-rose-500' : 'bg-rose-300'}`} />
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-mono opacity-40 uppercase tracking-tight text-rose-600">{issue.type} ({issue.severity})</span>
                          <p className="text-sm text-nordic-charcoal font-medium">{issue.msg}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-center opacity-30">
                       <Shield className="w-12 h-12 mb-4" />
                       <p className="text-xs uppercase tracking-widest font-bold">No active integrity issues.</p>
                       <p className="text-[10px] mt-2 leading-relaxed">Synthesis Efficiency: Optimal.</p>
                    </div>
                  )}
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-8 w-full py-4 bg-nordic-charcoal text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-nordic-charcoal/90 transition-all shadow-lg hover:shadow-xl"
                >
                  <Download className="w-4 h-4" /> Export Knowledge Node
                </motion.button>
              </div>
            </motion.div>
          )}

          {activeTab === 'graph' && (
            <motion.div 
              key="graph"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 h-full overflow-hidden"
            >
              <GraphView 
                data={graphData} 
                onNodeClick={(targetId) => navigate(`/doc/${targetId}`)}
                onSync={refreshAllData}
              />
            </motion.div>
          )}

          {activeTab === 'slides' && (
            <motion.div 
              key="slides"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col gap-4 h-full overflow-hidden"
            >
              <div className="flex-1 glass rounded-[32px] overflow-hidden p-8 bg-white/60 relative group">
                <Marp markdown={`---
marp: true
theme: uncover
class: invert
---

# ${metadata.title || id}
${metadata.category?.toUpperCase() || 'KNOWLEDGE NODE'}

---

${content.split('\n\n').slice(0, 5).join('\n\n---\n\n')}
                `} />
              </div>
              
              <div className="flex gap-4">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  className="flex-1 py-4 bg-nordic-charcoal text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
                  onClick={() => window.open(`/wiki/exports/${id}.pdf`, '_blank')}
                >
                  <Download className="w-4 h-4" /> Download PDF Deck
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default DocViewer;

