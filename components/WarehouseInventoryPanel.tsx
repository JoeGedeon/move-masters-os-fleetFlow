
import React from 'react';
import { Job } from '../types';
import { Warehouse, ArrowRightLeft, ShieldCheck, Box, PackageOpen, Lock, Activity, Clock } from 'lucide-react';

interface WarehouseInventoryPanelProps {
  job: Job;
}

const WarehouseInventoryPanel: React.FC<WarehouseInventoryPanelProps> = ({ job }) => {
  const isCustodyHeld = job.custodyHolder === 'WAREHOUSE';

  return (
    <div className="space-y-6">
      <div className="p-6 glass-panel rounded-2xl border-l-4 border-l-purple-500 shadow-xl overflow-hidden relative">
        {!isCustodyHeld && (
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Lock className="w-24 h-24 text-red-500" />
          </div>
        )}
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-black uppercase tracking-tighter flex items-center gap-2">
            <Warehouse className="w-5 h-5 text-purple-500" /> Storage Hub Alpha (GENESEO)
          </h2>
          <div className={`text-[10px] font-black px-3 py-1 rounded border uppercase tracking-widest flex items-center gap-2 ${isCustodyHeld ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-orange-400 bg-orange-500/10 border-orange-500/20'}`}>
            {isCustodyHeld ? <ShieldCheck className="w-3 h-3" /> : <Activity className="w-3 h-3 animate-pulse" />}
            {isCustodyHeld ? 'Bay 12-B Secured' : 'Awaiting Inbound Handshake'}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">Custody ID</span>
            <p className="font-mono text-xs font-bold text-white uppercase">{job.id}_SIT</p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">Arrival Log</span>
            <p className="font-mono text-xs font-bold text-white uppercase">{job.warehouseArrivalTimestamp || 'PENDING'}</p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">Handshake Log</span>
            <p className={`font-mono text-xs font-bold uppercase ${isCustodyHeld ? 'text-green-500' : 'text-red-500'}`}>
              {job.warehouseHandshakeTimestamp || 'PENDING'}
            </p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">Status</span>
            <p className="font-mono text-xs font-bold text-white uppercase">{isCustodyHeld ? 'In-Vault' : 'Pre-Impound'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 glass-panel rounded-2xl border-t border-t-slate-700/50">
          <h3 className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-slate-400 mb-6">
            <ArrowRightLeft className="w-4 h-4 text-blue-500" /> Operational Inbound Handshake
          </h3>
          <div className="space-y-3">
             <div className="flex items-center gap-4 p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl relative">
                <div className="w-1 h-full absolute left-0 top-0 bg-blue-500 rounded-l" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-blue-400 uppercase">Step 1: Fleet Arrival</span>
                  <span className="text-xs font-bold text-slate-200">
                    {job.warehouseArrivalTimestamp ? `Verified at ${job.warehouseArrivalTimestamp}` : 'Awaiting Dock Arrival Record'}
                  </span>
                </div>
                <span className="ml-auto text-[10px] font-mono text-slate-500">GATE_A1</span>
             </div>
             
             <div className={`flex items-center gap-4 p-3 rounded-xl relative border ${isCustodyHeld ? 'bg-purple-500/5 border-purple-500/20' : 'bg-slate-900/50 border-slate-800 opacity-40'}`}>
                {isCustodyHeld && <div className="w-1 h-full absolute left-0 top-0 bg-purple-500 rounded-l" />}
                <div className="flex flex-col">
                  <span className={`text-[10px] font-black uppercase ${isCustodyHeld ? 'text-purple-400' : 'text-slate-600'}`}>Step 2: Liability Handover</span>
                  <span className="text-xs font-bold text-slate-200">
                    {isCustodyHeld ? `Executed at ${job.warehouseHandshakeTimestamp}` : 'Awaiting Baton Acceptance'}
                  </span>
                </div>
                {isCustodyHeld && <span className="ml-auto text-[10px] font-mono text-slate-500 italic">VERIFIED_HASH</span>}
             </div>

             {job.warehouseArrivalTimestamp && job.warehouseHandshakeTimestamp && (
               <div className="p-3 bg-slate-800/20 rounded-xl border border-white/5 flex items-center justify-between">
                 <span className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-2">
                   <Clock className="w-3 h-3" /> Unload & Intake Latency
                 </span>
                 <span className="text-[10px] font-mono text-blue-400">0h 24m (RECORDED)</span>
               </div>
             )}
          </div>
        </div>

        <div className={`p-6 glass-panel rounded-2xl border-t border-t-slate-700/50 transition-all duration-700 ${!isCustodyHeld ? 'opacity-30 blur-[2px] pointer-events-none' : ''}`}>
          <h3 className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-slate-400 mb-6">
            <Box className="w-4 h-4 text-orange-500" /> Article Vault Tracking
          </h3>
          <div className="space-y-2">
            {job.inventory.map(item => (
              <div key={item.id} className="flex justify-between items-center p-2 bg-black/20 rounded-lg border border-slate-800">
                <span className="text-xs font-medium text-slate-300 uppercase tracking-tight">{item.name}</span>
                <div className="flex items-center gap-2">
                   <PackageOpen className="w-3 h-3 text-slate-600" />
                   <span className="text-[10px] font-mono text-slate-500">TAG_{item.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseInventoryPanel;
