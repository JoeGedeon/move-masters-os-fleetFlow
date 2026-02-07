
import React from 'react';
import { Job } from '../types';
import { Users, Clock, MapPin, CheckSquare, Clipboard } from 'lucide-react';

interface HelperTaskPanelProps {
  job: Job;
}

const HelperTaskPanel: React.FC<HelperTaskPanelProps> = ({ job }) => {
  const tasks = [
    { id: 1, label: 'Wrap fragile furniture (LR)', done: true },
    { id: 2, label: 'Disassemble Dining Table', done: false },
    { id: 3, label: 'Load Unit 09 - Section A', done: false },
    { id: 4, label: 'Verify Inventory Count (42/42)', done: false },
  ];

  return (
    <div className="space-y-6">
      <div className="p-6 glass-panel rounded-2xl border-l-4 border-l-blue-500 shadow-xl">
        <h2 className="text-lg font-black uppercase tracking-tighter mb-6 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-500" /> Current Crew Assignment
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">Lead Driver</span>
            <p className="text-sm font-bold text-white">Alexander 'Ace' K.</p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">Helpers Assigned</span>
            <div className="flex gap-2">
              {job.assignedHelpers.map(h => (
                <span key={h} className="text-[10px] bg-blue-600/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-bold">{h}</span>
              ))}
            </div>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">Report Time</span>
            <p className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" /> 08:30 AM EST
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 glass-panel rounded-2xl border-t border-t-slate-700/50">
          <h3 className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-slate-400 mb-6">
            <MapPin className="w-4 h-4 text-red-500" /> Site Logistics
          </h3>
          <div className="space-y-4">
            <div className="p-3 bg-black/20 rounded-xl border border-slate-800">
              <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Loading Strategy</p>
              <p className="text-xs text-slate-300">
                Basement stairs are tight. Need 2 men for the ARMCHAIR. 
                Keep "Section B" empty for potential storage consolidation at destination.
              </p>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl">
               <Clipboard className="w-5 h-5 text-blue-400" />
               <p className="text-[10px] font-black text-blue-300 uppercase leading-tight">
                 Accessorial: 2 Flights of Stairs (Origin)
               </p>
            </div>
          </div>
        </div>

        <div className="p-6 glass-panel rounded-2xl border-t border-t-slate-700/50">
          <h3 className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-slate-400 mb-6">
            <CheckSquare className="w-4 h-4 text-green-500" /> Field Task Manifest
          </h3>
          <div className="space-y-2">
            {tasks.map(t => (
              <div key={t.id} className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-800 group hover:border-slate-700 transition-all">
                <input 
                  type="checkbox" 
                  checked={t.done} 
                  readOnly 
                  className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-0" 
                />
                <span className={`text-xs font-medium ${t.done ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelperTaskPanel;
