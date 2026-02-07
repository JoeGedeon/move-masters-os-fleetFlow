
import React, { useState } from 'react';
import { Job, JobStatus, Perspective, CalendarEvent } from './types';
import StatusStepper, { STEPS } from './components/StatusStepper';
import InventoryPanel from './components/InventoryPanel';
import FinancialPanel from './components/FinancialPanel';
import DriverEarningsPanel from './components/DriverEarningsPanel';
import AICommandCenter from './components/AICommandCenter';
import ChainOfCustodyPanel from './components/ChainOfCustodyPanel';
import PerspectiveSwitcher from './components/PerspectiveSwitcher';
import LegalDocumentCenter from './components/LegalDocumentCenter';
import CalendarPanel from './components/CalendarPanel';
import HelperTaskPanel from './components/HelperTaskPanel';
import WarehouseInventoryPanel from './components/WarehouseInventoryPanel';
import WarehouseManagementHub from './components/WarehouseManagementHub';

import {
  Truck,
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  Calendar as CalendarIcon,
  LayoutDashboard,
  HardHat,
  ChevronRight,
  PenTool,
  CheckCircle2,
  ShieldAlert,
  Warehouse,
  MapPin,
  Split,
  ArrowRight,
  Database,
  Handshake,
  Star,
  Award,
  Zap
} from 'lucide-react';

const INITIAL_JOB: Job = {
  id: "ORD-99321",
  pickupDate: "2025-06-20",
  firstAvailableDate: "2025-06-25",
  vehicleId: "FLEET-09",
  origin: {
    name: "Jonathan Wick",
    street: "123 Manhattan Skyline Dr",
    cityStateZip: "New York, NY 10001",
    phone: "(212) 555-0198"
  },
  destination: {
    name: "Jonathan Wick",
    street: "456 Continental Ave",
    cityStateZip: "Jersey City, NJ 07302",
    phone: "(212) 555-0198"
  },
  status: JobStatus.DISPATCHED,
  inventory: [
    { id: '1', name: 'Vintage Armchair', condition: 'Pre-existing scratch on leg', verified: false },
    { id: '2', name: '75" OLED TV', condition: 'Mint', verified: false },
    { id: '3', name: 'Dining Table', condition: 'Minor scratches', verified: false },
  ],
  financials: {
    weightBaseLbs: 2000,
    weightBaseRate: 0.50,
    weightAddLbs: 0,
    weightAddRate: 0,
    cubicEstimateCuFt: 450,
    cubicBaseCuFt: 450,
    cubicBaseRate: 6.50,
    cubicAddCuFt: 0,
    cubicAddRate: 0,
    hourlyPart1Start: "08:00 AM",
    hourlyPart1End: "12:00 PM",
    hourlyPart2Start: "",
    hourlyPart2End: "",
    hourlyMen: 3,
    hourlyTrucks: 1,
    hourlyRate: 150,
    packingMaterialsTotal: 120,
    fullPackingService: 0,
    packingOther: 0,
    fuelSurcharge: 85,
    stairsOrigin: 25,
    stairsDest: 25,
    longCarryOrigin: 0,
    longCarryDest: 0,
    shuttleOrigin: 0,
    shuttleDest: 0,
    miscBulkyItem: 0,
    splitStopOff: 0,
    pgsService: 0,
    valuationCharge: 0,
    storageDays: 0,
    storageCuFt: 0,
    storageRate: 0,
    storageOther: 0,
    partialPayments: [500],
    priceAdjustment: 0
  },
  valuationOption: 2,
  originSigned: false,
  deliverySigned: false,
  pickupPaid: false,
  deliveryPaid: false,
  custodyHolder: 'DRIVER',
  assignedHelpers: ['Marcus L.', 'Riley T.']
};

const INITIAL_EVENTS: CalendarEvent[] = [
  { id: '1', date: '2025-06-20', type: 'JOB', label: 'ORD-99321 Pickup' },
  { id: '2', date: '2025-06-21', type: 'JOB', label: 'Local Delivery UNIT-02' },
];

