
import React from 'react';
import { Perspective } from '../types';
import { Truck, Briefcase, User, Users, Warehouse } from 'lucide-react';

interface PerspectiveSwitcherProps {
  current: Perspective;
  onChange: (p: Perspective) => void;
}

const PerspectiveSwitcher: React.FC<PerspectiveSwitcherProps> = ({ current, onChange }) => {
  const roles: { id: Perspective; label: string; icon: any }[] = [
    { id: 'DRIVER', label: 'Driver', icon: Truck },
    { id: 'HELPER', label: 'Helper', icon: Users },
    { id: 'OFFICE', label: 'Hub', icon: Briefcase },
    { id: 'WAREHOUSE', label: 'Warehouse', icon: Warehouse },
    { id: 'CLIENT', label: 'Customer', icon: User },
  ];

  return (
    <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
      {roles.map(role => (
        <button
          key={role.id}
          onClick={() => onChange(role.id)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all
            ${current === role.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}
          `}
        >
          <role.icon className="w-3 h-3" />
          <span className="hidden md:inline">{role.label}</span>
        </button>
      ))}
    </div>
  );
};

export default PerspectiveSwitcher;
