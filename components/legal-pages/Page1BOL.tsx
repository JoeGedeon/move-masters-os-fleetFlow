
import React from 'react';
import { Job } from '../../types';

interface Page1BOLProps {
    job: Job;
}

const Page1BOL: React.FC<Page1BOLProps> = ({ job }) => {
    return (
        <div className="p-8 font-serif">
            <div className="text-center border-b-2 border-black pb-4 mb-8">
                <h1 className="text-3xl font-black uppercase tracking-widest">Bill of Lading</h1>
                <p className="text-sm font-bold mt-2">ORIGINAL NON-NEGOTIABLE CONTRACT</p>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="border border-black p-4">
                    <h3 className="font-bold bg-black text-white px-2 py-1 mb-2 uppercase text-xs">Origin</h3>
                    <p className="font-bold">{job.origin.name}</p>
                    <p>{job.origin.street}</p>
                    <p>{job.origin.cityStateZip}</p>
                    <p>{job.origin.phone}</p>
                </div>
                <div className="border border-black p-4">
                    <h3 className="font-bold bg-black text-white px-2 py-1 mb-2 uppercase text-xs">Destination</h3>
                    <p className="font-bold">{job.destination.name}</p>
                    <p>{job.destination.street}</p>
                    <p>{job.destination.cityStateZip}</p>
                    <p>{job.destination.phone}</p>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="font-bold border-b border-black mb-2 uppercase text-xs">Shipment Details</h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                    <p><span className="font-bold">Order ID:</span> {job.id}</p>
                    <p><span className="font-bold">Pickup Date:</span> {job.pickupDate}</p>
                    <p><span className="font-bold">Vehicle:</span> {job.vehicleId}</p>
                    <p><span className="font-bold">Status:</span> {job.status}</p>
                </div>
            </div>

            <div className="border-t-2 border-black pt-4 mt-8">
                <p className="text-[10px] text-justify leading-tight">
                    RECEIVED, subject to the classifications and tariffs in effect on the date of the issue of this Bill of Lading,
                    the property described above in apparent good order, except as noted (contents and condition of contents of packages unknown),
                    marked, consigned, and destined as indicated above, which said carrier (the word carrier being understood throughout this contract
                    as meaning any person or corporation in possession of the property under the contract) agrees to carry to its usual place of delivery
                    at said destination.
                </p>
            </div>
        </div>
    );
};

export default Page1BOL;
