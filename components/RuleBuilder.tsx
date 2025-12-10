import React, { useState } from 'react';
import { 
  X, Play, Save, History, Plus, Trash2, ArrowLeft, 
  ChevronRight, ChevronDown, CheckCircle2, XCircle, Code,
  Sliders
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { Rule } from '../types';

interface RuleBuilderProps {
  onClose: () => void;
}

const RuleBuilder: React.FC<RuleBuilderProps> = ({ onClose }) => {
  const [ruleName, setRuleName] = useState('New Lead Assignment Rule');
  const [activeTab, setActiveTab] = useState<'visual' | 'json'>('visual');
  const [conditions, setConditions] = useState([
    { id: 1, field: 'potentialValue', operator: 'greater_than', value: '10000' }
  ]);
  const [simulationResult, setSimulationResult] = useState<'match' | 'no-match' | null>(null);

  const addCondition = () => {
    setConditions([...conditions, { id: Date.now(), field: 'status', operator: 'equals', value: '' }]);
  };

  const removeCondition = (id: number) => {
    setConditions(conditions.filter(c => c.id !== id));
  };

  const handleSimulate = () => {
    // Fake simulation delay
    setSimulationResult(null);
    setTimeout(() => {
       setSimulationResult(Math.random() > 0.5 ? 'match' : 'no-match');
    }, 600);
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
                   placeholder="Rule Name"
                />
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                   <span className="w-2 h-2 rounded-full bg-green-500"></span> Active
                   <span>•</span>
                   <span>Last edited just now</span>
                </div>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-3 py-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors text-sm">
                <History size={16} /> History
             </button>
             <button onClick={onClose} className="px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-sm font-medium">Cancel</button>
             <button className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 font-medium shadow-sm transition-transform active:scale-95">
                <Save size={18} /> Save Rule
             </button>
          </div>
        </div>

        {/* Main Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: Builder */}
          <div className="flex-1 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
             <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex gap-6">
                <button 
                   onClick={() => setActiveTab('visual')}
                   className={`flex items-center gap-2 pb-1 border-b-2 text-sm font-medium transition-colors ${activeTab === 'visual' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                   <Sliders size={16} /> Visual Builder
                </button>
                <button 
                   onClick={() => setActiveTab('json')}
                   className={`flex items-center gap-2 pb-1 border-b-2 text-sm font-medium transition-colors ${activeTab === 'json' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                   <Code size={16} /> JSON Editor
                </button>
             </div>

             <div className="flex-1 p-8 overflow-y-auto">
                {activeTab === 'visual' ? (
                   <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
                      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                         <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                            IF <span className="text-xs font-normal text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">All conditions match</span>
                         </h3>
                         
                         <div className="space-y-4">
                            {conditions.map((condition, idx) => (
                               <div key={condition.id} className="flex items-center gap-3 group animate-in slide-in-from-left-2 duration-200">
                                  <span className="text-xs font-bold text-slate-400 w-8 text-right">{idx === 0 ? 'WHERE' : 'AND'}</span>
                                  <select className="border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none w-40">
                                     <option value="potentialValue">Potential Value</option>
                                     <option value="status">Status</option>
                                     <option value="source">Lead Source</option>
                                  </select>
                                  <select className="border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none w-32">
                                     <option value="greater_than">Greater than</option>
                                     <option value="equals">Equals</option>
                                     <option value="contains">Contains</option>
                                  </select>
                                  <input 
                                     type="text" 
                                     className="border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm flex-1 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                     value={condition.value}
                                     onChange={(e) => {
                                        const newConds = [...conditions];
                                        newConds[idx].value = e.target.value;
                                        setConditions(newConds);
                                     }}
                                  />
                                  <button onClick={() => removeCondition(condition.id)} className="text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                                     <Trash2 size={16} />
                                  </button>
                               </div>
                            ))}
                         </div>
                         
                         <button onClick={addCondition} className="mt-6 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-3 py-2 rounded-lg transition-colors">
                            <Plus size={16} /> Add Condition
                         </button>
                      </div>

                      <div className="flex justify-center">
                         <div className="bg-slate-200 dark:bg-slate-700 w-0.5 h-8"></div>
                      </div>

                      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                         <h3 className="font-bold text-slate-800 dark:text-white mb-4">THEN</h3>
                         <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                               <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Assign Owner</span>
                               <ArrowLeft size={14} className="text-slate-400 rotate-180" />
                               <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">Senior Sales Team</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                               <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Send Email Notification</span>
                               <ArrowLeft size={14} className="text-slate-400 rotate-180" />
                               <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Manager Group</span>
                            </div>
                         </div>
                         <button className="mt-4 flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium hover:bg-green-50 dark:hover:bg-green-900/30 px-3 py-2 rounded-lg transition-colors">
                            <Plus size={16} /> Add Action
                         </button>
                      </div>
                   </div>
                ) : (
                   <div className="h-full bg-slate-950 rounded-xl p-4 overflow-auto font-mono text-sm text-green-400 shadow-inner border border-slate-800">
<pre>{JSON.stringify({
  rule: ruleName,
  active: true,
  conditions: {
    operator: "AND",
    criteria: conditions
  },
  actions: [
    { type: "assign_owner", target: "group_senior_sales" },
    { type: "notify", target: "role_manager" }
  ]
}, null, 2)}</pre>
                   </div>
                )}
             </div>
          </div>

          {/* Right Panel: Preview/Simulate */}
          <div className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col">
             <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50">
                Rule Simulator
             </div>
             <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                <p className="text-sm text-slate-500 dark:text-slate-400">Enter sample values to test if this rule would trigger.</p>
                
                <div className="space-y-4">
                   <div>
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Potential Value</label>
                      <div className="relative">
                         <span className="absolute left-3 top-2 text-slate-400">$</span>
                         <input type="number" className="w-full pl-6 pr-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white" defaultValue="15000" />
                      </div>
                   </div>
                   <div>
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Status</label>
                      <select className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white">
                         <option>New</option>
                         <option>Qualified</option>
                      </select>
                   </div>
                </div>

                <button 
                   onClick={handleSimulate}
                   className="w-full py-2 bg-slate-800 dark:bg-indigo-600 text-white rounded-lg font-medium hover:bg-slate-900 dark:hover:bg-indigo-700 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                   <Play size={16} /> Run Test
                </button>

                {simulationResult && (
                   <div className={`p-4 rounded-xl border animate-in fade-in slide-in-from-bottom-2 duration-300 ${simulationResult === 'match' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
                      <div className="flex items-center gap-2 mb-2">
                         {simulationResult === 'match' ? (
                            <CheckCircle2 className="text-green-600 dark:text-green-400" size={20} />
                         ) : (
                            <XCircle className="text-red-600 dark:text-red-400" size={20} />
                         )}
                         <span className={`font-bold ${simulationResult === 'match' ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                            {simulationResult === 'match' ? 'Rule Matched' : 'No Match'}
                         </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                         {simulationResult === 'match' 
                            ? 'All conditions were met. Actions would execute.' 
                            : 'Potential Value condition failed (Value < 10000).'}
                      </p>
                   </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuleBuilder;