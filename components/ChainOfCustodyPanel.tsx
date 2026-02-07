
import React from 'react';
import { Job, Perspective, JobStatus } from '../types';
import { 
  ShieldCheck, 
  ArrowLeftRight, 
  Truck, 
  Warehouse, 
  UserCheck, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  MapPin,
  PenTool
} from 'lucide-react';

interface ChainOfCustodyPanelProps {
  job: Job;
  updateJob: (u: Partial<Job>) => void;
  perspective: Perspective;
}

const ChainOfCustodyPanel: React.FC<ChainOfCustodyPanelProps> = ({ job, updateJob, perspective }) => {
  const isCustodyGate = job.status === JobStatus.WAREHOUSE_CUSTODY;
  const isDriver = perspective === 'DRIVER';
  const isWarehouse = perspective === 'WAREHOUSE' || perspective === 'OFFICE';
  
  const handleArrival = () => {
    updateJob({ warehouseArrivalTimestamp: new Date().toLocaleTimeString() });
  };

  const handleHandshake = () => {
    updateJob({ 
      custodyHolder: 'WAREHOUSE',
      warehouseHandshakeTimestamp: new Date().toLocaleTimeString()
    });
    alert("CUSTODY_HANDSHAKE_SUCCESS: Liability baton successfully passed to Warehouse Hub Alpha.");
  };

  return (
    <section className="p-6 glass-panel rounded-2xl border-t border-t-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-sm flex items-center gap-2 uppercase tracking-widest text-purple-400">
          <ShieldCheck className="w-4 h-4" /> Chain of Custody Protocol
        </h3>
        <div className="text-[10px] font-mono text-slate-500">HASH: 0x82f..99a</div>
      </div>

      {/* BATON PASS INTERFACE: WAREHOUSE INBOUND */}
      {isCustodyGate && (
        <div className="mb-6 p-4 bg-purple-600/10 border border-purple-500/30 rounded-2xl space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
               <ArrowLeftRight className="w-5 h-5 text-white" />
             </div>
             <div>
               <h4 className="text-[10px] font-black uppercase text-purple-400 tracking-[0.2em]">Warehouse Handshake Gate</h4>
               <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 leading-tight">Fleet to Storage Custody Transfer</p>
             </div>
          </div>
          
          <div className="space-y-2">
            {/* STEP 1: ARRIVAL */}
            <div className={`p-3 rounded-xl border flex items-center justify-between transition-all ${job.warehouseArrivalTimestamp ? 'bg-green-600/10 border-green-500/30' : 'bg-slate-900 border-slate-800'}`}>
               <div className="flex items-center gap-3">
                 <MapPin className={`w-4 h-4 ${job.warehouseArrivalTimestamp ? 'text-green-500' : 'text-slate-600'}`} />
                 <span className={`text-[10px] font-black uppercase ${job.warehouseArrivalTimestamp ? 'text-green-400' : 'text-slate-500'}`}>1. Fleet Arrival @ Dock</span>
               </div>
               {job.warehouseArrivalTimestamp ? (
                 <span className="text-[10px] font-mono text-green-500">{job.warehouseArrivalTimestamp}</span>
               ) : (
                 isDriver ? (
                   <button onClick={handleArrival} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all">Report Arrival</button>
                 ) : (
                   <span className="text-[9px] font-black text-slate-700 uppercase italic">Awaiting Fleet...</span>
                 )
               )}
            </div>

            {/* STEP 2: HANDSHAKE */}
            <div className={`p-3 rounded-xl border flex items-center justify-between transition-all ${job.warehouseHandshakeTimestamp ? 'bg-green-600/10 border-green-500/30' : 'bg-slate-900 border-slate-800'} ${!job.warehouseArrivalTimestamp ? 'opacity-30' : ''}`}>
               <div className="flex items-center gap-3">
                 <PenTool className={`w-4 h-4 ${job.warehouseHandshakeTimestamp ? 'text-green-500' : 'text-slate-600'}`} />
                 <span className={`text-[10px] font-black uppercase ${job.warehouseHandshakeTimestamp ? 'text-green-400' : 'text-slate-500'}`}>2. Liability Acceptance</span>
               </div>
               {job.warehouseHandshakeTimestamp ? (
                 <span className="text-[10px] font-mono text-green-500">{job.warehouseHandshakeTimestamp}</span>
               ) : (
                 isWarehouse && job.warehouseArrivalTimestamp ? (
                   <button onClick={handleHandshake} className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all">Accept Baton</button>
                 ) : (
                   <span className="text-[9px] font-black text-slate-700 uppercase italic">
                     {!job.warehouseArrivalTimestamp ? 'LOCKED' : 'Awaiting Warehouse...'}
                   </span>
                 )
               )}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between bg-black/40 p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-20" />
        
        <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${job.custodyHolder === 'DRIVER' ? 'scale-110' : 'opacity-40'}`}>
          <div className={`p-4 rounded-2xl ${job.custodyHolder === 'DRIVER' ? 'bg-blue-600/20 ring-2 ring-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.2)]' : 'bg-slate-800'}`}>
            <Truck className={`w-8 h-8 ${job.custodyHolder === 'DRIVER' ? 'text-blue-400' : 'text-slate-600'}`} />
          </div>
          <span className={`text-[10px] font-black uppercase tracking-widest ${job.custodyHolder === 'DRIVER' ? 'text-blue-400' : 'text-slate-700'}`}>Fleet Unit 09</span>
        </div>

        <div className="flex-1 flex flex-col items-center gap-4 px-10">
          <div className="relative">
            <ArrowLeftRight className={`w-6 h-6 ${isCustodyGate && job.custodyHolder === 'DRIVER' ? 'text-purple-500 animate-pulse' : 'text-slate-800'}`} />
          </div>
        </div>

        <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${job.custodyHolder === 'WAREHOUSE' ? 'scale-110' : 'opacity-40'}`}>
          <div className={`p-4 rounded-2xl ${job.custodyHolder === 'WAREHOUSE' ? 'bg-purple-600/20 ring-2 ring-purple-500 shadow-[0_0_20px_rgba(147,51,234,0.2)]' : 'bg-slate-800'}`}>
            <Warehouse className={`w-8 h-8 ${job.custodyHolder === 'WAREHOUSE' ? 'text-purple-400' : 'text-slate-600'}`} />
          </div>
          <span className={`text-[10px] font-black uppercase tracking-widest ${job.custodyHolder === 'WAREHOUSE' ? 'text-purple-400' : 'text-slate-700'}`}>Storage Hub A</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Current Custodian</p>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase">
             <UserCheck className={`w-3 h-3 ${job.custodyHolder === 'WAREHOUSE' ? 'text-purple-500' : 'text-green-500'}`} /> 
             {job.custodyHolder}
          </div>
        </div>
        <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Control Status</p>
          <p className="text-xs font-bold text-slate-200 uppercase italic">
            {job.custodyHolder === 'WAREHOUSE' ? 'STATIONARY_STORAGE' : 'EN_ROUTE_TRANSIT'}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ChainOfCustodyPanel;
