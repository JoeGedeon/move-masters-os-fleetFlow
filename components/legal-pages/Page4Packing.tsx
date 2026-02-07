
import React from 'react';
import { Job } from '../../types';

interface Page4PackingProps {
    job: Job;
}

const Page4Packing: React.FC<Page4PackingProps> = ({ job }) => {
    return (
        <div className="p-8 font-serif">
            <h2 className="text-xl font-black uppercase text-center mb-8 border-b-2 border-black pb-4">Packing Services & Materials</h2>

            <div className="border border-black p-4 mb-6">
                <h3 className="font-bold mb-2 uppercase text-sm">Services Ordered</h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="flex justify-between border-b border-dashed border-slate-400 py-1">
                        <span>Full Packing Service</span>
                        <span className="font-bold">{job.financials.fullPackingService > 0 ? 'YES' : 'NO'}</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-slate-400 py-1">
                        <span>Materials Total</span>
                        <span className="font-bold">${job.financials.packingMaterialsTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="bg-slate-100 p-4 border border-black mb-8 text-[10px]">
                <h4 className="font-bold mb-2">Packing Disclaimer</h4>
                <p className="text-justify mb-2">
                    Carrier is not liable for damage to the contents of boxes packed by the shipper (PBO - Packed by Owner),
                    unless external damage to the container is noted at the time of delivery.
                </p>
                <p className="text-justify">
                    Rate for packing labor is included in hourly totals unless specified otherwise. Materials are billed based on actual usage.
                </p>
            </div>

            <div className="mt-8 pt-8 border-t-2 border-black flex justify-between">
                <div className="text-center">
                    <div className="w-48 border-b border-black mb-1"></div>
                    <p className="text-[10px] uppercase font-bold">Shipper Signature</p>
                </div>
                <div className="text-center">
                    <div className="w-48 border-b border-black mb-1"></div>
                    <p className="text-[10px] uppercase font-bold">Packer Lead Signature</p>
                </div>
            </div>
        </div>
    );
};

export default Page4Packing;
