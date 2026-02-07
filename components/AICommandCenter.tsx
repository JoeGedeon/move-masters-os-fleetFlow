
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { Job, Message, Perspective } from '../types';
import { Bot, Send, Sparkles } from 'lucide-react';

interface AICommandCenterProps {
  job: Job;
  perspective: Perspective;
}

const AICommandCenter: React.FC<AICommandCenterProps> = ({ job, perspective }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `FLEET_FLOW_${perspective} node online. Protocol Enforcement active for Unit ${job.id}.` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Fix: Creating fresh GoogleGenAI instance inside handler per guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: input,
        config: {
          // Fix: Using systemInstruction for role definition and current context
          systemInstruction: `You are the 'Move Masters Hub' AI. You enforce "Operational Honesty".
Current Context:
User Perspective: ${perspective}
Current Job Status: ${job.status}
Custody Holder: ${job.custodyHolder}
Pickup Paid: ${job.pickupPaid ? 'YES' : 'NO'}
Delivery Paid: ${job.deliveryPaid ? 'YES' : 'NO'}

Respond as a crisp, technical logistics dispatcher. Ensure the user follows the "Hard Stop" protocols.`
        }
      });

      // Fix: accessing .text property directly (not a method)
      setMessages(prev => [...prev, { role: 'model', text: response.text || "System Timeout." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Signal lost. Reconnecting to Move Masters Hub..." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl flex flex-col h-[380px] border-t border-t-slate-700/50 shadow-2xl">
      <div className="p-4 border-b border-slate-800/50 flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Bot className="w-4 h-4 text-blue-400" /> Hub Intel
        </h3>
        <Sparkles className="w-3 h-3 text-blue-500/50" />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-medium">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`p-3 rounded-xl max-w-[85%] ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800/80 text-slate-300 border border-slate-700'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && <div className="text-[10px] text-slate-500 animate-pulse uppercase font-black">System Thinking...</div>}
      </div>

      <div className="p-3 bg-black/20 border-t border-slate-800/50">
        <div className="relative">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="System query..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-4 pr-10 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button onClick={handleSend} className="absolute right-2 top-1.5 text-blue-500">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICommandCenter;
