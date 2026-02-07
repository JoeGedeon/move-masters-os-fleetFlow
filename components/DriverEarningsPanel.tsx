
import React from 'react';
import { Job, Perspective } from '../types';
import { TrendingUp, Wallet, ArrowUpRight, EyeOff, FileText, Percent, Clock, Calculator, Info, ShieldAlert, Receipt } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DriverEarningsPanelProps {
  job: Job;
  hideFinances: boolean;
  perspective: Perspective;
}

const DriverEarningsPanel: React.FC<DriverEarningsPanelProps> = ({ job, hideFinances, perspective }) => {
  if (hideFinances) {
    return (
      <section className="p-6 glass-panel rounded-2xl opacity-50 grayscale">
         <div className="flex items-center gap-3 text-slate-500">
           <EyeOff className="w-5 h-5" />
           <span className="text-[10px] font-bold uppercase tracking-widest text-center leading-tight">Operational Financials Masked<br/>for Client Privacy</span>
         </div>
      </section>
    );
  }

  const isHelper = perspective === 'HELPER';
  
  // --- STAFF PAY SCALES ---
  const HELPER_HOURLY_RATE = 22.50;
  const HELPER_HOURS = 6.75; 

  const DRIVER_DAILY_BASE = 250.00;
  const DRIVER_COMMISSION_PERCENT = 0.12; 
  
  // Use the job's specific estimate as the baseline for commission overage
  const CUBIC_FOOT_BASELINE = job.financials.cubicEstimateCuFt; 
  
  // Calculate Overage
  const extraCuFt = Math.max(0, job.financials.cubicBaseCuFt - CUBIC_FOOT_BASELINE);
  const overageRevenue = extraCuFt * job.financials.cubicBaseRate;
  const driverCommission = overageRevenue * DRIVER_COMMISSION_PERCENT;

  const data = isHelper ? [
    { name: 'Daily Wage', val: HELPER_HOURLY_RATE * HELPER_HOURS },
    { name: 'Field Tips', val: 40.00 },
    { name: 'On-Time Bonus', val: 15.00 },
  ] : [
    { name: 'Daily Base', val: DRIVER_DAILY_BASE },
    { name: '12% Overage', val: driverCommission },
  ];

  const grossTotal = data.reduce((acc, curr) => acc + curr.val, 0);
  
  // TAX PROTECTION LOGIC (1099 ADVISORY)
  const TAX_RESERVE_RATE = 0.25; // 25% recommended for 1099
  const estimatedTaxReserve = grossTotal * TAX_RESERVE_RATE;
  const projectedNet = grossTotal - estimatedTaxReserve;

  const handleExport = () => {
    alert("SYSTEM_GENERATE: Compiling Annual Financial Statement (PDF). Statement will include all verified ledger entries for 2025 Tax Year.");
  };

  return (
    <section className="p-6 glass-panel rounded-2xl border-t border-t-slate-700/50 shadow-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-1 opacity-10 pointer-events-none">
        <TrendingUp className="w-24 h-24 text-blue-500 -mr-4 -mt-4" />
      </div>

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex flex-col">
          <h2 className="text-sm font-black flex items-center gap-2 uppercase tracking-tight text-white">
            <Wallet className="text-blue-500 w-4 h-4" /> {isHelper ? 'Helper Ledger' : 'Driver Settlement'}
          </h2>
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Real-Time Earnings Node</span>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-2xl font-black text-white italic">
            ${grossTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
             <span className="text-[8px] font-mono text-green-500 uppercase font-black">Gross Verified</span>
          </div>
        </div>
      </div>

      {/* TAX SHIELD ADVISORY */}
      <div className="mb-6 p-4 bg-blue-600/5 border border-blue-500/20 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-10">
           <ShieldAlert className="w-12 h-12 text-blue-400" />
        </div>
        <div className="flex items-center gap-2 mb-3">
           <Receipt className="w-3.5 h-3.5 text-blue-400" />
           <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-400">1099 Tax Shield Advisory</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
           <div>
             <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Tax Reserve (25%)</p>
             <p className="text-sm font-black text-orange-400 font-mono">-${estimatedTaxReserve.toFixed(2)}</p>
           </div>
           <div className="text-right">
             <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Projected Net Take-Home</p>
             <p className="text-sm font-black text-green-500 font-mono">${projectedNet.toFixed(2)}</p>
           </div>
        </div>
        <p className="mt-3 text-[7px] font-bold text-slate-500 uppercase leading-tight italic">
          * Recommendation: Set aside the reserve amount to cover self-employment tax liabilities.
        </p>
      </div>

      <div className="bg-slate-900/80 border border-slate-700/50 rounded-2xl p-4 mb-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-3 opacity-20">
          <Calculator className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
          <Info className="w-3 h-3 text-blue-400" /> Contracted Pay Scale
        </h3>
        
        {isHelper ? (
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs font-bold text-slate-200">${HELPER_HOURLY_RATE.toFixed(2)} <span className="text-[9px] text-slate-500">/ HOUR</span></p>
                <p className="text-[9px] font-medium text-slate-500 uppercase">Base General Labor Rate</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-200">{HELPER_HOURS} <span className="text-[9px] text-slate-500">HRS</span></p>
                <p className="text-[9px] font-medium text-slate-500 uppercase">Logged Today</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs font-bold text-slate-200">${DRIVER_DAILY_BASE.toFixed(2)} <span className="text-[9px] text-slate-500">/ DAY</span></p>
                <p className="text-[9px] font-medium text-slate-500 uppercase">Daily Base Pay</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-blue-400">12% <span className="text-[9px] text-slate-500 uppercase">Comm</span></p>
                <p className="text-[9px] font-medium text-slate-500 uppercase">Above {CUBIC_FOOT_BASELINE} CF</p>
              </div>
            </div>
            
            <div className="pt-2 border-t border-slate-800">
               <div className="flex justify-between items-center text-[9px] font-black">
                 <span className="text-slate-500 uppercase">Overage Calculation:</span>
                 <span className="text-slate-300">({job.financials.cubicBaseCuFt} - {CUBIC_FOOT_BASELINE}) × ${job.financials.cubicBaseRate} × 0.12</span>
               </div>
               <div className="flex justify-between items-center text-[9px] font-black mt-1">
                 <span className="text-slate-500 uppercase">Overage Earned:</span>
                 <span className={`font-mono ${extraCuFt > 0 ? 'text-green-400' : 'text-slate-600'}`}>
                   {extraCuFt > 0 ? `+$${driverCommission.toFixed(2)}` : '$0.00'}
                 </span>
               </div>
            </div>
          </div>
        )}
      </div>

      <div className="h-28 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" hide />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
              itemStyle={{ color: '#fff', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}
              labelStyle={{ display: 'none' }}
              cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
            />
            <Bar dataKey="val" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : index === 1 ? '#10b981' : '#8b5cf6'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        <button 
          onClick={handleExport}
          className="w-full flex items-center justify-center gap-3 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-[10px] font-black uppercase text-white transition-all shadow-lg active:scale-[0.98]"
        >
          <FileText className="w-3 h-3 text-blue-400" /> 
          Export Tax Document (PDF)
        </button>
        
        <div className="p-3 rounded-xl border bg-slate-900/50 border-slate-800">
          <div className="flex justify-between items-start mb-1">
            <span className="text-[9px] uppercase font-black text-slate-500 tracking-widest">Internal Control</span>
            <ArrowUpRight className="w-3 h-3 text-slate-500" />
          </div>
          <p className="text-[9px] text-slate-400 leading-tight uppercase font-bold tracking-tight">
            Node <span className="text-white">{job.id}</span> final settlement will be processed at midnight. Discrepancies must be reported to Hub via Intel chat.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DriverEarningsPanel;
