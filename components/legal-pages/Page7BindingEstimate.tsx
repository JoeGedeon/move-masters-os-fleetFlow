
import React from 'react';
import { Job } from '../../types';

interface Page7BindingEstimateProps {
    job: Job;
}

const Page7BindingEstimate: React.FC<Page7BindingEstimateProps> = ({ job }) => {
    return (
        <div className="p-8 font-serif">
            <h2 className="text-xl font-black uppercase text-center mb-8 border-b-2 border-black pb-4">Binding Estimate of Cost</h2>

            <div className="mb-8">
                <p className="text-justify text-xs mb-4">
                    This agreement guarantees that the total cost of the move, based on the quantities and services listed below,
                    will not exceed the amount shown, provided no additional services are requested by the shipper.
                </p>
            </div>

            <div className="border border-black">
                <div className="grid grid-cols-2 bg-black text-white p-2 font-bold text-xs uppercase">
                    <span>Description</span>
                    <span className="text-right">Amount</span>
                </div>
                <div className="p-4 space-y-2 text-xs">
                    <div className="flex justify-between border-b border-dashed border-slate-300 pb-1">
                        <span>Estimated Weight / Volume</span>
                        <span className="font-mono">{job.financials.cubicEstimateCuFt} CF / {job.financials.cubicEstimateCuFt * 7} LBS</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-slate-300 pb-1">
                        <span>Transportation Charges</span>
                        <span className="font-mono font-bold">${(job.financials.cubicEstimateCuFt * job.financials.cubicBaseRate).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-slate-300 pb-1">
                        <span>Packing & Materials</span>
                        <span className="font-mono">${job.financials.packingMaterialsTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-slate-300 pb-1">
                        <span>Accessorials (Stairs, Long Carry)</span>
                        <span className="font-mono">${(job.financials.stairsOrigin + job.financials.stairsDest).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-black pt-2 font-black text-sm">
                        <span>BINDING TOTAL PRICE</span>
                        <span className="font-mono">${(
                            (job.financials.cubicEstimateCuFt * job.financials.cubicBaseRate) +
                            job.financials.packingMaterialsTotal +
                            job.financials.stairsOrigin + job.financials.stairsDest
                        ).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-xs text-justify italic opacity-75">
                * If the shipper adds items or requests additional services not included in this estimate, the carrier may
                rescind this estimate and issue a new revised estimate or perform the work on a non-binding basis.
            </div>
        </div>
    );
};

export default Page7BindingEstimate;
