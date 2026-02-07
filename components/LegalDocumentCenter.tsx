
import React, { useState } from 'react';
import { Job, Perspective } from '../types';
import Page1BOL from './legal-pages/Page1BOL';
import Page2Terms from './legal-pages/Page2Terms';
import Page3Inventory from './legal-pages/Page3Inventory';
import Page4Packing from './legal-pages/Page4Packing';
import Page5PostContract from './legal-pages/Page5PostContract';
import Page6Valuation from './legal-pages/Page6Valuation';
import Page7BindingEstimate from './legal-pages/Page7BindingEstimate';
import Page8EarningsStatement from './legal-pages/Page8EarningsStatement';
import { ChevronLeft, ChevronRight, Download, Printer } from 'lucide-react';

interface LegalDocumentCenterProps {
  job: Job;
  perspective?: Perspective;
}

const LegalDocumentCenter: React.FC<LegalDocumentCenterProps> = ({ job, perspective }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Constants for pagination - increased to 80 lines per page
  const itemsPerPage = 80;
  const inventoryPageCount = Math.max(1, Math.ceil(job.inventory.length / itemsPerPage));
  
  const getPageMapping = () => {
    const mapping: { id: string, label: string, component: React.ReactNode }[] = [
      { id: '1', label: '1', component: <Page1BOL job={job} /> },
      { id: '2', label: '2', component: <Page2Terms /> },
    ];

    // Add Inventory Pages
    for (let i = 0; i < inventoryPageCount; i++) {
      const pageSuffix = inventoryPageCount > 1 ? String.fromCharCode(97 + i) : '';
      mapping.push({
        id: `3${pageSuffix}`,
        label: `3${pageSuffix}`,
        component: (
          <Page3Inventory 
            job={job} 
            itemsSlice={job.inventory.slice(i * itemsPerPage, (i + 1) * itemsPerPage)}
            pageIndex={i + 1}
            totalInventoryPages={inventoryPageCount}
          />
        )
      });
    }

    // Add remaining static pages
    const offset = inventoryPageCount;
    mapping.push({ id: `${offset + 3}`, label: '4', component: <Page4Packing job={job} /> });
    mapping.push({ id: `${offset + 4}`, label: '5', component: <Page5PostContract job={job} /> });
    mapping.push({ id: `${offset + 5}`, label: '6', component: <Page6Valuation job={job} /> });
    mapping.push({ id: `${offset + 6}`, label: '7', component: <Page7BindingEstimate job={job} /> });

    // Internal Financial Statement (Only for Staff)
    if (perspective !== 'CLIENT') {
      mapping.push({ id: `earnings`, label: 'FIN', component: <Page8EarningsStatement job={job} perspective={perspective || 'DRIVER'} /> });
    }

    return mapping;
  };

  const pages = getPageMapping();
  const totalDisplayPages = pages.length;
  const activePage = pages[currentPage - 1];

  return (
    <div className="flex flex-col items-center gap-6 pb-20">
      {/* Document Controls */}
      <div className="sticky top-4 z-[60] flex items-center gap-4 bg-slate-900/90 backdrop-blur border border-slate-700 p-2 rounded-2xl shadow-2xl">
        <button 
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => p - 1)}
          className="p-2 hover:bg-slate-800 rounded-xl disabled:opacity-30 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="px-4 text-sm font-black uppercase tracking-widest text-slate-400">
          Page <span className="text-white">{activePage.label}</span> of {totalDisplayPages}
        </div>

        <button 
          disabled={currentPage === totalDisplayPages}
          onClick={() => setCurrentPage(p => p + 1)}
          className="p-2 hover:bg-slate-800 rounded-xl disabled:opacity-30 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="w-px h-6 bg-slate-700 mx-2" />

        <button className="p-2 hover:bg-slate-800 rounded-xl text-blue-400 transition-colors" title="Download PDF">
          <Download className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition-colors" title="Print Document">
          <Printer className="w-5 h-5" />
        </button>
      </div>

      {/* Page Container */}
      <div className="w-full max-w-5xl transition-all duration-300">
        <div className="bg-white shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-sm overflow-hidden border border-slate-300">
          {activePage.component}
        </div>
      </div>
      
      {/* Page Previews (Thumbnail Bar) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/60 backdrop-blur rounded-xl border border-white/10 overflow-x-auto max-w-[90vw] custom-scrollbar">
        {pages.map((page, i) => (
          <button
            key={page.id}
            onClick={() => setCurrentPage(i + 1)}
            className={`w-10 h-14 rounded-sm border transition-all shrink-0 ${currentPage === i + 1 ? 'border-blue-500 ring-2 ring-blue-500/50 scale-110' : 'border-white/20 opacity-50 hover:opacity-100'}`}
          >
            <div className={`w-full h-full flex flex-col items-center justify-center ${page.label === 'FIN' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>
               <span className={`text-[10px] font-black ${page.label === 'FIN' ? 'text-white' : 'text-slate-400'}`}>{page.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LegalDocumentCenter;
