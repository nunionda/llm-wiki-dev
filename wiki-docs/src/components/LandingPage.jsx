import React from 'react';
import { Layers, Zap, Shield, Globe, ArrowRight, Sparkles, Cpu, Activity, Network, MousePointer2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 h-full overflow-y-auto custom-scrollbar select-none relative">
      {/* Hero Section */}
      <section className="px-12 lg:px-24 pt-48 pb-64 max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 text-[11px] font-mono font-bold text-nordic-blue uppercase tracking-[0.4em] mb-12"
        >
          <div className="w-10 h-[1px] bg-nordic-blue/30" />
          <Sparkles className="w-4 h-4 text-nordic-mint shadow-sm" />
          The Era of Agentic Intelligence
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-[140px] font-display font-extrabold leading-[0.85] text-nordic-charcoal tracking-[-0.06em] mb-20"
        >
          Zero <span className="text-transparent bg-clip-text bg-gradient-to-br from-nordic-charcoal to-nordic-blue/50">Distance.</span><br />
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ delay: 0.5, duration: 2 }}
            className="italic font-display font-light"
          >
            Vibe to Product.
          </motion.span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-xl text-2xl text-nordic-charcoal/60 leading-relaxed font-medium mb-16"
        >
          Transform your enterprise knowledge from static logs into a dynamic, 
          self-governing <span className="text-nordic-charcoal font-bold">Intelligence Swarm</span>.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap gap-6"
        >
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/agentic-strategy')}
            className="bg-nordic-charcoal text-white px-12 py-6 rounded-3xl font-bold flex items-center gap-4 group transition-all"
          >
            Explore the Swarm
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(52, 73, 85, 0.05)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/commercial-blueprint')}
            className="glass-dark border-none text-nordic-charcoal px-12 py-6 rounded-3xl font-bold hover:shadow-xl transition-all"
          >
            Enterprise Blueprint
          </motion.button>
        </motion.div>
      </section>

      {/* Magical Features - Glass Cards */}
      <section className="px-12 lg:px-24 py-40 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: "Agentic Ingest", 
              desc: "Drop raw ideas, commits, or memos. The core extracts intent in sub-seconds.", 
              icon: Cpu, 
              color: "text-nordic-blue" 
            },
            { 
              title: "Neural Mapping", 
              desc: "Discover hidden semantic links. Your knowledge base is a neural swarm, not a folder.", 
              icon: Network, 
              color: "text-nordic-sage" 
            },
            { 
              title: "Hybrid Gravity", 
              desc: "Safety-first governance. Routine tasks auto-sync, while strategic vibes wait for you.", 
              icon: Shield, 
              color: "text-nordic-mint" 
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="premium-card group h-full flex flex-col p-10"
            >
              <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center mb-8 group-hover:bg-nordic-charcoal group-hover:text-white transition-colors">
                <feature.icon className={`w-7 h-7 ${feature.color} group-hover:text-white`} strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-display font-bold tracking-tight mb-4">{feature.title}</h3>
              <p className="text-nordic-charcoal/50 leading-relaxed font-medium">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Interaction Demo Area */}
      <section className="px-12 lg:px-24 py-40 text-center">
        <motion.div 
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="inline-flex items-center gap-6 glass p-8 rounded-[40px] border-white/40 shadow-2xl"
        >
          <div className="flex -space-x-4">
             {[1,2,3].map(i => (
               <div key={i} className={`w-10 h-10 rounded-full border-4 border-white ${['bg-nordic-blue', 'bg-nordic-sage', 'bg-nordic-mint'][i-1]} shadow-lg`} />
             ))}
          </div>
          <div className="text-left">
             <p className="text-xs font-mono font-black text-nordic-blue tracking-tighter uppercase leading-none mb-1">
               Swarm Status: Active
             </p>
             <p className="text-[10px] font-bold text-nordic-charcoal/40 uppercase tracking-widest">
               128 Agents Processing Semantic Data
             </p>
          </div>
          <MousePointer2 className="w-5 h-5 text-nordic-blue animate-bounce" />
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="px-12 lg:px-24 py-64 max-w-7xl mx-auto text-center relative overflow-hidden">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-7xl font-display font-extrabold tracking-[-0.04em] mb-16 text-nordic-charcoal"
        >
          Compound your <br />
          <span className="italic font-light">Collective Intelligence.</span>
        </motion.h2>
        <motion.button 
          whileHover={{ scale: 1.1, rotate: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/agentic-strategy')}
          className="bg-nordic-blue text-white px-16 py-8 rounded-[40px] font-bold text-2xl shadow-2xl hover:bg-nordic-blue/90 transition-all"
        >
          Begin Synthesis
        </motion.button>
      </section>

      {/* Decorative Orbs */}
      <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-nordic-mint/10 blur-[120px] rounded-full -z-10 animate-pulse-slow" />
      <div className="absolute bottom-[10%] right-[-10%] w-[800px] h-[800px] bg-nordic-blue/5 blur-[150px] rounded-full -z-10" />
    </div>
  );
};

export default LandingPage;
