import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Lead, PIPELINE_STAGES, LeadStatus } from '../types';
import { 
  Search, Plus, Filter, LayoutGrid, List, SlidersHorizontal, ArrowUpDown, 
  ChevronDown, CheckSquare, Trash2, Mail, Download, GripVertical, MoreHorizontal 
} from 'lucide-react';
import LeadDetail from './LeadDetail';
import ImportWizard from '../components/ImportWizard';
import NewLeadWizard from '../components/NewLeadWizard';

const Leads = () => {
  const { leads, deleteLead, moveLeadStage } = useCRM();
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [showImport, setShowImport] = useState(false);
  const [showNewWizard, setShowNewWizard] = useState(false);

  // Kanban Drag State
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = (lead.firstName + ' ' + lead.lastName + lead.company).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || lead.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedLeads.size === filteredLeads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(filteredLeads.map(l => l.id)));
    }
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(selectedLeads);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedLeads(newSet);
  };

  // --- Kanban Logic ---
  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    setDraggedLeadId(leadId);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent, stageId: LeadStatus) => {
    e.preventDefault();
    if (draggedLeadId) {
      moveLeadStage(draggedLeadId, stageId);
      setDraggedLeadId(null);
    }
  };
  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

  // If a lead is selected for detail view
  if (selectedLeadId) {
    const lead = leads.find(l => l.id === selectedLeadId);
    if (lead) return <LeadDetail lead={lead} onBack={() => setSelectedLeadId(null)} />;
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
           <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Leads</h1>
           <p className="text-slate-500 dark:text-slate-400 text-sm">Manage and track your potential customers.</p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={() => setShowImport(true)}
             className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium shadow-sm transition-colors"
           >
              Import
           </button>
           <button 
             onClick={() => setShowNewWizard(true)}
             className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium shadow-sm shadow-indigo-200 dark:shadow-none transition-colors"
           >
             <Plus size={16} /> New Lead
           </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 shrink-0 scrollbar-hide">
         {['All', ...PIPELINE_STAGES.map(s => s.id)].map(status => (
            <button
               key={status}
               onClick={() => setFilterStatus(status)}
               className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
                  ${filterStatus === status 
                     ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-300' 
                     : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700'}
               `}
            >
               {status === 'All' ? 'All Leads' : status}
            </button>
         ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-wrap gap-2 items-center justify-between shrink-0">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <div className="relative flex-1 max-w-sm">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
             <input 
               type="text" 
               placeholder="Search..." 
               className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all dark:text-white"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
           <button 
             onClick={() => setViewMode('list')}
             className={`p-1.5 rounded-md transition-all flex items-center gap-2 text-sm font-medium ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
           >
              <List size={16} /> List
           </button>
           <button 
             onClick={() => setViewMode('kanban')}
             className={`p-1.5 rounded-md transition-all flex items-center gap-2 text-sm font-medium ${viewMode === 'kanban' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
           >
              <LayoutGrid size={16} /> Pipeline
           </button>
        </div>
      </div>

      {/* Main Content View */}
      <div className="flex-1 min-h-0 relative">
        {viewMode === 'list' ? (
           <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden h-full flex flex-col">
              <div className="overflow-auto flex-1">
                 <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0 z-10 shadow-sm">
                       <tr>
                          <th className="w-12 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                             <input type="checkbox" className="rounded border-slate-300 dark:border-slate-600 dark:bg-slate-700" onChange={toggleSelectAll} checked={selectedLeads.size === filteredLeads.length && filteredLeads.length > 0} />
                          </th>
                          <th className="px-6 py-3 border-b border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider group cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                             <div className="flex items-center gap-1">Name <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-100" /></div>
                          </th>
                          <th className="px-6 py-3 border-b border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider">Company</th>
                          <th className="px-6 py-3 border-b border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 border-b border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider">Score</th>
                          <th className="px-6 py-3 border-b border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider text-right">Value</th>
                          <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 w-10"></th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                       {filteredLeads.map((lead) => (
                          <tr 
                             key={lead.id} 
                             className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group ${selectedLeads.has(lead.id) ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : ''}`}
                             onClick={() => setSelectedLeadId(lead.id)}
                          >
                             <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                                <input type="checkbox" className="rounded border-slate-300 dark:border-slate-600 dark:bg-slate-700" checked={selectedLeads.has(lead.id)} onChange={(e) => toggleSelect(lead.id, e as any)} />
                             </td>
                             <td className="px-6 py-3">
                                <div className="flex items-center gap-3">
                                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${lead.score > 70 ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                                      {lead.firstName[0]}{lead.lastName[0]}
                                   </div>
                                   <div>
                                      <div className="font-medium text-slate-900 dark:text-slate-100">{lead.firstName} {lead.lastName}</div>
                                      <div className="text-xs text-slate-500 dark:text-slate-400">{lead.email}</div>
                                   </div>
                                </div>
                             </td>
                             <td className="px-6 py-3 text-slate-600 dark:text-slate-300 text-sm font-medium">{lead.company}</td>
                             <td className="px-6 py-3">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border 
                                   ${PIPELINE_STAGES.find(s => s.id === lead.status)?.color || 'bg-slate-100 border-slate-200'}`}>
                                   {lead.status}
                                </span>
                             </td>
                             <td className="px-6 py-3">
                                <div className="flex items-center gap-2">
                                   <div className="w-16 bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                                      <div 
                                         className={`h-full rounded-full ${lead.score > 70 ? 'bg-green-500' : lead.score > 40 ? 'bg-yellow-500' : 'bg-slate-400'}`} 
                                         style={{ width: `${lead.score}%` }}
                                      ></div>
                                   </div>
                                   <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{lead.score}</span>
                                </div>
                             </td>
                             <td className="px-6 py-3 text-right font-medium text-slate-700 dark:text-slate-300 text-sm">
                                {formatCurrency(lead.potentialValue)}
                             </td>
                             <td className="px-4 py-3">
                               <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                 <MoreHorizontal size={16} />
                               </button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
                 {filteredLeads.length === 0 && (
                    <div className="p-12 text-center text-slate-500 dark:text-slate-400">No leads match your filters.</div>
                 )}
              </div>
           </div>
        ) : (
           /* Kanban View */
           <div className="h-full overflow-x-auto overflow-y-hidden pb-2">
              <div className="flex gap-4 h-full min-w-max px-1">
                {PIPELINE_STAGES.map((stage) => {
                  const stageLeads = filteredLeads.filter(l => l.status === stage.id);
                  const stageValue = stageLeads.reduce((acc, l) => acc + (l.potentialValue || 0), 0);

                  return (
                    <div 
                      key={stage.id} 
                      className="w-80 flex-shrink-0 flex flex-col bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, stage.id)}
                    >
                      <div className={`p-3 border-b border-slate-200 dark:border-slate-800 rounded-t-xl flex justify-between items-center bg-white dark:bg-slate-900`}>
                        <div>
                           <h3 className="font-semibold text-slate-700 dark:text-slate-200">{stage.name}</h3>
                           <p className="text-xs text-slate-400">{formatCurrency(stageValue)} • {stageLeads.length}</p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${stage.color.split(' ')[0]}`}></div>
                      </div>

                      <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {stageLeads.map((lead) => (
                          <div
                            key={lead.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, lead.id)}
                            onClick={() => setSelectedLeadId(lead.id)}
                            className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 cursor-grab hover:shadow-md dark:hover:border-slate-600 transition-all group relative"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium text-slate-800 dark:text-slate-100 text-sm truncate">{lead.company}</span>
                              <GripVertical size={14} className="text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100" />
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{lead.firstName} {lead.lastName}</p>
                            
                            <div className="flex justify-between items-center text-xs">
                               <span className="font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(lead.potentialValue)}</span>
                               <div className={`px-1.5 py-0.5 rounded text-[10px] ${lead.score > 60 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'}`}>
                                  {lead.score} pts
                               </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
           </div>
        )}
      </div>

      {/* Bulk Action Bar */}
      {selectedLeads.size > 0 && (
         <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900 dark:bg-slate-800 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom-4 z-50 border border-slate-700">
            <span className="font-bold text-sm">{selectedLeads.size} selected</span>
            <div className="h-4 w-px bg-slate-700"></div>
            <div className="flex items-center gap-2">
               <button className="p-2 hover:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-300 hover:text-white flex flex-col items-center gap-1 text-[10px]">
                  <CheckSquare size={18} /> Status
               </button>
               <button className="p-2 hover:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-300 hover:text-white flex flex-col items-center gap-1 text-[10px]">
                  <Mail size={18} /> Email
               </button>
               <button 
                  onClick={() => {
                     selectedLeads.forEach(id => deleteLead(id));
                     setSelectedLeads(new Set());
                  }}
                  className="p-2 hover:bg-red-900/50 rounded-lg transition-colors text-red-400 hover:text-red-300 flex flex-col items-center gap-1 text-[10px]"
               >
                  <Trash2 size={18} /> Delete
               </button>
            </div>
            <button onClick={() => setSelectedLeads(new Set())} className="ml-2 text-slate-400 hover:text-white">
               <ArrowUpDown className="rotate-45" size={16} />
            </button>
         </div>
      )}

      {/* Modals */}
      {showImport && <ImportWizard onClose={() => setShowImport(false)} />}
      {showNewWizard && <NewLeadWizard onClose={() => setShowNewWizard(false)} />}
    </div>
  );
};

export default Leads;