
import React from 'react';
import { Job, Perspective } from '../../types';

interface Page8EarningsStatementProps {
    job: Job;
    perspective: Perspective;
}

const Page8EarningsStatement: React.FC<Page8EarningsStatementProps> = ({ job, perspective }) => {
    // Mock earnings logic
    const commissionRate = perspective === 'DRIVER' ? 0.18 : 0.12;
    const totalRevenue = (job.financials.weightBaseLbs * job.financials.weightBaseRate) +
        (job.financials.cubicBaseCuFt * job.financials.cubicBaseRate) +
        (job.financials.hourlyMen * job.financials.hourlyRate * 5); // Mock 5 hrs

    const estimatedPayout = totalRevenue * commissionRate;

    return (
        <div className="p-8 font-serif">
            <div className="bg-slate-900 text-white p-4 mb-8">
                <h2 className="text-xl font-black uppercase text-center">Internal Compensation Statement</h2>
                <p className="text-center text-xs opacity-70">CONFIDENTIAL - NOT FOR CLIENT DISTRIBUTION</p>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <p className="text-xs uppercase font-bold text-slate-500">Contractor</p>
                    <p className="font-black text-lg">{perspective === 'DRIVER' ? 'Lead Driver' : 'Helper'}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs uppercase font-bold text-slate-500">Percentage Split</p>
                    <p className="font-black text-lg">{(commissionRate * 100).toFixed(0)}%</p>
                </div>
            </div>

            <div className="border border-black">
                <div className="bg-slate-100 p-2 font-bold text-xs uppercase border-b border-black">Revenue Basis</div>
                <div className="p-4 space-y-2 text-xs">
                    <div className="flex justify-between">
                        <span>Gross Job Revenue</span>
                        <span className="font-mono">${totalRevenue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 italic">
                        <span>- Fuel Surcharge (Non-Commissionable)</span>
                        <span className="font-mono">-${job.financials.fuelSurcharge.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-dashed border-slate-300 pt-2">
                        <span>Net Commissionable Basis</span>
                        <span className="font-mono">${(totalRevenue - job.financials.fuelSurcharge).toFixed(2)}</span>
                    </div>
                </div>
                <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                    <span className="font-black uppercase text-sm">Estimated Payout</span>
                    <span className="font-mono text-xl font-bold text-green-400">${estimatedPayout.toFixed(2)}</span>
                </div>
            </div>

            <div className="mt-8 p-4 border border-dashed border-red-500 bg-red-50 text-xs text-red-600 font-bold text-center uppercase">
                Payout subject to Final Audit and Deductions for Damages
            </div>
        </div>
    );
};

export default Page8EarningsStatement;