const App: React.FC = () => {
  const [job, setJob] = useState<Job>(INITIAL_JOB);
  const [perspective, setPerspective] = useState<Perspective>('DRIVER');
  const [showLegalCenter, setShowLegalCenter] = useState(false);
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'CALENDAR' | 'WAREHOUSE_HUB'>('DASHBOARD');
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);

  const updateJob = (updates: Partial<Job>) => {
    setJob(prev => ({ ...prev, ...updates }));
  };

  const addEvent = (e: CalendarEvent) => setEvents(prev => [...prev, e]);

  /**
   * **Workflow Transition Engine**
   *
   * Handles the progression between the 14 workflow states.
   * Enforces business rules, role-based permissions, and mandatory gates.
   *
   * **Transition Logic:**
   * 1. **Sequential Flow:** Default behavior is to move to the next index in `STEPS`.
   * 2. **Gate validation:** Checks if the current state is a blocked gate before advancing.
   * 3. **Role Validation:** Ensures the current user (Perspective) has authority to advance.
   *
   * **Error Handling:**
   * Returns early and alerts the user if a gate is locked or permission is denied.
   */
  const advanceStatus = () => {
    const sequence = STEPS.map(s => s.id);
    const currIdx = sequence.indexOf(job.status);

    // GATE 1: Binding Estimate Lock (Office Only)
    // Business Logic: Only the Hub can finalize the pricing to prevent disputes.
    if (job.status === JobStatus.BINDING_ESTIMATE && perspective !== 'OFFICE') {
      alert("HUB AUTHORIZATION REQUIRED: Only the Hub (Office) can lock the Binding Estimate and proceed.");
      return;
    }

    // GATE 2: Client Liability Signature
    // Business Logic: Legal requirement for Bill of Lading signature before handling goods.
    if (job.status === JobStatus.CLIENT_APPROVAL && !job.originSigned) {
      alert("LIABILITY GATE: Client must sign the Bill of Lading to proceed to Loading.");
      return;
    }

    // HANDOFF GATE: Post-Load Verification
    // Business Logic: Client confirms nothing was left behind.
    if (job.status === JobStatus.LOAD_VERIFICATION && !job.originSigned) {
      alert("HANDOFF GATE: Pickup departure signature required from Client.");
      return;
    }

    // ROUTING GATE: Transit Destination (Office Only)
    // Business Logic: Dispatch must decide if the truck goes to a Warehouse or directly to Delivery.
    if (job.status === JobStatus.IN_TRANSIT && perspective !== 'OFFICE') {
      alert("ROUTING COMMAND REQUIRED: Hub must decide between Warehouse or Direct Delivery.");
      return;
    }

    // GATE 3: Financial Clearance
    // Business Logic: "No Pay, No Key" - Full payment required before unlocking the truck for unload.
    if (job.status === JobStatus.DESTINATION_GATE && !job.deliveryPaid) {
      alert("FINANCIAL GATE: Final balance must be cleared by Hub to unlock Unloading.");
      return;
    }

    // COMPLETION GATE: Final Handoff
    // Business Logic: Client confirms receipt of all goods and absence of damage.
    if (job.status === JobStatus.FINAL_AUDIT && !job.deliverySigned) {
      alert("COMPLETION GATE: Final delivery handoff signature required from Client.");
      return;
    }

    if (currIdx < sequence.length - 1) {
      updateJob({ status: sequence[currIdx + 1] });
    }
  };

  /**
   * **Gate Blocking Logic**
   *
   * Determines if the current workflow state is strictly locked based on
   * missing requirements (Signatures, Payments, or Permissions).
   *
   * **Mandatory Gates:**
   * 1. `BINDING_ESTIMATE`: Locked for non-Office users.
   * 2. `CLIENT_APPROVAL`: Locked until `originSigned` is true.
   * 3. `DESTINATION_GATE`: Locked until `deliveryPaid` is cleared by Office.
   *
   * @returns {boolean} True if the current state cannot be exited.
   */
  const isGateBlocked =
    (job.status === JobStatus.BINDING_ESTIMATE && perspective !== 'OFFICE') ||
    (job.status === JobStatus.CLIENT_APPROVAL && !job.originSigned) ||
    (job.status === JobStatus.LOAD_VERIFICATION && !job.originSigned) ||
    (job.status === JobStatus.IN_TRANSIT && perspective !== 'OFFICE') ||
    (job.status === JobStatus.DESTINATION_GATE && !job.deliveryPaid) ||
    (job.status === JobStatus.FINAL_AUDIT && !job.deliverySigned);

  const isHelper = perspective === 'HELPER';
  const isOffice = perspective === 'OFFICE';
  const isDriver = perspective === 'DRIVER';

  const isCompleted = job.status === JobStatus.COMPLETED;

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-200">
      <div className="bg-slate-900/80 border-b border-white/5 px-6 py-2 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
          <ShieldAlert className={`w-3 h-3 ${isGateBlocked ? 'text-red-500 animate-pulse' : 'text-green-500'}`} />
          {isCompleted ? 'NODE_TERMINATED: ARCHIVED' : isGateBlocked ? 'PROTOCOL_LOCKED: ACTION REQUIRED' : 'PIPELINE_CLEAR'}
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex bg-slate-950/50 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('DASHBOARD')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === 'DASHBOARD' ? 'bg-slate-800 text-white shadow-lg shadow-black/40' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <LayoutDashboard className="w-3 h-3" /> Dashboard
            </button>
            <button
              onClick={() => setActiveTab('CALENDAR')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === 'CALENDAR' ? 'bg-slate-800 text-white shadow-lg shadow-black/40' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <CalendarIcon className="w-3 h-3" /> Calendar
            </button>
            {isOffice && (
              <button
                onClick={() => setActiveTab('WAREHOUSE_HUB')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === 'WAREHOUSE_HUB' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'text-slate-500 hover:text-purple-400'}`}
              >
                <Database className="w-3 h-3" /> Warehouse Hub
              </button>
            )}
          </div>

          {!isHelper && (
            <button
              onClick={() => setShowLegalCenter(!showLegalCenter)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-lg shadow-blue-900/20 hover:bg-blue-500 transition-all"
            >
              <FileText className="w-3 h-3" /> {showLegalCenter ? 'Close Binder' : 'Legal Binder'}
            </button>
          )}
          <PerspectiveSwitcher current={perspective} onChange={(p) => { setPerspective(p); setShowLegalCenter(false); setActiveTab('DASHBOARD'); }} />
        </div>
      </div>

      <header className="h-16 flex items-center justify-between px-6 bg-slate-950/50 border-b border-white/5 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-900/20">
            {isHelper ? <HardHat className="w-5 h-5 text-white" /> : <Truck className="w-5 h-5 text-white" />}
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tighter uppercase leading-none text-white">
              MOVE MASTERS <span className="text-blue-500 italic">OS</span>
            </h1>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5 font-mono">
              ROLE: {perspective} // NODE: {activeTab === 'WAREHOUSE_HUB' ? 'STORAGE_CENTRAL' : job.id}
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Global Balance</span>
            <span className="text-sm font-black text-white italic">$4,120.00</span>
          </div>
        </div>
      </header>

      {showLegalCenter && !isHelper ? (
        <div className="flex-1 p-6 overflow-y-auto bg-[#020617]">
          <LegalDocumentCenter job={job} perspective={perspective} />
        </div>
      ) : activeTab === 'CALENDAR' ? (
        <div className="flex-1 p-6 overflow-y-auto bg-[#020617]">
          <CalendarPanel perspective={perspective} events={events} onAddRequest={addEvent} />
        </div>
      ) : activeTab === 'WAREHOUSE_HUB' && isOffice ? (
        <div className="flex-1 p-6 overflow-y-auto bg-[#020617]">
          <WarehouseManagementHub job={job} updateJob={updateJob} />
        </div>
      ) : isCompleted ? (
        /* COMPLETED SUCCESS SCREEN */
        <main className="flex-1 flex items-center justify-center p-6 bg-[#020617]">
          <div className="max-w-3xl w-full glass-panel rounded-[3rem] p-12 text-center border-t-4 border-t-green-500 shadow-[0_0_100px_rgba(16,185,129,0.1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Award className="w-64 h-64 text-green-500" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center mb-8 shadow-2xl shadow-green-900/40">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>

              <h1 className="text-4xl font-black uppercase tracking-tighter text-white mb-2 italic">Node {job.id} Resolved</h1>
              <p className="text-xs font-black uppercase text-slate-500 tracking-[0.3em] mb-12">Protocol Enforcement: Final Handshake Complete</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-12">
                <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800">
                  <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Total CF</p>
                  <p className="text-xl font-black text-white italic">{job.financials.cubicBaseCuFt}</p>
                </div>
                <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800">
                  <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Status</p>
                  <p className="text-xl font-black text-green-500 italic">PAID</p>
                </div>
                <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800">
                  <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Signatures</p>
                  <p className="text-xl font-black text-white italic">2/2</p>
                </div>
                <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800">
                  <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Handoff</p>
                  <p className="text-xl font-black text-blue-400 italic">CLEAN</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => window.location.reload()}
                  className="px-10 py-5 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                >
                  Open New Node
                </button>
                {!isHelper && (
                  <button
                    onClick={() => setShowLegalCenter(true)}
                    className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-900/40 transition-all"
                  >
                    View Final Records
                  </button>
                )}
              </div>

              <div className="mt-12 pt-8 border-t border-slate-800 w-full flex justify-between items-center opacity-30">
                <div className="flex items-center gap-2">
                  <Zap className="w-3 h-3 text-slate-500" />
                  <span className="text-[8px] font-mono uppercase">System Log: 0x99A_STMT_EXECUTED</span>
                </div>
                <span className="text-[8px] font-mono uppercase tracking-widest italic">Move Masters OS v4.9.1</span>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <main className="flex-1 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
          <div className="lg:col-span-8 space-y-6 overflow-y-auto pr-1 pb-10 custom-scrollbar">
            {perspective !== 'WAREHOUSE' && (
              <section className="p-8 glass-panel rounded-3xl shadow-2xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <ShieldCheck className="w-32 h-32 text-blue-500" />
                </div>

                <div className="flex justify-between items-center mb-10 relative z-10">
                  <h2 className="text-xl font-black flex items-center gap-3 tracking-tighter uppercase text-white">
                    <ShieldCheck className="text-blue-500 w-6 h-6" />
                    Operational Pipeline
                  </h2>
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${isGateBlocked ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
                    {isGateBlocked ? 'GATE_LOCKED' : 'READY_TO_PROCEED'}
                  </div>
                </div>

                <StatusStepper currentStatus={job.status} />

                {(perspective !== 'WAREHOUSE' && perspective !== 'HELPER') && (
                  <div className="mt-12 flex flex-wrap justify-center md:justify-end gap-4 relative z-10">
                    {job.status === JobStatus.IN_TRANSIT && isOffice && (
                      <div className="w-full bg-slate-900/50 p-6 rounded-2xl border border-blue-500/30 flex flex-col md:flex-row items-center justify-between gap-6 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="bg-blue-600/20 p-3 rounded-xl border border-blue-500/50">
                            <Split className="w-6 h-6 text-blue-400" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black uppercase text-white tracking-widest">Routing Decision Hub</h4>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">Stage 8: Dispatch Command Required</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => { updateJob({ status: JobStatus.WAREHOUSE_CUSTODY, custodyHolder: 'DRIVER' }); alert("Routed to Warehouse Inbound Gate."); }}
                            className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-purple-900/40"
                          >
                            <Warehouse className="w-4 h-4" /> Route to Warehouse
                          </button>
                          <button
                            onClick={() => { updateJob({ status: JobStatus.DESTINATION_GATE }); alert("Routed to Direct Delivery."); }}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-blue-900/40"
                          >
                            <MapPin className="w-4 h-4" /> Direct to Delivery
                          </button>
                        </div>
                      </div>
                    )}

                    {job.status === JobStatus.BINDING_ESTIMATE && isOffice && (
                      <button onClick={advanceStatus} className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-green-900/40">
                        <CheckCircle2 className="w-5 h-5" /> Authorize & Lock Rates
                      </button>
                    )}

                    {(job.status === JobStatus.CLIENT_APPROVAL || job.status === JobStatus.LOAD_VERIFICATION) && perspective === 'CLIENT' && !job.originSigned && (
                      <button onClick={() => { updateJob({ originSigned: true }); alert("Pickup Handoff Recorded."); }} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 animate-pulse">
                        <PenTool className="w-5 h-5" /> Execute Pickup Handoff
                      </button>
                    )}

                    {job.status === JobStatus.FINAL_AUDIT && perspective === 'CLIENT' && !job.deliverySigned && (
                      <button onClick={() => { updateJob({ deliverySigned: true }); alert("Delivery Handoff Recorded."); }} className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 animate-pulse">
                        <PenTool className="w-5 h-5" /> Execute Final Sign-off
                      </button>
                    )}

                    {job.status === JobStatus.FINAL_AUDIT && job.deliverySigned && (isOffice || isDriver) && (
                      <button onClick={advanceStatus} className="bg-green-600 hover:bg-green-500 text-white px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] flex items-center gap-4 shadow-2xl shadow-green-900/50 animate-bounce">
                        <Handshake className="w-6 h-6" /> Perform Final Handshake & Close Contract
                      </button>
                    )}

                    {job.status === JobStatus.DESTINATION_GATE && isOffice && (
                      <button onClick={() => { updateJob({ deliveryPaid: true }); alert("Funds Verified."); }} className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-green-900/40">
                        <CheckCircle2 className="w-5 h-5" /> Confirm Payment & Unlock Unload
                      </button>
                    )}

                    {!isGateBlocked && job.status !== JobStatus.COMPLETED && job.status !== JobStatus.IN_TRANSIT && job.status !== JobStatus.WAREHOUSE_CUSTODY && job.status !== JobStatus.FINAL_AUDIT && (
                      <button onClick={advanceStatus} className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 group">
                        Advance Phase <ChevronRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}

                    {isGateBlocked && perspective === 'DRIVER' && (
                      <div className="flex items-center gap-4 px-8 py-4 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-500 font-black text-[11px] uppercase tracking-[0.15em] shadow-inner">
                        <Lock className="w-5 h-5" />
                        {job.status === JobStatus.IN_TRANSIT ? 'Awaiting Routing Order' :
                          job.status === JobStatus.FINAL_AUDIT ? 'Awaiting Client Delivery Receipt' :
                            (job.status === JobStatus.CLIENT_APPROVAL || job.status === JobStatus.LOAD_VERIFICATION) ? 'Awaiting Pickup Sign-off' : 'Awaiting Hub Auth'}
                      </div>
                    )}
                  </div>
                )}
              </section>
            )}

            {isHelper ? (
              <HelperTaskPanel job={job} />
            ) : perspective === 'WAREHOUSE' ? (
              <WarehouseInventoryPanel job={job} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InventoryPanel job={job} updateJob={updateJob} perspective={perspective} />
                <FinancialPanel job={job} updateJob={updateJob} perspective={perspective} />
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-6 overflow-y-auto pb-10 custom-scrollbar">
            <AICommandCenter job={job} perspective={perspective} />
            {perspective !== 'CLIENT' && (
              <DriverEarningsPanel job={job} hideFinances={perspective === 'WAREHOUSE'} perspective={perspective} />
            )}
            <ChainOfCustodyPanel job={job} updateJob={updateJob} perspective={perspective} />
          </div>
        </main>
      )}
    </div>
  );
};

export default App;
