
import React, { useState, useRef, useMemo } from 'react';
import { Job, Perspective, JobStatus, InventoryItem } from '../types';
import { 
  Plus, 
  Loader2, 
  ScanLine, 
  Edit2, 
  Trash2, 
  Check, 
  X,
  PackagePlus,
  Layers,
  Lock,
  PenTool
} from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';

interface InventoryPanelProps {
  job: Job;
  updateJob: (u: Partial<Job>) => void;
  perspective: Perspective;
}

const InventoryPanel: React.FC<InventoryPanelProps> = ({ job, updateJob, perspective }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [editingGroupKey, setEditingGroupKey] = useState<string | null>(null);
  const [editBuffer, setEditBuffer] = useState({ name: '', condition: '' });
  
  const [quickName, setQuickName] = useState('');
  const [quickQty, setQuickQty] = useState(1);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Operational Edits are ONLY allowed during Survey phase
  const isInventoryLocked = job.status !== JobStatus.SURVEY_WALKTHROUGH && job.status !== JobStatus.DISPATCHED && job.status !== JobStatus.ARRIVED_ORIGIN;
  const canVerify = perspective === 'DRIVER' && (job.status === JobStatus.SURVEY_WALKTHROUGH || job.status === JobStatus.LOADING);
  const canEdit = (perspective === 'DRIVER' || perspective === 'OFFICE') && !isInventoryLocked;

  const aggregatedInventory = useMemo(() => {
    const groups: Record<string, { items: InventoryItem[], name: string, condition: string }> = {};
    
    job.inventory.forEach(item => {
      const key = `${item.name.toLowerCase()}|${item.condition.toLowerCase()}`;
      if (!groups[key]) {
        groups[key] = { items: [], name: item.name, condition: item.condition };
      }
      groups[key].items.push(item);
    });

    return Object.entries(groups).map(([key, group]) => ({
      key,
      ...group,
      totalCount: group.items.length,
      verifiedCount: group.items.filter(i => i.verified).length,
    }));
  }, [job.inventory]);

  const handleBulkAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!quickName.trim() || isInventoryLocked) return;

    const newItems: InventoryItem[] = [];
    const timestamp = Date.now();
    for (let i = 0; i < quickQty; i++) {
      newItems.push({
        id: `blk-${timestamp}-${i}`,
        name: quickName.trim(),
        condition: 'PBO (Packed by Owner)',
        verified: false
      });
    }

    updateJob({ inventory: [...job.inventory, ...newItems] });
    setQuickName('');
    setQuickQty(1);
  };

  const handleToggleGroupVerification = (groupKey: string, checked: boolean) => {
    const group = aggregatedInventory.find(g => g.key === groupKey);
    if (!group) return;
    const groupItemIds = new Set(group.items.map(i => i.id));
    const newInv = job.inventory.map(item => 
      groupItemIds.has(item.id) ? { ...item, verified: checked } : item
    );
    updateJob({ inventory: newInv });
  };

  const deleteGroup = (groupKey: string) => {
    if (isInventoryLocked) return;
    const group = aggregatedInventory.find(g => g.key === groupKey);
    if (!group) return;
    const groupItemIds = new Set(group.items.map(i => i.id));
    updateJob({ inventory: job.inventory.filter(i => !groupItemIds.has(i.id)) });
  };

  const startEditGroup = (group: any) => {
    if (isInventoryLocked) return;
    setEditingGroupKey(group.key);
    setEditBuffer({ name: group.name, condition: group.condition });
  };

  const saveGroupEdit = () => {
    const group = aggregatedInventory.find(g => g.key === editingGroupKey);
    if (!group) return;
    const groupItemIds = new Set(group.items.map(i => i.id));
    
    const newInv = job.inventory.map(item => 
      groupItemIds.has(item.id) 
        ? { ...item, name: editBuffer.name, condition: editBuffer.condition } 
        : item
    );
    updateJob({ inventory: newInv });
    setEditingGroupKey(null);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || isInventoryLocked) return;
    setIsScanning(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        await performOCR(base64Data, file.type);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("OCR Initiation Failed:", error);
    } finally {
      setIsScanning(false);
    }
  };

  const performOCR = async (base64Data: string, mimeType: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{
          parts: [
            { inlineData: { data: base64Data, mimeType: mimeType } },
            { text: "Extract inventory items. Return JSON array of {name, condition}." }
          ]
        }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                condition: { type: Type.STRING },
              },
              required: ["name", "condition"],
            },
          },
        },
      });

      const parsedItems = JSON.parse(response.text || "[]");
      if (parsedItems.length > 0) {
        const newInventory: InventoryItem[] = parsedItems.map((item: any, idx: number) => ({
          id: `scanned-${Date.now()}-${idx}`,
          name: item.name,
          condition: item.condition,
          verified: false,
        }));
        updateJob({ inventory: [...job.inventory, ...newInventory] });
      }
    } catch (error) {
      alert("Vision engine error.");
    }
  };

  return (
    <div className="p-6 glass-panel rounded-3xl flex flex-col h-full border border-white/5 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-black text-sm flex items-center gap-3 uppercase tracking-widest text-blue-400">
          <Layers className="w-5 h-5" /> Inventory Ledger
        </h3>
        <div className="flex gap-2">
          {canEdit && (
            <>
              <input type="file" accept="image/*" capture="environment" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
              <button onClick={() => fileInputRef.current?.click()} disabled={isScanning} className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 disabled:opacity-30 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all">
                {isScanning ? <Loader2 className="w-3 h-3 animate-spin text-blue-500" /> : <ScanLine className="w-3 h-3 text-blue-500" />}
                OCR Import
              </button>
            </>
          )}
          {isInventoryLocked && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/10 border border-blue-500/20 text-[10px] font-black uppercase text-blue-400 rounded-lg">
              <Lock className="w-3 h-3" /> Ledger Locked
            </div>
          )}
        </div>
      </div>

      {canEdit && (
        <form onSubmit={handleBulkAdd} className="mb-8 flex gap-3 p-3 bg-slate-900 rounded-2xl border border-white/5">
          <input 
            type="text"
            placeholder="Description (e.g. Medium Box)"
            value={quickName}
            onChange={(e) => setQuickName(e.target.value)}
            className="flex-1 bg-black border border-slate-800 focus:border-blue-500/50 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 outline-none transition-all"
          />
          <input 
            type="number"
            min="1"
            value={quickQty}
            onChange={(e) => setQuickQty(parseInt(e.target.value) || 1)}
            className="w-16 bg-black border border-slate-800 focus:border-blue-500/50 rounded-xl px-2 py-3 text-xs text-center text-white font-black outline-none transition-all"
          />
          <button 
            type="submit"
            className="px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-lg shadow-blue-900/40 flex items-center justify-center group"
          >
            <Plus className="w-5 h-5 group-active:scale-90 transition-transform" />
          </button>
        </form>
      )}

      <div className="space-y-3 mb-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
        {aggregatedInventory.length === 0 && (
          <div className="flex flex-col items-center justify-center h-60 border-2 border-dashed border-slate-800 rounded-3xl opacity-30">
            <PackagePlus className="w-10 h-10 mb-3" />
            <p className="text-[11px] uppercase font-black tracking-widest text-center">Empty Inventory</p>
          </div>
        )}

        {aggregatedInventory.map((group) => (
          <div key={group.key} className={`p-4 rounded-2xl flex items-center justify-between group transition-all border ${editingGroupKey === group.key ? 'bg-slate-900 border-blue-500/50' : 'bg-slate-800/20 border-white/5 hover:border-slate-700'}`}>
            <div className="flex items-center gap-4 flex-1 mr-4">
              <div className="flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20">
                <span className="text-sm font-black text-blue-400 leading-none">{group.totalCount}</span>
                <span className="text-[7px] font-black uppercase text-blue-500 mt-1">QTY</span>
              </div>
              
              <div className="flex-1 min-w-0">
                {editingGroupKey === group.key ? (
                  <div className="space-y-2">
                    <input 
                      className="w-full bg-black border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                      value={editBuffer.name}
                      onChange={e => setEditBuffer({ ...editBuffer, name: e.target.value })}
                      autoFocus
                    />
                    <input 
                      className="w-full bg-black border border-slate-700 rounded-lg px-3 py-2 text-[10px] text-slate-400 font-mono italic"
                      value={editBuffer.condition}
                      onChange={e => setEditBuffer({ ...editBuffer, condition: e.target.value })}
                    />
                  </div>
                ) : (
                  <>
                    <p className="text-xs font-black text-white truncate">{group.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono italic truncate mt-0.5">{group.condition}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex-1 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-700" 
                          style={{ width: `${(group.verifiedCount / group.totalCount) * 100}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-black text-slate-500 whitespace-nowrap uppercase tracking-widest">{group.verifiedCount} / {group.totalCount} IN_CUSTODY</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {editingGroupKey === group.key ? (
                <>
                  <button onClick={saveGroupEdit} className="p-2 text-green-500 hover:bg-green-500/10 rounded-xl">
                    <Check className="w-5 h-5" />
                  </button>
                  <button onClick={() => setEditingGroupKey(null)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl">
                    <X className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  {canEdit && (
                    <>
                      <button onClick={() => startEditGroup(group)} className="p-2 text-slate-500 hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteGroup(group.key)} className="p-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <input 
                    type="checkbox" 
                    checked={group.verifiedCount === group.totalCount}
                    disabled={!canVerify}
                    onChange={(e) => handleToggleGroupVerification(group.key, e.target.checked)}
                    className="w-6 h-6 rounded-lg border-slate-700 bg-slate-950 text-blue-600 focus:ring-0 transition-all cursor-pointer disabled:cursor-not-allowed"
                  />
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-4 rounded-2xl border border-dashed transition-all flex items-center justify-between ${job.originSigned ? 'bg-green-600/5 border-green-500/20' : 'bg-slate-950 border-white/5 opacity-50'}`}>
          <div className="flex items-center gap-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${job.originSigned ? 'bg-green-600 shadow-lg shadow-green-900/20' : 'bg-slate-800'}`}>
               <Check className={`w-4 h-4 text-white ${job.originSigned ? '' : 'opacity-20'}`} />
            </div>
            <div>
              <span className={`text-[8px] font-black uppercase tracking-[0.2em] font-mono block ${job.originSigned ? 'text-green-400' : 'text-slate-600'}`}>
                Pickup Handoff
              </span>
              <span className={`text-[10px] font-black uppercase ${job.originSigned ? 'text-white' : 'text-slate-700'}`}>
                {job.originSigned ? 'RECORDED' : 'AWAITING'}
              </span>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border border-dashed transition-all flex items-center justify-between ${job.deliverySigned ? 'bg-green-600/5 border-green-500/20' : 'bg-slate-950 border-white/5 opacity-50'}`}>
          <div className="flex items-center gap-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${job.deliverySigned ? 'bg-green-600 shadow-lg shadow-green-900/20' : 'bg-slate-800'}`}>
               <Check className={`w-4 h-4 text-white ${job.deliverySigned ? '' : 'opacity-20'}`} />
            </div>
            <div>
              <span className={`text-[8px] font-black uppercase tracking-[0.2em] font-mono block ${job.deliverySigned ? 'text-green-400' : 'text-slate-600'}`}>
                Delivery Receipt
              </span>
              <span className={`text-[10px] font-black uppercase ${job.deliverySigned ? 'text-white' : 'text-slate-700'}`}>
                {job.deliverySigned ? 'RECORDED' : 'AWAITING'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPanel;
