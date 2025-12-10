import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, Mail, Phone, Calendar, MessageSquare, MoreHorizontal, 
  Edit3, Star, Clock, CheckCircle2, Building2, MapPin, Tag, Plus,
  LayoutTemplate, Check, AlertCircle, PlayCircle, Filter, GitMerge, AlertTriangle
} from 'lucide-react';
import { Lead, Activity, PIPELINE_STAGES } from '../types';
import { useCRM } from '../context/CRMContext';

interface LeadDetailProps {
  lead: Lead;
  onBack: () => void;
}

const LeadDetail: React.FC<LeadDetailProps> = ({ lead, onBack }) => {
  const { updateLead, addActivity, toggleLeadFollow, currentUser, findDuplicates, mergeLeads, moveLeadStage } = useCRM();
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'activities' | 'rules' | 'json'>('overview');
  const [noteInput, setNoteInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(lead);
  
  // Module 6: Timeline Filters
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'communication' | 'system'>('all');

  // Module 4: Duplicate Detection
  const duplicates = useMemo(() => findDuplicates(lead), [lead]);
  const [showMergeModal, setShowMergeModal] = useState(false);

  // Module 5: Stage Validation State
  const [stageError, setStageError] = useState<string[] | null>(null);

  const handleSave = () => {
    updateLead(lead.id, editForm);
    setIsEditing(false);
  };

  const handleStageClick = (stageId: string) => {
    // Prevent moving to current or previous blindly (for demo logic, we allow moving back, but moving forward triggers validation)
    const currentIdx = PIPELINE_STAGES.findIndex(s => s.id === lead.status);
    const targetIdx = PIPELINE_STAGES.findIndex(s => s.id === stageId);
    
    if (targetIdx === currentIdx) return;

    const result = moveLeadStage(lead.id, stageId as any);
    if (!result.success && result.missingFields) {
      setStageError(result.missingFields);
      setTimeout(() => setStageError(null), 5000);
    }
  };

  const handleAddNote = () => {
    if (!noteInput.trim()) return;
    
    // Module 6: Mention Parsing (Visual only for prototype)
    const hasMention = noteInput.includes('@');
    
    const activity: Activity = {
      id: `act-${Date.now()}`,
      type: 'note',
      description: hasMention ? `Note with mention` : `Note added`,
      timestamp: new Date().toISOString(),
      performedBy: currentUser.name,
      details: noteInput
    };

    addActivity(lead.id, activity);
    setNoteInput('');
  };

  const filteredActivities = lead.activities.filter(act => {
    if (timelineFilter === 'all') return true;
    if (timelineFilter === 'communication') return ['email', 'call', 'meeting', 'note'].includes(act.type);
    if (timelineFilter === 'system') return ['stage_change', 'task', 'alert', 'merge'].includes(act.type);
    return true;
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone size={14} className="text-blue-500" />;
      case 'email': return <Mail size={14} className="text-green-500" />;
      case 'meeting': return <Calendar size={14} className="text-purple-500" />;
      case 'stage_change': return <LayoutTemplate size={14} className="text-indigo-500" />;
      case 'alert': return <AlertTriangle size={14} className="text-red-500" />;
      case 'merge': return <GitMerge size={14} className="text-orange-500" />;
      default: return <MessageSquare size={14} className="text-slate-500" />;
    }
  };

  const getCurrentStageIndex = () => {
    return PIPELINE_STAGES.findIndex(s => s.id === lead.status);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-full">
      {/* 1. Header & Stage Path */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 shadow-sm">
        {/* Top Bar */}
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 transition-colors">
              <ArrowLeft size={20} />
            </button>
            
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                  {lead.firstName[0]}{lead.lastName[0]}
               </div>
               <div>
                  <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                     {lead.firstName} {lead.lastName}
                     <button onClick={() => toggleLeadFollow(lead.id)} className="focus:outline-none">
                        <Star size={18} className={`transition-colors ${lead.isFollowed ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300 hover:text-yellow-400'}`} />
                     </button>
                     {/* Module 3: SLA Status Indicator */}
                     {lead.slaStatus === 'breached' && (
                       <span className="flex items-center gap-1 text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-bold border border-red-200 dark:border-red-800">
                         <Clock size={10} /> SLA Breached
                       </span>
                     )}
                  </h1>
                  <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                     <span className="flex items-center gap-1"><Building2 size={14} /> {lead.company}</span>
                     <span>•</span>
                     <span className="flex items-center gap-1"><MapPin size={14} /> {lead.address?.city || 'Unknown'}, {lead.address?.country || 'USA'}</span>
                  </div>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button 
               onClick={() => setIsEditing(!isEditing)} 
               className="px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2 transition-colors"
             >
                <Edit3 size={16} /> Edit
             </button>
             <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors">
                Convert
             </button>
             <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <MoreHorizontal size={20} />
             </button>
          </div>
        </div>

        {/* Module 5: Dynamic Stage Path */}
        <div className="px-6 pb-4 overflow-x-auto relative">
           {stageError && (
             <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-50 flex items-center gap-2 animate-in slide-in-from-bottom-2">
               <AlertCircle size={16} />
               <span>Cannot move stage. Missing: {stageError.join(', ')}</span>
             </div>
           )}
           <div className="flex items-center min-w-max">
              {PIPELINE_STAGES.map((stage, idx) => {
                 const currentIdx = getCurrentStageIndex();
                 const isCompleted = idx < currentIdx;
                 const isCurrent = idx === currentIdx;
                 
                 return (
                    <div key={stage.id} className="flex items-center group">
                       <button 
                          onClick={() => handleStageClick(stage.id as any)}
                          className={`
                          flex items-center px-4 py-2 rounded-r-full relative outline-none
                          ${idx === 0 ? 'rounded-l-full' : '-ml-4 pl-8'}
                          ${isCurrent ? 'bg-indigo-600 z-10 text-white shadow-md' : isCompleted ? 'bg-green-600 text-white z-0 hover:bg-green-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 z-0 hover:bg-slate-200 dark:hover:bg-slate-700'}
                          border-r-2 border-white dark:border-slate-900 transition-colors cursor-pointer
                       `}>
                          <span className="text-xs font-bold whitespace-nowrap">{stage.name}</span>
                          {isCompleted && <Check size={12} className="ml-2" />}
                       </button>
                    </div>
                 );
              })}
           </div>
        </div>
      </div>

      {/* Module 4: Duplicate Warning Banner */}
      {duplicates.length > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border-b border-orange-200 dark:border-orange-800 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <AlertTriangle className="text-orange-600 dark:text-orange-400" size={20} />
             <div>
                <p className="text-sm font-bold text-orange-800 dark:text-orange-300">Potential Duplicates Detected</p>
                <p className="text-xs text-orange-700 dark:text-orange-400">We found {duplicates.length} other record(s) similar to this lead.</p>
             </div>
          </div>
          <button 
             onClick={() => setShowMergeModal(true)}
             className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300 text-xs font-bold rounded shadow-sm hover:bg-orange-50 dark:hover:bg-slate-700"
          >
             Review & Merge
          </button>
        </div>
      )}

      {/* 2. Main Body */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Left Column (Main) */}
         <div className="lg:col-span-2 space-y-6">
            
            {/* Tabs Container */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 min-h-[500px]">
               <div className="border-b border-slate-200 dark:border-slate-800 px-6">
                  <nav className="-mb-px flex space-x-8 overflow-x-auto scrollbar-hide">
                     {['overview', 'details', 'activities', 'rules', 'json'].map((tab) => (
                        <button
                           key={tab}
                           onClick={() => setActiveTab(tab as any)}
                           className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                              ${activeTab === tab ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}
                           `}
                        >
                           {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                     ))}
                  </nav>
               </div>
               
               <div className="p-6">
                  {activeTab === 'overview' && (
                     <div className="space-y-8 animate-in fade-in duration-300">
                        {/* Highlights */}
                        <div className="grid grid-cols-3 gap-4">
                           <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Score</span>
                              <div className="flex items-center gap-2 mt-1">
                                 <span className="text-2xl font-bold text-slate-800 dark:text-white">{lead.score}</span>
                                 <div className={`text-xs px-2 py-0.5 rounded-full ${lead.score > 70 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                    {lead.score > 70 ? 'Hot' : 'Warm'}
                                 </div>
                              </div>
                           </div>
                           <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Value</span>
                              <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1">${lead.potentialValue.toLocaleString()}</div>
                           </div>
                           <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Stage</span>
                              <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-1 truncate">{lead.status}</div>
                           </div>
                        </div>

                        {/* Quick Actions */}
                        <div>
                           <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
                           <div className="grid grid-cols-3 gap-4">
                              <button className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:shadow-md transition-all group">
                                 <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-full mb-2 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40">
                                    <Mail className="text-indigo-600 dark:text-indigo-400" size={20} />
                                 </div>
                                 <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Email</span>
                              </button>
                              <button className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-green-300 hover:shadow-md transition-all group">
                                 <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-full mb-2 group-hover:bg-green-100 dark:group-hover:bg-green-900/40">
                                    <Phone className="text-green-600 dark:text-green-400" size={20} />
                                 </div>
                                 <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Call</span>
                              </button>
                              <button className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-purple-300 hover:shadow-md transition-all group">
                                 <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-full mb-2 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/40">
                                    <Calendar className="text-purple-600 dark:text-purple-400" size={20} />
                                 </div>
                                 <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Meeting</span>
                              </button>
                           </div>
                        </div>
                     </div>
                  )}

                  {activeTab === 'details' && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 animate-in fade-in duration-300">
                        {[
                           { label: 'First Name', key: 'firstName' },
                           { label: 'Last Name', key: 'lastName' },
                           { label: 'Email', key: 'email' },
                           { label: 'Phone', key: 'phone' },
                           { label: 'Company', key: 'company' },
                           { label: 'Position', key: 'position' },
                           { label: 'Source', key: 'source' },
                           { label: 'Street', key: 'address.street', val: lead.address?.street },
                           { label: 'City', key: 'address.city', val: lead.address?.city },
                        ].map((field) => (
                           <div key={field.key} className="group">
                              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1">{field.label}</label>
                              {isEditing ? (
                                 <input 
                                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                                    defaultValue={field.val || (lead as any)[field.key]}
                                    onChange={(e) => {
                                       if(field.key.includes('address')) {
                                          // complex handling skipped for proto
                                       } else {
                                          setEditForm({...editForm, [field.key]: e.target.value});
                                       }
                                    }}
                                 />
                              ) : (
                                 <div className="text-sm text-slate-800 dark:text-slate-200 font-medium py-1.5 border-b border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-700 transition-colors">
                                    {field.val || (lead as any)[field.key]}
                                 </div>
                              )}
                           </div>
                        ))}
                        {isEditing && (
                           <div className="col-span-2 flex justify-end gap-3 mt-4">
                              <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-600 dark:text-slate-400">Cancel</button>
                              <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save Changes</button>
                           </div>
                        )}
                     </div>
                  )}
                  
                  {activeTab === 'activities' && (
                     <div className="space-y-6 animate-in fade-in duration-300">
                        {/* Composer */}
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                           <div className="flex gap-2 mb-2">
                              <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 px-3 py-1 bg-white dark:bg-slate-700 rounded shadow-sm">Note</button>
                              <button className="text-xs font-medium text-slate-500 dark:text-slate-400 px-3 py-1 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors">Email</button>
                              <button className="text-xs font-medium text-slate-500 dark:text-slate-400 px-3 py-1 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors">Call Log</button>
                           </div>
                           <textarea 
                              className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                              placeholder="Add a note (use @ to mention)..."
                              rows={3}
                              value={noteInput}
                              onChange={(e) => setNoteInput(e.target.value)}
                           ></textarea>
                           <div className="flex justify-end mt-2">
                              <button 
                                 onClick={handleAddNote}
                                 className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded shadow-sm hover:bg-indigo-700 transition-colors"
                              >
                                 Post Activity
                              </button>
                           </div>
                        </div>

                        {/* Module 6: Unified Timeline Controls */}
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-bold text-slate-800 dark:text-white">Timeline</h3>
                          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                             <button onClick={() => setTimelineFilter('all')} className={`px-3 py-1 text-xs rounded-md ${timelineFilter === 'all' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500'}`}>All</button>
                             <button onClick={() => setTimelineFilter('communication')} className={`px-3 py-1 text-xs rounded-md ${timelineFilter === 'communication' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500'}`}>Comm</button>
                             <button onClick={() => setTimelineFilter('system')} className={`px-3 py-1 text-xs rounded-md ${timelineFilter === 'system' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500'}`}>System</button>
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 space-y-8 pb-4">
                           {filteredActivities.length === 0 && <div className="pl-8 text-sm text-slate-400">No activities match filter.</div>}
                           {filteredActivities.map((activity, idx) => (
                              <div key={activity.id} className="relative pl-8 animate-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                                 <div className={`absolute -left-[9px] top-0 p-1 rounded-full border border-slate-200 dark:border-slate-800 ${activity.isMilestone ? 'bg-indigo-100 dark:bg-indigo-900' : 'bg-white dark:bg-slate-900'}`}>
                                    {getActivityIcon(activity.type)}
                                 </div>
                                 <div className={`bg-white dark:bg-slate-800/50 p-3 rounded-lg border hover:border-slate-200 dark:hover:border-slate-700 transition-colors ${activity.isMilestone ? 'border-indigo-200 dark:border-indigo-800 shadow-sm' : 'border-slate-100 dark:border-slate-800/50'}`}>
                                    <div className="flex items-center justify-between mb-1">
                                       <span className={`font-semibold text-sm ${activity.isMilestone ? 'text-indigo-800 dark:text-indigo-300' : 'text-slate-800 dark:text-slate-200'}`}>{activity.description}</span>
                                       <span className="text-xs text-slate-400">{new Date(activity.timestamp).toLocaleString()}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-line">{activity.details || `Performed by ${activity.performedBy}`}</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {activeTab === 'rules' && (
                     <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="flex items-center gap-2 mb-4">
                           <PlayCircle className="text-indigo-600 dark:text-indigo-400" size={20} />
                           <h3 className="font-bold text-slate-800 dark:text-white">Active Automations</h3>
                        </div>
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900 rounded-lg flex items-start gap-3">
                           <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400 mt-0.5" />
                           <div>
                              <div className="flex items-center gap-2">
                                 <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-300">High Value Lead Assignment</h4>
                                 <span className="text-[10px] font-bold bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 px-1.5 py-0.5 rounded">Active</span>
                              </div>
                              <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">Lead assigned to Senior Rep team based on potential value &gt; $10k.</p>
                              <p className="text-[10px] text-emerald-600 dark:text-emerald-500 mt-2">Triggered 2 days ago</p>
                           </div>
                        </div>
                        {/* SLA Info */}
                        <div className={`p-4 rounded-lg flex items-start gap-3 border ${lead.slaStatus === 'breached' ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900' : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700'}`}>
                           <Clock size={20} className={`mt-0.5 ${lead.slaStatus === 'breached' ? 'text-red-500' : 'text-slate-400'}`} />
                           <div>
                              <div className="flex items-center gap-2">
                                 <h4 className={`text-sm font-bold ${lead.slaStatus === 'breached' ? 'text-red-900 dark:text-red-300' : 'text-slate-700 dark:text-slate-300'}`}>SLA Monitor</h4>
                                 <span className="text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded">Monitoring</span>
                              </div>
                              <p className={`text-xs mt-1 ${lead.slaStatus === 'breached' ? 'text-red-700 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                 {lead.slaStatus === 'breached' 
                                   ? 'Max time in stage exceeded. Manager notified.' 
                                   : 'Monitoring time in stage. No breaches.'}
                              </p>
                           </div>
                        </div>
                     </div>
                  )}

                  {activeTab === 'json' && (
                     <div className="h-96 overflow-auto bg-slate-900 rounded-lg p-4 font-mono text-xs text-green-400 shadow-inner">
                        <pre>{JSON.stringify(lead, null, 2)}</pre>
                     </div>
                  )}
               </div>
            </div>
         </div>

         {/* Right Sidebar */}
         <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
               <h3 className="font-bold text-slate-800 dark:text-white mb-4 text-sm uppercase tracking-wide">Key Details</h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-800">
                     <span className="text-sm text-slate-500 dark:text-slate-400">Owner</span>
                     <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900 rounded-full text-[10px] flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold">AJ</div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Alice Johnson</span>
                     </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-800">
                     <span className="text-sm text-slate-500 dark:text-slate-400">Source</span>
                     <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-xs font-medium">{lead.source}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-800">
                     <span className="text-sm text-slate-500 dark:text-slate-400">Created</span>
                     <span className="text-sm text-slate-700 dark:text-slate-200">{new Date(lead.createdAt).toLocaleDateString()}</span>
                  </div>
               </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
               <h3 className="font-bold text-slate-800 dark:text-white mb-4 text-sm uppercase tracking-wide">Tags</h3>
               <div className="flex flex-wrap gap-2">
                  {lead.tags.map(tag => (
                     <span key={tag} className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-700">
                        <Tag size={12} /> {tag}
                     </span>
                  ))}
                  <button className="px-2 py-1 border border-dashed border-slate-300 dark:border-slate-600 rounded-full text-xs text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 flex items-center gap-1 transition-colors">
                     <Plus size={12} /> Add
                  </button>
               </div>
            </div>
            
            {/* AI Insight Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-xl shadow-lg text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Star size={80} />
               </div>
               <h3 className="font-bold text-sm uppercase tracking-wide opacity-80 mb-2">Nexus Insight</h3>
               <div className="mb-4">
                  <span className="text-3xl font-bold">{lead.score}</span>
                  <span className="text-sm opacity-80 ml-1">/ 100</span>
               </div>
               <p className="text-sm font-medium leading-relaxed mb-4 opacity-90">
                  Engagement is high. Based on recent email opens, this lead is likely to convert this week.
               </p>
               <button className="w-full py-2 bg-white text-indigo-600 rounded-lg text-sm font-bold hover:bg-opacity-90 transition-colors">
                  Schedule Demo
               </button>
            </div>
         </div>
      </div>

      {/* Module 4: Merge Modal */}
      {showMergeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Merge Records</h3>
              <button onClick={() => setShowMergeModal(false)} className="text-slate-400"><ArrowLeft size={20} /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-6">
                {/* Current Record */}
                <div className="border-2 border-indigo-500 rounded-xl p-4 relative bg-indigo-50/10">
                  <div className="absolute top-0 left-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg">Master Record</div>
                  <h4 className="font-bold text-lg mt-6">{lead.company}</h4>
                  <div className="space-y-2 mt-4 text-sm text-slate-600 dark:text-slate-300">
                    <p>Name: {lead.firstName} {lead.lastName}</p>
                    <p>Email: {lead.email}</p>
                    <p>ID: {lead.id}</p>
                  </div>
                </div>
                {/* Duplicate Record */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50 dark:bg-slate-900">
                   <h4 className="font-bold text-lg mt-6">{duplicates[0]?.company}</h4>
                   <div className="space-y-2 mt-4 text-sm text-slate-600 dark:text-slate-300">
                    <p>Name: {duplicates[0]?.firstName} {duplicates[0]?.lastName}</p>
                    <p>Email: {duplicates[0]?.email}</p>
                    <p>ID: {duplicates[0]?.id}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm">
                Merging will move all activities and notes from the duplicate record to the master record. The duplicate record will be deleted.
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end gap-3">
              <button onClick={() => setShowMergeModal(false)} className="px-4 py-2 text-slate-600 dark:text-slate-400">Cancel</button>
              <button 
                onClick={() => {
                  mergeLeads(lead.id, duplicates[0].id);
                  setShowMergeModal(false);
                  onBack(); // Go back to list as this record is updated
                }}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
              >
                Confirm Merge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadDetail;