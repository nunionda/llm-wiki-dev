import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, Search, Info, Map as MapIcon, Activity, RefreshCw, Zap } from 'lucide-react';

const CATEGORY_COLORS = {
  'meta': '#BF616A',       // Nord 11 (Red)
  'infrastructure': '#5E81AC', // Nord 10 (Blue)
  'knowledge-base': '#81A1C1', // Nord 9 (Light Blue)
  'assets': '#B48EAD',      // Nord 15 (Purple)
  'personal': '#D08770',    // Nord 12 (Orange)
  'research': '#A3BE8C',    // Nord 14 (Green)
  'reading': '#EBCB8B',     // Nord 13 (Yellow)
  'business': '#88C0D0',    // Nord 8 (Cyan)
  'general': '#4C566A'      // Nord 3 (Grey)
};

const GraphView = ({ data, onNodeClick, onSync }) => {
  const svgRef = useRef();
  const [hoveredNode, setHoveredNode] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [graphSearch, setGraphSearch] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Calculate Node Degrees (number of connections)
  const nodeDegrees = useMemo(() => {
    const degrees = {};
    if (!data?.links) return degrees;
    data.links.forEach(link => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      degrees[sourceId] = (degrees[sourceId] || 0) + 1;
      degrees[targetId] = (degrees[targetId] || 0) + 1;
    });
    return degrees;
  }, [data]);

  useEffect(() => {
    if (!data || !data.nodes) return;

    const width = isFullscreen ? window.innerWidth : 800;
    const height = isFullscreen ? window.innerHeight : 600;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height])
      .attr('width', '100%')
      .attr('height', '100%')
      .style('cursor', 'grab');

    svg.selectAll('*').remove();

    // Add Filters (Pulse Effect)
    const defs = svg.append('defs');
    const filter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
      
    filter.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'blur');
    filter.append('feComposite')
      .attr('in', 'SourceGraphic')
      .attr('in2', 'blur')
      .attr('operator', 'over');

    const container = svg.append('g');

    // Enhanced simulation parameters
    const simulation = d3.forceSimulation(data.nodes)
      .force('link', d3.forceLink(data.links).id(d => d.id).distance(140))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('collide', d3.forceCollide().radius(d => (nodeDegrees[d.id] || 1) * 3 + 35))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .alphaDecay(0.02);

    const link = container.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('stroke', '#4C566A')
      .attr('stroke-opacity', 0.2)
      .attr('stroke-width', 1.5);

    const node = container.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(data.nodes)
      .join('g')
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => {
        setHoveredNode(d);
        // Highlight logic
        link.attr('stroke-opacity', l => (l.source.id === d.id || l.target.id === d.id) ? 0.8 : 0.05)
            .attr('stroke', l => (l.source.id === d.id || l.target.id === d.id) ? '#88C0D0' : '#4C566A')
            .attr('stroke-width', l => (l.source.id === d.id || l.target.id === d.id) ? 3 : 1.5);
      })
      .on('mouseleave', () => {
        setHoveredNode(null);
        link.attr('stroke-opacity', 0.2).attr('stroke', '#4C566A').attr('stroke-width', 1.5);
      })
      .on('click', (event, d) => onNodeClick && onNodeClick(d.id))
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Hub Nodes (Large nodes)
    node.append('circle')
      .attr('r', d => (nodeDegrees[d.id] || 0) * 3 + 12)
      .attr('fill', d => CATEGORY_COLORS[d.category] || CATEGORY_COLORS.general)
      .attr('stroke', '#fff')
      .attr('stroke-width', d => (nodeDegrees[d.id] || 0) > 3 ? 3 : 1.5)
      .attr('class', d => (nodeDegrees[d.id] || 0) > 3 ? 'animate-pulse-slow' : '')
      .style('filter', d => (nodeDegrees[d.id] || 0) > 3 ? 'url(#glow)' : 'none');

    node.append('text')
      .text(d => d.title || d.id)
      .attr('x', d => (nodeDegrees[d.id] || 0) * 3 + 18)
      .attr('y', 5)
      .style('font-size', d => (nodeDegrees[d.id] || 0) > 3 ? '13px' : '11px')
      .style('font-weight', d => (nodeDegrees[d.id] || 0) > 3 ? '700' : '500')
      .style('font-family', 'Inter, system-ui, sans-serif')
      .style('fill', isFullscreen ? 'rgba(255,255,255,0.8)' : '#2E3440')
      .style('pointer-events', 'none');

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    svg.call(d3.zoom()
      .extent([[0, 0], [width, height]])
      .scaleExtent([0.2, 5])
      .on('zoom', ({ transform }) => {
        container.attr('transform', transform);
      }));

    return () => simulation.stop();
  }, [data, onNodeClick, isFullscreen, nodeDegrees]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleSyncClick = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/sync', { method: 'POST' });
      if (res.ok && onSync) {
        await onSync();
      }
    } catch (e) {
      console.error("Sync failed", e);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        layout
        className={`${
          isFullscreen 
            ? 'fixed inset-0 z-[100] bg-nordic-charcoal flex items-center justify-center' 
            : 'w-full h-full bg-slate-50/50 rounded-[2.5rem] overflow-hidden border border-slate-200/50 relative shadow-inner'
        } transition-all duration-500 ease-in-out`}
      >
        {/* Background Gradient for Immersive Mode */}
        {isFullscreen && (
          <div className="absolute inset-0 bg-gradient-to-br from-nordic-charcoal via-[#242933] to-nordic-charcoal animate-pulse-slow"></div>
        )}

        {/* Dashboard Card Header */}
        {!isFullscreen && (
          <div className="absolute top-8 left-10 z-10 flex items-start justify-between right-10 pointer-events-none">
            <div className="pointer-events-auto">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 font-bold">Knowledge Semantic Matrix</p>
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-display font-medium text-slate-800 mt-1">Graph Network</h2>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsFullscreen(true)}
                  className="mt-1 p-2 bg-white rounded-lg shadow-sm border border-slate-200 text-nordic-blue hover:bg-nordic-blue hover:text-white transition-colors"
                >
                  <Maximize2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isSyncing}
              onClick={handleSyncClick}
              className={`pointer-events-auto flex items-center gap-2 px-4 py-2 bg-nordic-charcoal text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg ${isSyncing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSyncing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3 text-nordic-mint" />}
              {isSyncing ? 'Processing Matrix' : 'Audit Matrix'}
            </motion.button>
          </div>
        )}

        {/* Immersive Overlays */}
        {isFullscreen && (
          <div className="absolute inset-0 pointer-events-none p-12 flex flex-col justify-between">
            {/* Top Bar */}
            <div className="flex justify-between items-start pointer-events-auto">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-nordic-mint font-bold mb-2">Deep Semantic Visualization</p>
                <h2 className="text-5xl font-display font-medium text-white/90 tracking-tighter">The Knowledge Matrix</h2>
              </div>
              
              <div className="flex items-center gap-4">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSyncing}
                  onClick={handleSyncClick}
                  className={`bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 text-white flex items-center gap-3 transition-all ${isSyncing ? 'opacity-50' : 'hover:bg-nordic-mint hover:text-nordic-charcoal hover:border-nordic-mint'}`}
                >
                  {isSyncing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                  <span className="text-xs font-bold uppercase tracking-widest">{isSyncing ? 'Synthesizing...' : 'Sync Semantic Hub'}</span>
                </motion.button>

                <div className="relative group">
                  <input 
                    type="text"
                    value={graphSearch}
                    onChange={(e) => setGraphSearch(e.target.value)}
                    placeholder="Search Nodes..."
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-12 py-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-nordic-mint/30 w-80 transition-all font-medium"
                  />
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-nordic-mint" />
                </div>
                
                <motion.button 
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsFullscreen(false)}
                  className="p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white hover:bg-rose-500/80 hover:border-rose-500/20 transition-all"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Bottom Meta Bar */}
            <div className="flex justify-between items-end pointer-events-auto">
              <div className="flex gap-4">
                <div className="glass-dark border border-white/10 p-6 rounded-[2.5rem] flex items-center gap-8 shadow-2xl">
                  {Object.entries(CATEGORY_COLORS).slice(0, 6).map(([key, color]) => (
                    <div key={key} className="flex items-center gap-3 group cursor-help">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 15px ${color}` }}></div>
                      <span className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em] group-hover:text-white/80 transition-colors">{key}</span>
                    </div>
                  ))}
                </div>
                
                <div className="p-5 bg-white/5 border border-white/10 rounded-3xl flex items-center gap-4 text-nordic-mint backdrop-blur-md">
                  <Activity className="w-4 h-4 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em]">{data?.nodes?.length || 0} Entities Synced</span>
                </div>
              </div>

              <div className="flex gap-2">
                <motion.button 
                  whileHover={{ x: -5, opacity: 1 }}
                  className="px-8 py-4 bg-nordic-mint/10 border border-nordic-mint/30 rounded-full text-nordic-mint text-[10px] font-bold uppercase tracking-widest opacity-60 transition-all"
                >
                  Export Topology
                </motion.button>
              </div>
            </div>
          </div>
        )}

        <svg ref={svgRef} className={`w-full h-full ${isFullscreen ? 'opacity-90' : ''}`}></svg>
      </motion.div>
    </AnimatePresence>
  );
};

export default GraphView;
