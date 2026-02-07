
import React from 'react';
import { Job } from '../../types';

interface Page6ValuationProps {
    job: Job;
}

const Page6Valuation: React.FC<Page6ValuationProps> = ({ job }) => {
    return (
        <div className="p-8 font-serif">
            <div className="border-4 border-black p-6">
                <h2 className="text-2xl font-black uppercase text-center mb-2">Valuation Selection</h2>
                <p className="text-center text-xs font-bold mb-8 italic">THIS IS NOT INSURANCE. THIS IS LIABILITY COVERAGE.</p>

                <div className="space-y-6">
                    <div className={`border-2 p-4 cursor-pointer ${job.valuationOption === 1 ? 'border-black bg-slate-100' : 'border-slate-300 opacity-50'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-6 h-6 rounded-full border-2 border-black flex items-center justify-center`}>
                                {job.valuationOption === 1 && <div className="w-3 h-3 bg-black rounded-full" />}
                            </div>
                            <div>
                                <h3 className="font-black uppercase">Option 1: Released Value (Basic)</h3>
                                <p className="text-xs">No additional charge. Maximum liability is $0.60 per pound per item.</p>
                            </div>
                        </div>
                    </div>

                    <div className={`border-2 p-4 cursor-pointer ${job.valuationOption === 2 ? 'border-black bg-slate-100' : 'border-slate-300 opacity-50'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-6 h-6 rounded-full border-2 border-black flex items-center justify-center`}>
                                {job.valuationOption === 2 && <div className="w-3 h-3 bg-black rounded-full" />}
                            </div>
                            <div>
                                <h3 className="font-black uppercase">Option 2: Full Value Protection</h3>
                                <p className="text-xs">Carrier is liable for the replacement value of lost or damaged items, subject to a deductible.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="mb-2 font-bold text-xs uppercase">Shipper Signature Selection</p>
                    <div className="border-b border-black w-64 mx-auto mb-1">
                        {job.originSigned ? <span className="font-script text-lg">Digitally Signed by {job.origin.name}</span> : ''}
                    </div>
                    <p className="text-[10px]">Must sign to validate coverage.</p>
                </div>
            </div>
        </div>
    );
};

export default Page6Valuation;
