
import React, { useState } from 'react';
import { Job, JobStatus } from '../types';
import { 
  Database, 
  Search, 
  Calendar as CalendarIcon, 
  Truck, 
  MoreHorizontal, 
  ChevronRight, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  ArrowRightCircle,
  Box
} from 'lucide-react';

interface WarehouseManagementHubProps {
  job: Job;
  updateJob: (u: Partial<Job>) => void;
}

const WarehouseManagementHub: React.FC<WarehouseManagementHubProps> = ({ job, updateJob }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Simulation of multiple clients in storage
  const mockStorageClients = [
    { id: job.id, name: job.origin.name, entryDate: job.warehouseHandshakeTimestamp || '06/20/25', volume: job.financials.cubicBaseCuFt, status: job.custodyHolder === 'WAREHOUSE' ? 'IN_VAULT' : 'PENDING_ARRIVAL', days: 2 },
    { id: 'ORD-88122', name: 'Sarah Connor', entryDate: '05/12/25', volume: 850, status: 'IN_VAULT', days: 41 },
    { id: 'ORD-90210', name: 'Brendan Walsh', entryDate: '06/01/25', volume: 1200, status: 'IN_VAULT', days: 21 },
    { id: 'ORD-77123', name: 'Ellen Ripley', entryDate: '04/30/25', volume: 550, status: 'IN_VAULT', days: 53 },
  ];

  const filteredClients = mockStorageClients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleScheduleOutbound = (clientId: string) => {
    if (clientId === job.id) {
      const date = prompt("Enter Projected Delivery Date (YYYY-MM-DD):", "2025-07-05");
      if (date) {
        updateJob({ outboundScheduledDate: date });
        alert(`Dispatch Queue Updated: ${job.origin.name} scheduled for ${date}.`);
      }
    } else {
      alert("System restricted to active operational node ORD-99321 for this prototype.");
    }
  };

  const handleFinalDispatch = () => {
    if (!job.outboundScheduledDate) {
      alert("SCHEDULE_LOCK: Set an outbound date before dispatching to fleet.");
      return;
    }
    updateJob({ 
        status: JobStatus.DESTINATION_GATE, 
        custodyHolder: 'DRIVER' 
    });
    alert(`DISPATCH_EXECUTED: Node ${job.id} transferred to Fleet Unit 09. Proceed to Delivery Stage.`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 glass-panel rounded-2xl border-t border-t-slate-700/50">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Units SIT</p>
          <p className="text-3xl font-black text-white italic">42</p>
        </div>
        <div className="p-6 glass-panel rounded-2xl border-t border-t-slate-700/50">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Utilization</p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-black text-blue-400 italic">68%</p>
            <span className="text-[10px] text-slate-600 font-bold mb-1">OF 8,000 SQFT</span>
          </div>
        </div>
        <div className="p-6 glass-panel rounded-2xl border-t border-t-slate-700/50">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Rev / Month</p>
          <p className="text-3xl font-black text-green-500 italic">$8,410</p>
        </div>
        <div className="p-6 glass-panel rounded-2xl border-t border-t-slate-700/50">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Outbound Today</p>
          <p className="text-3xl font-black text-purple-500 italic">3</p>
        </div>
      </div>

      <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <Database className="w-5 h-5 text-purple-500" />
             <h2 className="text-lg font-black uppercase tracking-tighter">Active Storage Census</h2>
          </div>
          <div className="relative">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
             <input 
               type="text" 
               placeholder="Search Vault Ledger..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="bg-black border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white outline-none focus:border-purple-500/50 w-64"
             />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Client / Order ID</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Entry Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Volume (CF)</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Liability Baton</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="border-b border-slate-800/50 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-xs font-black text-white">{client.name}</p>
                    <p className="text-[10px] font-mono text-slate-500">{client.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-slate-300">{client.entryDate}</p>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {client.days} days in vault
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xs font-black text-blue-400 font-mono">{client.volume} CF</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-lg text-[9px] font-black border ${client.status === 'IN_VAULT' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'}`}>
                      {client.status === 'IN_VAULT' ? <ShieldCheck className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      {client.status}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WAREHOUSE</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleScheduleOutbound(client.id)}
                      className="text-[10px] font-black uppercase text-purple-400 hover:text-purple-300 flex items-center gap-1 ml-auto"
                    >
                      Schedule Outbound <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {job.status === JobStatus.WAREHOUSE_CUSTODY && (
        <div className="p-8 glass-panel rounded-3xl border border-purple-500/20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <CalendarIcon className="w-32 h-32 text-purple-500" />
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-purple-600 flex items-center justify-center shadow-xl shadow-purple-900/40">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight text-white">Outbound Dispatch Scheduler</h3>
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">
                   Node: {job.id} // Client: {job.origin.name}
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
               <div className="bg-black/40 p-4 rounded-2xl border border-slate-800">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Projected Delivery</p>
                  <p className="text-sm font-black text-purple-400 italic">
                    {job.outboundScheduledDate || 'NOT_SCHEDULED'}
                  </p>
               </div>
               
               <button 
                onClick={handleFinalDispatch}
                disabled={!job.outboundScheduledDate}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${job.outboundScheduledDate ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-xl shadow-purple-900/40' : 'bg-slate-800 text-slate-500 border border-slate-700 grayscale cursor-not-allowed'}`}
               >
                 <ArrowRightCircle className="w-5 h-5" /> Execute Storage Release
               </button>
            </div>
          </div>

          {!job.outboundScheduledDate && (
             <p className="mt-6 text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] flex items-center gap-2">
               <AlertCircle className="w-3 h-3" /> System Gate: Delivery date must be locked by Hub before outtake authorization.
             </p>
          )}
        </div>
      )}
    </div>
  );
};

export default WarehouseManagementHub;
