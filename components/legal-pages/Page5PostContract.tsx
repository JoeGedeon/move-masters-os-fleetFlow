
import React from 'react';
import { Job } from '../../types';

interface Page5PostContractProps {
    job: Job;
}

const Page5PostContract: React.FC<Page5PostContractProps> = ({ job }) => {
    return (
        <div className="p-8 font-serif text-xs">
            <h2 className="text-xl font-black uppercase text-center mb-8 border-b-2 border-black pb-4">Post-Move Service Contract</h2>

            <div className="space-y-6">
                <div>
                    <h3 className="font-bold uppercase mb-2">1. Delivery Acknowledgement</h3>
                    <p className="text-justify mb-2">
                        The services described in the Bill of Lading have been completed. The shipper acknowledges that all property
                        has been delivered in good condition, except as noted on the Inventory sheets.
                    </p>
                </div>

                <div>
                    <h3 className="font-bold uppercase mb-2">2. Damage Claims</h3>
                    <p className="text-justify mb-2">
                        Any claim for loss or damage must be filed in writing with the carrier within nine (9) months after delivery.
                        No claim will be processed until all transportation charges have been paid in full.
                    </p>
                </div>

                <div>
                    <h3 className="font-bold uppercase mb-2">3. Start / Stop Times</h3>
                    <div className="border border-black p-2 grid grid-cols-2 gap-4">
                        <div>
                            <span className="block font-bold">Start Time:</span> {job.financials.hourlyPart1Start}
                        </div>
                        <div>
                            <span className="block font-bold">End Time:</span> {job.financials.hourlyPart1End}
                        </div>
                    </div>
                </div>

                <div className="border border-black p-4 bg-slate-50 mt-8">
                    <h3 className="font-bold text-center uppercase mb-4">Completion Sign-off</h3>
                    <p className="text-justify mb-8 italic">
                        I verify that the crew has performed all services requested and I release Move Masters from further liability
                        regarding the placement of items in the residence.
                    </p>

                    <div className="flex justify-between">
                        <div className="text-center">
                            <span className="font-bold block mb-4">{job.deliverySigned ? 'DIGITALLY SIGNED' : '_______________________'}</span>
                            <span className="text-[10px] uppercase">Shipper Signature</span>
                        </div>
                        <div className="text-center">
                            <span className="font-bold block mb-4">{job.deliverySigned ? job.pickupDate : '________'}</span>
                            <span className="text-[10px] uppercase">Date</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page5PostContract;
