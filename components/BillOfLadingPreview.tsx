
import React from 'react';
import { Job } from '../types';

interface BillOfLadingPreviewProps {
  job: Job;
}

const BillOfLadingPreview: React.FC<BillOfLadingPreviewProps> = ({ job }) => {
  const f = job.financials;

  const weightTotal = (f.weightBaseLbs * f.weightBaseRate) + (f.weightAddLbs * f.weightAddRate);
  const cubicTotal = (f.cubicBaseCuFt * f.cubicBaseRate) + (f.cubicAddCuFt * f.cubicAddRate);
  
  // Calculate hourly (simpler calc for mock)
  const hourlyTotal = f.hourlyMen * f.hourlyTrucks * f.hourlyRate; // Mocking duration for display

  const packingTotal = f.packingMaterialsTotal + f.fullPackingService + f.packingOther;
  
  const otherTotal = f.fuelSurcharge + f.stairsOrigin + f.stairsDest + f.longCarryOrigin + f.longCarryDest + 
                     f.shuttleOrigin + f.shuttleDest + f.miscBulkyItem + f.splitStopOff + f.pgsService + f.valuationCharge;

  const storageTotal = (f.storageDays > 0) ? (f.storageCuFt * f.storageRate) + f.storageOther : 0;

  const grandTotal = weightTotal + cubicTotal + hourlyTotal + packingTotal + otherTotal + storageTotal;
  const partialPaymentsTotal = f.partialPayments.reduce((a, b) => a + b, 0);
  const balanceDue = grandTotal - partialPaymentsTotal + f.priceAdjustment;

  const Cell = ({ label, value, className = "" }: { label: string, value: string | number, className?: string }) => (
    <div className={`flex justify-between items-center border-b border-black py-0.5 px-1 ${className}`}>
      <span className="text-[8px] font-bold uppercase tracking-tighter text-slate-600">{label}</span>
      <span className="text-[9px] font-mono text-black font-black">{value}</span>
    </div>
  );

  const TableHeader = ({ title }: { title: string }) => (
    <div className="bg-black text-white text-[9px] font-black uppercase tracking-widest text-center py-0.5 mb-1">
      {title}
    </div>
  );

  return (
    <div className="bg-white text-black p-4 md:p-10 shadow-2xl max-w-5xl mx-auto border-2 border-black font-sans leading-none relative">
      {/* Header Info */}
      <div className="flex justify-between items-start border-b-2 border-black pb-2 mb-2">
        <div className="w-1/3 space-y-0.5">
          <h2 className="font-black text-sm uppercase tracking-tighter">Good Friends Movers LLC</h2>
          <p className="text-[8px] font-bold">14 E South Street, Geneseo, NY 14454</p>
          <p className="text-[8px] font-bold">(585) 484-0581 | US DOT: 3921653</p>
          <p className="text-[8px]">goodfriendsmoversllc@gmail.com</p>
        </div>
        <div className="w-1/3 text-center">
          <h1 className="font-black text-xl border-4 border-black p-1 inline-block uppercase leading-none">Interstate Bill of Lading Contract</h1>
        </div>
        <div className="w-1/4 border-2 border-black p-1 space-y-1 font-mono text-[8px]">
          <div className="flex justify-between"><span>Order No:</span> <span className="font-black underline">{job.id}</span></div>
          <div className="flex justify-between"><span>Pickup Date:</span> <span className="font-black underline">{job.pickupDate}</span></div>
          <div className="flex justify-between"><span>1st Available:</span> <span className="font-black underline">{job.firstAvailableDate}</span></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="border border-black">
          <div className="bg-black text-white text-[8px] font-black text-center uppercase py-0.5">Origin</div>
          <div className="p-1 space-y-0.5 text-[9px]">
            <p><span className="font-bold text-[7px] text-slate-400 uppercase">NAME:</span> {job.origin.name}</p>
            <p><span className="font-bold text-[7px] text-slate-400 uppercase">ADDRESS:</span> {job.origin.street}</p>
            <p><span className="font-bold text-[7px] text-slate-400 uppercase">PHONE:</span> {job.origin.phone}</p>
          </div>
        </div>
        <div className="border border-black">
          <div className="bg-black text-white text-[8px] font-black text-center uppercase py-0.5">Destination</div>
          <div className="p-1 space-y-0.5 text-[9px]">
            <p><span className="font-bold text-[7px] text-slate-400 uppercase">NAME:</span> {job.destination.name}</p>
            <p><span className="font-bold text-[7px] text-slate-400 uppercase">ADDRESS:</span> {job.destination.street}</p>
            <p><span className="font-bold text-[7px] text-slate-400 uppercase">PHONE:</span> {job.destination.phone}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Left Column - Legal Clauses */}
        <div className="col-span-7 space-y-2">
          <div className="border border-black p-1 text-[7px] leading-tight text-justify">
            <span className="font-black bg-black text-white px-1">A. TERMS OF PAYMENT</span><br/>
            30% deposit required upon booking. 50% of balance due at pickup. Remaining balance due prior to unloading via Money Order or Cash only.
            <strong className="block border-t border-black mt-1">PAYMENT IN FULL REQUIRED BEFORE TRUCK IS OPENED.</strong>
            <div className="flex justify-between mt-2 pt-1 border-t border-black italic">
              <span>Cust. Sign: {job.originSigned ? 'DIGITALLY RECORDED' : '________________'}</span>
              <span>Date: {job.pickupDate}</span>
            </div>
          </div>

          <div className="border border-black p-1 space-y-1">
             <span className="text-[8px] font-black uppercase">B. Estimated Charges & Disclosures</span>
             <p className="text-[6.5px] leading-tight italic">
               This bill of lading incorporated 49 CFR §375.505(b)(17). Estimates are non-guarantees. Carrier may use sub-contractors.
               Unless exclusive use is purchased, property may be consolidated.
             </p>
             <div className="flex justify-between font-black text-[10px] bg-slate-100 p-1 border-y border-black">
               <span>TOTAL ESTIMATED CHARGES:</span>
               <span>${grandTotal.toFixed(2)}</span>
             </div>
          </div>

          <div className="border border-black p-1 text-[7px] space-y-1">
            <span className="font-black uppercase">C. Accessorial Services Ordered</span>
            <div className="grid grid-cols-3 gap-1">
              {['STORAGE', 'STAIRS', 'SHUTTLE', 'PIANO', 'BULKY', 'LONG CARRY'].map(s => (
                <div key={s} className="flex items-center gap-1">
                  <div className="w-2 h-2 border border-black flex items-center justify-center">
                    {otherTotal > 0 ? <div className="w-1 h-1 bg-black"/> : null}
                  </div>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[6.5px] border-t border-black pt-1 space-y-1 opacity-80 leading-tight">
            <p><strong>D. Claims:</strong> Mover not liable for loss/damage unless claim filed in writing within 9 months. Monies must be paid in full prior to claim filing.</p>
            <p><strong>E. Service:</strong> Standard Delivery is up to 30 business weekdays. Per diem delay rate is $30.00.</p>
          </div>
        </div>

        {/* Right Column - Financial Grid (The Heart of the Contract) */}
        <div className="col-span-5 border-l-2 border-black pl-4">
          <TableHeader title="Summary of Actual Charges/Receipt" />
          
          <div className="mb-2 border border-black">
            <div className="bg-slate-100 text-[8px] font-bold px-1 py-0.5 border-b border-black">WEIGHT CHARGES</div>
            <Cell label={`Base: ${f.weightBaseLbs} lbs @ $${f.weightBaseRate}`} value={`$${(f.weightBaseLbs * f.weightBaseRate).toFixed(2)}`} />
            <Cell label={`Add: ${f.weightAddLbs} lbs @ $${f.weightAddRate}`} value={`$${(f.weightAddLbs * f.weightAddRate).toFixed(2)}`} />
          </div>

          <div className="mb-2 border border-black">
            <div className="bg-slate-100 text-[8px] font-bold px-1 py-0.5 border-b border-black">CUBIC FEET CHARGES</div>
            <Cell label={`Base: ${f.cubicBaseCuFt} cuft @ $${f.cubicBaseRate}`} value={`$${(f.cubicBaseCuFt * f.cubicBaseRate).toFixed(2)}`} />
            <Cell label={`Add: ${f.cubicAddCuFt} cuft @ $${f.cubicAddRate}`} value={`$${(f.cubicAddCuFt * f.cubicAddRate).toFixed(2)}`} />
          </div>

          <div className="mb-2 border border-black">
            <div className="bg-slate-100 text-[8px] font-bold px-1 py-0.5 border-b border-black">HOURLY CHARGES</div>
            <Cell label={`${f.hourlyMen} men / ${f.hourlyTrucks} trucks @ $${f.hourlyRate}`} value={`$${hourlyTotal.toFixed(2)}`} />
          </div>

          <div className="mb-2 border border-black">
            <div className="bg-slate-100 text-[8px] font-bold px-1 py-0.5 border-b border-black">OTHER SERVICES</div>
            <Cell label="Fuel Surcharge" value={`$${f.fuelSurcharge.toFixed(2)}`} />
            <Cell label="Stairs (Orig/Dest)" value={`$${(f.stairsOrigin + f.stairsDest).toFixed(2)}`} />
            <Cell label="Misc / Bulky" value={`$${f.miscBulkyItem.toFixed(2)}`} />
            <Cell label="Valuation Option 2" value="INCLUDED FREE" />
          </div>

          <div className="bg-black text-white p-2 mt-4 space-y-1">
             <div className="flex justify-between text-[12px] font-black italic">
               <span>GRAND TOTAL:</span>
               <span>${grandTotal.toFixed(2)}</span>
             </div>
             {f.partialPayments.map((p, i) => (
               <div key={i} className="flex justify-between text-[9px] font-bold opacity-80">
                 <span>Partial Payment {i+1}:</span>
                 <span>-${p.toFixed(2)}</span>
               </div>
             ))}
             <div className="flex justify-between text-[14px] font-black border-t border-white pt-1 mt-1">
               <span>BALANCE DUE:</span>
               <span>${balanceDue.toFixed(2)}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Footer Acknowledgement */}
      <div className="mt-6 border-t-2 border-black pt-2 grid grid-cols-2 gap-10">
        <div>
           <span className="text-[8px] font-black uppercase">Delivery Acknowledgment</span>
           <p className="text-[6.5px] leading-tight italic mb-2">Shipper acknowledges shipment received in good condition except as noted. All services performed, truck inspected.</p>
           <div className="border-t border-slate-300 pt-1 text-[8px] flex justify-between italic">
              <span>Customer Sign: ________________</span>
              <span>Date: ________</span>
           </div>
        </div>
        <div className="flex items-end justify-end">
           <div className="text-right">
             <p className="text-[7px] font-black uppercase tracking-widest text-slate-400">System Verified Lifecycle</p>
             <p className="text-[10px] font-mono text-black font-black">CERT_HASH: 771-X992-MM</p>
           </div>
        </div>
      </div>

      <div className="absolute top-2 right-2 rotate-12 opacity-10 font-black text-4xl text-blue-600 pointer-events-none select-none">
        ENFORCED BY MOVE MASTERS
      </div>
    </div>
  );
};

export default BillOfLadingPreview;
