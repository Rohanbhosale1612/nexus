import React, { useState } from 'react';
import { PIPELINE_STAGES } from '../types';
import { ToggleLeft, ToggleRight, Layout, Shield, GripVertical, Plus, Route, Clock, CheckSquare } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('pipeline');
  const [stages, setStages] = useState(PIPELINE_STAGES);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-slate-800 dark:text-white">System Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {/* Settings Nav */}
         <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden h-fit">
            <nav className="flex flex-col">
               {[
                  { id: 'pipeline', label: 'Pipeline & Stages', icon: Layout },
                  { id: 'routing', label: 'Lead Routing', icon: Route },
                  { id: 'sla', label: 'SLA & Escalation', icon: Clock },
                  { id: 'validation', label: 'Stage Gates', icon: CheckSquare },
                  { id: 'roles', label: 'Roles & Permissions', icon: Shield },
               ].map(item => (
                  <button
                     key={item.id}
                     onClick={() => setActiveTab(item.id)}
                     className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left
                        ${activeTab === item.id 
                           ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-l-4 border-indigo-600' 
                           : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border-l-4 border-transparent'}
                     `}
                  >
                     <item.icon size={18} /> {item.label}
                  </button>
               ))}
            </nav>
         </div>

         {/* Content */}
         <div className="md:col-span-3">
            {activeTab === 'pipeline' && (
               <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                  <div className="flex justify-between items-center mb-6">
                     <div>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Pipeline Stages</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Configure the sales process steps.</p>
                     </div>
                     <button className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-3 py-2 rounded-lg transition-colors">
                        <Plus size={16} /> Add Stage
                     </button>
                  </div>

                  <div className="space-y-3">
                     {stages.map((stage, idx) => (
                        <div key={stage.id} className="flex items-center gap-4 p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 group hover:border-indigo-200 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800 transition-all">
                           <GripVertical className="text-slate-400 cursor-grab" size={20} />
                           <div className={`w-4 h-4 rounded-full ${stage.color.split(' ')[0]}`}></div>
                           <div className="flex-1">
                              <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{stage.name}</p>
                           </div>
                           <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                              <span>Probability: {10 + (idx * 15)}%</span>
                              <div className="h-4 w-px bg-slate-300 dark:bg-slate-700"></div>
                              <button className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium">Edit</button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {activeTab === 'routing' && (
               <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                 <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Smart Lead Routing</h2>
                 <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Configure how leads are assigned to team members.</p>
                 
                 <div className="space-y-4">
                   <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
                      <div className="flex justify-between items-start">
                         <div>
                            <h3 className="font-bold text-slate-800 dark:text-white">Enterprise Round Robin</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Distributes leads with Value > 10k to Senior Reps.</p>
                         </div>
                         <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold px-2 py-1 rounded">Active</span>
                      </div>
                   </div>
                   <button className="w-full py-2 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 font-medium hover:border-indigo-500 hover:text-indigo-500 transition-colors">
                      + Add Routing Rule
                   </button>
                 </div>
               </div>
            )}

            {activeTab === 'sla' && (
               <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                 <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">SLA & Escalation Policies</h2>
                 <div className="space-y-4">
                    <div className="p-4 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 rounded-xl">
                       <div className="flex items-center gap-2 mb-2">
                          <Clock size={16} className="text-red-500" />
                          <h3 className="font-bold text-red-900 dark:text-red-300">New Lead Response Time</h3>
                       </div>
                       <p className="text-sm text-red-800 dark:text-red-200">Warn if Status is 'New' for > 24 hours. Escalate to Manager.</p>
                    </div>
                 </div>
               </div>
            )}

            {activeTab === 'validation' && (
               <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                 <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Stage Gate Requirements</h2>
                 <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Define mandatory fields required to move leads between stages.</p>
                 
                 <div className="space-y-3">
                    {stages.map(stage => (
                      <div key={stage.id} className="flex items-center justify-between p-3 border-b border-slate-100 dark:border-slate-800">
                         <span className="font-medium text-slate-800 dark:text-slate-200">{stage.name}</span>
                         <div className="flex gap-2">
                            {stage.exitCriteria?.map(field => (
                               <span key={field} className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                                  Required: {field}
                               </span>
                            ))}
                            {!stage.exitCriteria && <span className="text-xs text-slate-400 italic">No requirements</span>}
                         </div>
                      </div>
                    ))}
                 </div>
               </div>
            )}

            {activeTab === 'roles' && (
               <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Role Access Matrix</h2>
                  <div className="overflow-x-auto">
                     <table className="w-full text-sm">
                        <thead>
                           <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                              <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Permission</th>
                              <th className="text-center py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Admin</th>
                              <th className="text-center py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Manager</th>
                              <th className="text-center py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Sales Rep</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                           {[
                              'View All Leads', 'Edit All Leads', 'Delete Leads', 'Manage Settings', 'Import Data'
                           ].map(perm => (
                              <tr key={perm}>
                                 <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">{perm}</td>
                                 <td className="py-3 px-4 text-center"><ToggleRight className="text-green-600 dark:text-green-500 mx-auto" size={24} /></td>
                                 <td className="py-3 px-4 text-center">
                                    {perm === 'Manage Settings' ? <ToggleLeft className="text-slate-300 dark:text-slate-600 mx-auto" size={24} /> : <ToggleRight className="text-green-600 dark:text-green-500 mx-auto" size={24} />}
                                 </td>
                                 <td className="py-3 px-4 text-center">
                                    {(perm === 'Delete Leads' || perm === 'Manage Settings') ? <ToggleLeft className="text-slate-300 dark:text-slate-600 mx-auto" size={24} /> : <ToggleRight className="text-green-600 dark:text-green-500 mx-auto" size={24} />}
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default Settings;