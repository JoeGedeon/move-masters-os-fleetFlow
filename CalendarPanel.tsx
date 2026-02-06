
import React, { useState } from 'react';
import { Perspective, CalendarEvent } from '../types';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, ShieldCheck, MapPin } from 'lucide-react';

interface CalendarPanelProps {
  perspective: Perspective;
  events: CalendarEvent[];
  onAddRequest: (e: CalendarEvent) => void;
}

const CalendarPanel: React.FC<CalendarPanelProps> = ({ perspective, events, onAddRequest }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const isOperational = perspective === 'DRIVER' || perspective === 'HELPER' || perspective === 'OFFICE' || perspective === 'WAREHOUSE';
  const isClient = perspective === 'CLIENT';

  const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const firstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const currentMonthDays = daysInMonth(selectedDate.getFullYear(), selectedDate.getMonth());
  const offset = firstDayOfMonth(selectedDate.getFullYear(), selectedDate.getMonth());

  const handleDateClick = (day: number) => {
    if (isClient) {
      const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const label = prompt("What kind of move are you requesting? (e.g., 2BR Apartment)");
      if (label) {
        onAddRequest({
          id: `req-${Date.now()}`,
          date: dateStr,
          type: 'REQUEST',
          label: label,
          status: 'PENDING'
        });
        alert("Request sent to Move Masters Hub. An agent will contact you shortly to confirm availability.");
      }
    }
  };

  const getEventsForDay = (day: number) => {
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-2 rounded-xl">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter">
              {perspective} <span className="text-blue-500">Scheduler</span>
            </h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              {isClient ? 'Check Availability & Request Dates' : 'Fleet Dispatch & Labor Manifest'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors" onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}>
            <ChevronLeft />
          </button>
          <span className="text-sm font-black uppercase tracking-widest min-w-[120px] text-center">
            {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors" onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}>
            <ChevronRight />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center text-[10px] font-black uppercase text-slate-500 py-2">{d}</div>
        ))}
        
        {Array.from({ length: offset }).map((_, i) => (
          <div key={`offset-${i}`} className="h-32 bg-slate-900/20 rounded-xl border border-transparent" />
        ))}

        {Array.from({ length: currentMonthDays }).map((_, i) => {
          const day = i + 1;
          const dayEvents = getEventsForDay(day);
          return (
            <div 
              key={day} 
              onClick={() => handleDateClick(day)}
              className={`h-32 p-3 rounded-2xl border transition-all cursor-pointer group flex flex-col gap-2
                ${dayEvents.length > 0 ? 'bg-blue-600/5 border-blue-500/20' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}
              `}
            >
              <span className="text-xs font-black text-slate-500 group-hover:text-blue-400">{day}</span>
              <div className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
                {dayEvents.map(e => (
                  <div key={e.id} className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-tighter border truncate
                    ${e.type === 'JOB' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-orange-500/10 border-orange-500/30 text-orange-400'}
                  `}>
                    {e.label} {e.status === 'PENDING' && '(?)'}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {isOperational && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 glass-panel rounded-2xl border-t border-t-slate-700/50">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
              <Clock className="w-3 h-3 text-blue-400" /> Incoming Requests
            </h3>
            {events.filter(e => e.type === 'REQUEST').length === 0 ? (
              <p className="text-xs text-slate-600 italic">No pending requests at Hub.</p>
            ) : (
              events.filter(e => e.type === 'REQUEST').map(e => (
                <div key={e.id} className="p-3 bg-black/20 border border-slate-800 rounded-xl mb-2 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-white">{e.label}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{e.date}</p>
                  </div>
                  <button className="text-[8px] font-black uppercase bg-blue-600 px-2 py-1 rounded text-white">Approve</button>
                </div>
              ))
            )}
          </div>
          
          <div className="p-6 glass-panel rounded-2xl border-t border-t-slate-700/50">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-3 h-3 text-green-400" /> Compliance Audit
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-400">Driver Rest Compliance</span>
                <span className="text-green-500 font-black">100%</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-400">Helper Availability</span>
                <span className="text-green-500 font-black">HIGH</span>
              </div>
            </div>
          </div>

          <div className="p-6 glass-panel rounded-2xl border-t border-t-slate-700/50">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
              <MapPin className="w-3 h-3 text-red-400" /> Hub Logistics
            </h3>
            <p className="text-[10px] text-slate-400 leading-tight">
              Warehouse capacity at <span className="text-white font-bold">68%</span>. 
              Dispatch recommending consolidation for Northeast routes on 06/22.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPanel;
