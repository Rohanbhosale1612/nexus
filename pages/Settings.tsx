import React, { useState } from 'react';
import { PIPELINE_STAGES } from '../types';
import { ToggleLeft, ToggleRight, Layout, Shield, GripVertical, Plus } from 'lucide-react';

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
                  { id: 'roles', label: 'Roles & Permissions', icon: Shield },
                  { id: 'fields', label: 'Custom Fields', icon: ToggleLeft },
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
            
            {activeTab === 'fields' && (
               <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                     <Layout className="text-slate-400 dark:text-slate-500" size={32} />
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white">Custom Fields</h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-sm mt-2">Create custom fields to capture unique business data on your Lead records.</p>
                  <button className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors">Create Field</button>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default Settings;