
import React from 'react';
import { Job, InventoryItem } from '../../types';

interface Page3InventoryProps {
    job: Job;
    itemsSlice: InventoryItem[];
    pageIndex: number;
    totalInventoryPages: number;
}

const Page3Inventory: React.FC<Page3InventoryProps> = ({ job, itemsSlice, pageIndex, totalInventoryPages }) => {
    return (
        <div className="p-8 font-serif min-h-[1000px] flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-end border-b-2 border-black pb-2 mb-6">
                    <h2 className="text-xl font-black uppercase">Descriptive Inventory</h2>
                    <span className="text-xs font-bold">Page {pageIndex} of {totalInventoryPages}</span>
                </div>

                <table className="w-full text-xs border-collapse border border-black">
                    <thead>
                        <tr className="bg-slate-100">
                            <th className="border border-black p-1 text-left w-12">ID</th>
                            <th className="border border-black p-1 text-left">Item Description</th>
                            <th className="border border-black p-1 text-left">Condition / Exceptions</th>
                            <th className="border border-black p-1 text-center w-16">Verified</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemsSlice.map((item) => (
                            <tr key={item.id}>
                                <td className="border border-black p-1 font-mono">{item.id}</td>
                                <td className="border border-black p-1 font-bold">{item.name}</td>
                                <td className="border border-black p-1 italic">{item.condition}</td>
                                <td className="border border-black p-1 text-center font-bold">
                                    {item.verified ? 'YES' : ''}
                                </td>
                            </tr>
                        ))}
                        {/* Fill empty rows if needed for visual consistency */}
                        {Array.from({ length: Math.max(0, 20 - itemsSlice.length) }).map((_, i) => (
                            <tr key={`empty-${i}`}>
                                <td className="border border-black p-1">&nbsp;</td>
                                <td className="border border-black p-1">&nbsp;</td>
                                <td className="border border-black p-1">&nbsp;</td>
                                <td className="border border-black p-1">&nbsp;</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="border-t-2 border-black pt-4 mt-8">
                <div className="flex justify-between text-[10px] font-bold">
                    <span>Order: {job.id}</span>
                    <span>Customer Initials: ___________</span>
                </div>
                <p className="text-[10px] mt-2 italic text-center">
                    "I have checked all items listed and acknowledge receipt in good condition except as noted."
                </p>
            </div>
        </div>
    );
};

export default Page3Inventory;
