import React, { useState } from 'react';
import { Mic, Send, X, ShieldAlert, Sparkles, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MobileIngest = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('idle'); // idle, sending, success

  const handleSubmit = async () => {
    if (!title || !content) return;
    setStatus('sending');
    
    try {
      const res = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      });
      
      if (res.ok) {
        setStatus('success');
        setTimeout(() => {
          navigate('/'); // Go back to Wiki
        }, 1500);
      } else {
        setStatus('idle');
        alert('Failed to ingest vibe.');
      }
    } catch (e) {
      console.error(e);
      setStatus('idle');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-nordic-charcoal flex flex-col sm:p-4 font-sans max-w-md mx-auto sm:max-h-[850px] sm:rounded-[3rem] sm:my-auto sm:shadow-2xl overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.1)]">
      {/* Top Bar */}
      <div className="px-6 py-5 flex items-center justify-between bg-nordic-charcoal border-b border-white/10">
        <div className="flex gap-2 items-center">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest opacity-80">
            Field Capture
          </span>
        </div>
        <button onClick={() => navigate('/')} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
        <div className="px-4 py-8 bg-nordic-blue rounded-3xl text-center shadow-lg relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-nordic-blue to-nordic-mint opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <Sparkles className="w-8 h-8 text-white mx-auto mb-3 opacity-90" />
          <h2 className="text-xl font-display font-bold text-white mb-1">Intent Retainment</h2>
          <p className="text-[10px] uppercase tracking-widest font-bold font-mono text-white/70">What's on your mind?</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-nordic-sage mb-2 block ml-1">Vibe Topic</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Project Alpha Direct Feedback"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-nordic-mint transition-colors"
            />
          </div>

          <div className="flex-1 flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-widest text-nordic-sage mb-2 block ml-1">Raw Context</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Record your thoughts raw. The agent will synthesize and link them to the knowledge base..."
              className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-nordic-mint transition-colors resize-none mb-2"
            />
            <div className="flex justify-between items-center px-1">
               <span className="text-[10px] text-nordic-mint/80 font-mono font-bold uppercase tracking-widest flex items-center gap-1 bg-nordic-mint/10 px-2 py-1 rounded">
                 <CheckCircle className="w-3 h-3"/> Air-Gapped E2E
               </span>
               <button className="p-2 bg-nordic-mint/20 text-nordic-sage rounded-full hover:bg-nordic-mint/40 transition">
                 <Mic className="w-4 h-4" />
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dispatch Action */}
      <div className="p-6 bg-nordic-charcoal border-t border-white/10">
        <button 
          onClick={handleSubmit} 
          disabled={status !== 'idle' || !title || !content}
          className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all ${
            status === 'success' ? 'bg-nordic-mint text-nordic-charcoal font-bold' : 
            status === 'sending' ? 'bg-white/10 text-white/50 cursor-not-allowed' :
            (title && content) ? 'bg-nordic-blue text-white shadow-xl hover:scale-[1.02]' : 'bg-white/10 text-white/30 cursor-not-allowed'
          }`}
        >
          {status === 'success' ? (
            <><CheckCircle className="w-5 h-5"/> Synced to Hub</>
          ) : status === 'sending' ? (
            <><Activity className="w-5 h-5 animate-spin"/> Injecting...</>
          ) : (
             <><Send className="w-5 h-5"/> Inject into Wiki</>
          )}
        </button>
      </div>
    </div>
  );
};

export default MobileIngest;
