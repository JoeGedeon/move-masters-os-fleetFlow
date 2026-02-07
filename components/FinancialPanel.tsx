
import React from 'react';
import { Job, Perspective, JobStatus } from '../types';
import { DollarSign, ShieldCheck, Lock, Activity, CheckCircle, Plus, Calculator, Scale } from 'lucide-react';

interface FinancialPanelProps {
  job: Job;
  updateJob: (u: Partial<Job>) => void;
  perspective: Perspective;
}

const FinancialPanel: React.FC<FinancialPanelProps> = ({ job, updateJob, perspective }) => {
  const isDestGate = job.status === JobStatus.DESTINATION_GATE;
  const isOffice = perspective === 'OFFICE';
  const f = job.financials;

  const weightTotal = (f.weightBaseLbs * f.weightBaseRate) + (f.weightAddLbs * f.weightAddRate);
  const cubicTotal = (f.cubicBaseCuFt * f.cubicBaseRate) + (f.cubicAddCuFt * f.cubicAddRate);
  const hourlyTotal = f.hourlyMen * f.hourlyTrucks * f.hourlyRate;
  const packingTotal = f.packingMaterialsTotal + f.fullPackingService + f.packingOther;
  const otherTotal = f.fuelSurcharge + f.stairsOrigin + f.stairsDest + f.longCarryOrigin + f.longCarryDest + 
                     f.shuttleOrigin + f.shuttleDest + f.miscBulkyItem + f.splitStopOff + f.pgsService + f.valuationCharge;
  const storageTotal = (f.storageDays > 0) ? (f.storageCuFt * f.storageRate) + f.storageOther : 0;

  const grandTotal = weightTotal + cubicTotal + hourlyTotal + packingTotal + otherTotal + storageTotal;
  const totalPaid = f.partialPayments.reduce((a, b) => a + b, 0);
  const balance = grandTotal - totalPaid;
  
  const updateFin = (updates: Partial<typeof f>) => {
    updateJob({ financials: { ...f, ...updates } });
  };

  const cuFtOverage = Math.max(0, f.cubicBaseCuFt - f.cubicEstimateCuFt);

  return (
    <div className="p-6 glass-panel rounded-2xl flex flex-col h-full border-t border-t-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-sm flex items-center gap-2 uppercase tracking-widest text-green-400">
          <DollarSign className="w-4 h-4" /> Revenue Recovery
        </h3>
        {job.deliveryPaid && (
          <div className="flex items-center gap-1 text-green-500 text-[10px] font-black bg-green-500/10 px-2 py-1 rounded">
            <CheckCircle className="w-3 h-3" /> BAL_CLEARED
          </div>
        )}
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="bg-black/40 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <span>Outstanding Tariff</span>
            <Activity className="w-3 h-3 animate-pulse text-green-500" />
          </div>
          <div className="flex justify-between items-end">
            <span className="text-3xl font-black text-white italic">${balance.toFixed(2)}</span>
            <span className="text-[10px] text-slate-500 font-mono mb-1">CONTRACT_BAL</span>
          </div>
        </div>

        {/* CUBIC FEET RECONCILIATION GATE */}
        <div className="p-4 bg-slate-900/80 rounded-2xl border border-blue-500/20 space-y-4">
           <h4 className="text-[10px] font-black uppercase text-blue-400 tracking-widest flex items-center gap-2 mb-2">
             <Scale className="w-4 h-4" /> Inventory Reconciliation
           </h4>
           
           <div className="grid grid-cols-1 gap-2">
             <div className="flex justify-between items-center p-2 bg-black/40 rounded-lg border border-slate-800">
               <span className="text-[9px] font-bold text-slate-500 uppercase">Cubic Ft Estimate</span>
               <div className="flex items-center gap-2">
                 {isOffice ? (
                    <input 
                      type="number" 
                      value={f.cubicEstimateCuFt} 
                      onChange={(e) => updateFin({ cubicEstimateCuFt: parseInt(e.target.value) || 0 })}
                      className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-xs text-blue-300 w-20 text-right font-mono"
                    />
                 ) : (
                    <span className="text-xs font-black text-slate-300 font-mono">{f.cubicEstimateCuFt} CF</span>
                 )}
               </div>
             </div>

             <div className="flex justify-between items-center p-2 bg-black/40 rounded-lg border border-slate-800">
               <span className="text-[9px] font-bold text-slate-500 uppercase">Actual Cubic Feet</span>
               <div className="flex items-center gap-2">
                 {isOffice ? (
                    <input 
                      type="number" 
                      value={f.cubicBaseCuFt} 
                      onChange={(e) => updateFin({ cubicBaseCuFt: parseInt(e.target.value) || 0 })}
                      className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-xs text-white w-20 text-right font-mono"
                    />
                 ) : (
                    <span className="text-xs font-black text-white font-mono">{f.cubicBaseCuFt} CF</span>
                 )}
               </div>
             </div>

             <div className="flex justify-between items-center p-2 bg-blue-600/5 rounded-lg border border-blue-500/20">
               <span className="text-[9px] font-black text-blue-400 uppercase">Cubic Feet Extra</span>
               <span className={`text-xs font-black font-mono ${cuFtOverage > 0 ? 'text-blue-400' : 'text-slate-600'}`}>
                 +{cuFtOverage} CF
               </span>
             </div>
           </div>

           {cuFtOverage > 0 && (
             <div className="text-[9px] font-bold text-blue-500/70 italic px-1 uppercase tracking-tight">
               * Extra volume generates +${(cuFtOverage * f.cubicBaseRate).toFixed(2)} in added tariff.
             </div>
           )}
        </div>

        {/* Granular Controls for Office Perspective */}
        <div className="space-y-4 pt-2">
          <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800 space-y-3">
             <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
               <Calculator className="w-3 h-3" /> Other Adjustments
             </h4>
             
             <div className="grid grid-cols-2 gap-3">
               <div>
                 <label className="text-[9px] text-slate-500 block mb-1">RATE / CUFT</label>
                 <input 
                  type="number" 
                  step="0.1" 
                  value={f.cubicBaseRate} 
                  disabled={!isOffice}
                  onChange={(e) => updateFin({ cubicBaseRate: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white" 
                 />
               </div>
               <div>
                 <label className="text-[9px] text-slate-500 block mb-1">MATERIALS $</label>
                 <input 
                  type="number" 
                  value={f.packingMaterialsTotal} 
                  disabled={!isOffice}
                  onChange={(e) => updateFin({ packingMaterialsTotal: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white" 
                 />
               </div>
             </div>
          </div>
        </div>

        {isOffice && (
          <button 
            onClick={() => {
              const amount = parseFloat(prompt("Enter payment amount to record:") || "0");
              if (amount > 0) {
                updateFin({ partialPayments: [...f.partialPayments, amount] });
              }
            }}
            className="flex items-center justify-center gap-2 w-full py-3 bg-green-600/10 border border-green-500/20 rounded-xl text-[10px] font-black uppercase text-green-500 hover:bg-green-600/20 transition-all"
          >
            <Plus className="w-3 h-3" /> Register Field Collection
          </button>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {isDestGate && !job.deliveryPaid && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
            <Lock className="w-4 h-4 text-red-500" />
            <p className="text-[10px] text-red-400 uppercase font-black tracking-widest leading-tight">HARD STOP: Collect ${balance.toFixed(2)} before unloading.</p>
          </div>
        )}

        {isOffice && isDestGate && !job.deliveryPaid && (
          <button 
            onClick={() => updateJob({ deliveryPaid: true })}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-blue-900/20"
          >
            Verify Hub Handshake & Unload
          </button>
        )}

        {job.deliveryPaid && (
          <div className="p-4 bg-green-500/5 border border-dashed border-green-500/20 rounded-xl flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            <span className="text-[10px] text-green-400 font-black uppercase tracking-[0.15em] leading-tight font-mono">FINANCIAL_HONESTY_AUDIT_OK</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialPanel;
