import React, { useState } from 'react';
import { 
  X, Play, Save, History, Plus, Trash2, ArrowLeft, 
  ChevronRight, ChevronDown, CheckCircle2, XCircle, Code,
  Sliders, GitBranch, Clock, UserCheck
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { Rule } from '../types';

interface RuleBuilderProps {
  onClose: () => void;
}

const RuleBuilder: React.FC<RuleBuilderProps> = ({ onClose }) => {
  const [ruleName, setRuleName] = useState('New Workflow Automation');
  const [activeTab, setActiveTab] = useState<'visual' | 'json'>('visual');
  const [steps, setSteps] = useState([
    { id: 1, type: 'trigger', name: 'Lead Created', details: 'When Status = New' },
    { id: 2, type: 'condition', name: 'High Value Check', details: 'Potential Value > $10k' },
    { id: 3, type: 'action', name: 'Assign Senior Team', details: 'Round Robin: Enterprise' }
  ]);

  const addStep = (type: string) => {
    setSteps([...steps, { 
      id: Date.now(), 
      type, 
      name: type === 'condition' ? 'Check Condition' : 'Perform Action',
      details: type === 'delay' ? 'Wait 2 Days' : 'Configure...'
    }]);
  };

  const removeStep = (id: number) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full h-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="bg-white dark:bg-slate-950 px-6 py-4 flex justify-between items-center shadow-sm shrink-0 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4">
             <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 transition-colors">
                <ArrowLeft size={20} />
             </button>
             <div>
                <input 
                   type="text" 
                   value={ruleName} 
                   onChange={(e) => setRuleName(e.target.value)}
                   className="bg-transparent border-none text-xl font-bold focus:ring-0 p-0 placeholder-slate-400 text-slate-800 dark:text-white w-96"
                   placeholder="Workflow Name"
                />
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                   <span className="w-2 h-2 rounded-full bg-green-500"></span> Active
                   <span>•</span>
                   <span>Version 1.2</span>
                </div>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={onClose} className="px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-sm font-medium">Cancel</button>
             <button className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 font-medium shadow-sm transition-transform active:scale-95">
                <Save size={18} /> Publish Workflow
             </button>
          </div>
        </div>

        {/* Main Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Workflow Canvas */}
          <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-8 overflow-y-auto relative bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
            
            <div className="max-w-xl mx-auto space-y-4 pb-20">
               {steps.map((step, idx) => (
                 <React.Fragment key={step.id}>
                   <div className="relative group">
                     {/* Connector Line */}
                     {idx < steps.length - 1 && (
                       <div className="absolute left-1/2 top-full h-8 w-0.5 bg-slate-300 dark:bg-slate-700 -ml-[1px]"></div>
                     )}
                     
                     <div className={`p-4 rounded-xl border-2 shadow-sm transition-all relative bg-white dark:bg-slate-900 ${step.type === 'trigger' ? 'border-indigo-500' : 'border-slate-200 dark:border-slate-700'}`}>
                        <div className="flex justify-between items-start">
                           <div className="flex gap-3">
                              <div className={`p-2 rounded-lg ${step.type === 'trigger' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                                 {step.type === 'trigger' && <Play size={20} />}
                                 {step.type === 'condition' && <GitBranch size={20} />}
                                 {step.type === 'action' && <UserCheck size={20} />}
                                 {step.type === 'delay' && <Clock size={20} />}
                              </div>
                              <div>
                                 <h4 className="font-bold text-slate-800 dark:text-white">{step.name}</h4>
                                 <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{step.details}</p>
                              </div>
                           </div>
                           {step.type !== 'trigger' && (
                             <button onClick={() => removeStep(step.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                           )}
                        </div>
                     </div>
                   </div>
                   {idx < steps.length - 1 && <div className="h-4"></div>}
                 </React.Fragment>
               ))}

               {/* Add Step Button */}
               <div className="flex justify-center pt-4">
                  <div className="flex gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg">
                     <button onClick={() => addStep('action')} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm text-slate-600 dark:text-slate-300 transition-colors">
                        <Plus size={16} /> Action
                     </button>
                     <div className="w-px bg-slate-200 dark:bg-slate-800 my-1"></div>
                     <button onClick={() => addStep('condition')} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm text-slate-600 dark:text-slate-300 transition-colors">
                        <GitBranch size={16} /> Logic
                     </button>
                     <div className="w-px bg-slate-200 dark:bg-slate-800 my-1"></div>
                     <button onClick={() => addStep('delay')} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm text-slate-600 dark:text-slate-300 transition-colors">
                        <Clock size={16} /> Delay
                     </button>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Panel: Configuration */}
          <div className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col">
             <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50">
                Step Configuration
             </div>
             <div className="flex-1 p-6 space-y-6">
                <p className="text-sm text-slate-500 dark:text-slate-400">Select a step in the canvas to configure its properties.</p>
                
                <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 opacity-50">
                   <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-3"></div>
                   <div className="h-8 w-full bg-slate-200 dark:bg-slate-700 rounded mb-3"></div>
                   <div className="h-24 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuleBuilder;