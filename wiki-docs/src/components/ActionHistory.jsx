import React from 'react';
import { Send, CheckCircle, Clock, Zap, FileUp, Bell } from 'lucide-react';
import deliveryLog from '../delivery-log.json';

const ActionHistory = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-display font-extrabold text-nordic-charcoal">Autonomous Dispatch</h3>
          <p className="text-xs text-nordic-blue font-mono font-bold uppercase tracking-widest opacity-60 mt-1">Autonomous Strategy Delivery Feed</p>
        </div>
        <div className="px-3 py-1 bg-nordic-blue/10 rounded-full flex items-center gap-2">
          <Zap className="w-3 h-3 text-nordic-blue animate-pulse" />
          <span className="text-[10px] font-bold text-nordic-blue uppercase">Agent Active</span>
        </div>
      </div>

      <div className="space-y-4">
        {deliveryLog.actions.map((action) => (
          <div key={action.id} className="group relative pl-8 pb-8 last:pb-0">
            {/* Timeline Line */}
            <div className="absolute left-3 top-2 bottom-0 w-px bg-nordic-gray/20 group-last:bg-transparent"></div>
            
            {/* Action Dot */}
            <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-nordic-charcoal flex items-center justify-center z-10 shadow-lg group-hover:scale-110 transition-transform">
              {action.type === 'dispatch' ? <Send className="w-3 h-3 text-nordic-sage" /> : 
               action.type === 'regen' ? <FileUp className="w-3 h-3 text-nordic-blue" /> :
               <Bell className="w-3 h-3 text-nordic-mint" />}
            </div>

            <div className="bg-white/40 p-6 rounded-2xl border border-nordic-gray/10 hover:border-nordic-blue/30 transition-all hover:translate-x-1">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                  action.status === 'success' ? 'bg-nordic-mint/20 text-nordic-sage' : 'bg-red-100 text-red-600'
                }`}>
                  {action.status}
                </span>
                <span className="text-[10px] font-mono font-bold text-nordic-charcoal/40 flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {new Date(action.timestamp).toLocaleTimeString()}
                </span>
              </div>
              
              <p className="text-sm font-bold text-nordic-charcoal mb-1">{action.message}</p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-nordic-blue/60 uppercase">
                <CheckCircle className="w-3 h-3" />
                Target: {action.target}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-nordic-charcoal rounded-xl border border-white/5">
        <p className="text-[10px] text-nordic-sage font-mono leading-relaxed opacity-80">
          // Autonomous Driver: Watching manifest for 'synced' state. Dispatches will trigger automatically when high-gravity docs are approved.
        </p>
      </div>
    </div>
  );
};

export default ActionHistory;
