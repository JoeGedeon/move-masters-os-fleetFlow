
import React from 'react';
import { JobStatus } from '../types';
import { Check, Lock, ShieldAlert } from 'lucide-react';

export const STEPS = [
  { id: JobStatus.DISPATCHED, label: 'Dispatch' },
  { id: JobStatus.ARRIVED_ORIGIN, label: 'Arrival' },
  { id: JobStatus.SURVEY_WALKTHROUGH, label: 'Survey' },
  { id: JobStatus.BINDING_ESTIMATE, label: 'Rate Lock', gate: true },
  { id: JobStatus.OFFICE_VERIFICATION, label: 'Review' },
  { id: JobStatus.CLIENT_APPROVAL, label: 'Signature', gate: true },
  { id: JobStatus.LOADING, label: 'Loading' },
  { id: JobStatus.LOAD_VERIFICATION, label: 'Evidence' },
  { id: JobStatus.IN_TRANSIT, label: 'Transit' },
  { id: JobStatus.WAREHOUSE_CUSTODY, label: 'Vault' },
  { id: JobStatus.DESTINATION_GATE, label: 'Payment', gate: true },
  { id: JobStatus.UNLOADING, label: 'Unload' },
  { id: JobStatus.FINAL_AUDIT, label: 'Audit' },
  { id: JobStatus.COMPLETED, label: 'Done' },
];

interface StatusStepperProps {
  currentStatus: JobStatus;
}

const StatusStepper: React.FC<StatusStepperProps> = ({ currentStatus }) => {
  const currentIndex = STEPS.findIndex(s => s.id === currentStatus);

  return (
    <div className="relative flex justify-between items-center w-full px-2 py-4">
      <div className="absolute top-8 left-0 w-full h-0.5 bg-slate-800 z-0"></div>
      {STEPS.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;

        return (
          <div key={step.id} className="relative z-10 flex flex-col items-center group">
            <div className={`
              w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500 border-2
              ${isCompleted ? 'bg-green-600 border-green-600' : isActive ? 'bg-blue-600 border-blue-400 scale-125 shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'bg-slate-950 border-slate-800'}
            `}>
              {isCompleted ? (
                <Check className="w-4 h-4 text-white" />
              ) : step.gate && isActive ? (
                <Lock className="w-3.5 h-3.5 text-white animate-pulse" />
              ) : (
                <span className={`text-[9px] font-black ${isActive ? 'text-white' : 'text-slate-700'}`}>{index + 1}</span>
              )}
            </div>
            <span className={`mt-4 text-[7px] font-black uppercase tracking-tighter text-center max-w-[48px] leading-tight ${isActive ? 'text-blue-400' : 'text-slate-600'}`}>
              {step.label}
            </span>
            {step.gate && !isCompleted && !isActive && (
              <ShieldAlert className="w-2.5 h-2.5 text-slate-800 absolute -top-1" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StatusStepper;
