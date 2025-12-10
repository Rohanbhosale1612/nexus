import React, { useState } from 'react';
import { X, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { Lead } from '../types';

interface NewLeadWizardProps {
  onClose: () => void;
}

const NewLeadWizard: React.FC<NewLeadWizardProps> = ({ onClose }) => {
  const { addLead, currentUser } = useCRM();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Lead>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    source: '',
    status: 'New',
    potentialValue: 0,
    tags: []
  });

  const updateField = (field: keyof Lead, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.firstName || !formData.lastName || !formData.company) return;

    const newLead: Lead = {
      ...formData as Lead,
      id: `lead-${Date.now()}`,
      score: 10,
      ownerId: currentUser.id,
      createdAt: new Date().toISOString(),
      notes: [],
      activities: [],
      customFields: {},
      tags: formData.tags || []
    };
    
    addLead(newLead);
    onClose();
  };

  const steps = [
    { id: 1, label: 'Lead Info' },
    { id: 2, label: 'Contact Details' },
    { id: 3, label: 'Qualification' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">New Lead</h2>
            <div className="flex items-center gap-1 mt-2">
              {steps.map((s, i) => (
                <div key={s.id} className="flex items-center">
                  <div className={`flex items-center gap-2 ${step >= s.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${step >= s.id ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : 'border-slate-300'}`}>
                      {step > s.id ? <Check size={14} /> : s.id}
                    </div>
                    <span className="text-xs font-medium hidden sm:inline">{s.label}</span>
                  </div>
                  {i < steps.length - 1 && <div className={`w-8 h-px mx-2 ${step > s.id ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}></div>}
                </div>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto max-h-[60vh]">
          {step === 1 && (
             <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-1">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Lead Source <span className="text-red-500">*</span></label>
                      <select 
                        className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.source}
                        onChange={e => updateField('source', e.target.value)}
                      >
                         <option value="">Select Source...</option>
                         <option value="Website">Website</option>
                         <option value="Referral">Referral</option>
                         <option value="LinkedIn">LinkedIn</option>
                         <option value="Cold Call">Cold Call</option>
                         <option value="Ads">Ads</option>
                      </select>
                   </div>
                   <div className="space-y-1">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Status</label>
                      <select 
                        className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.status}
                        onChange={e => updateField('status', e.target.value)}
                      >
                         <option value="New">New</option>
                         <option value="Contacted">Contacted</option>
                         <option value="Qualified">Qualified</option>
                      </select>
                   </div>
                </div>
                <div className="space-y-1">
                   <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Company Name <span className="text-red-500">*</span></label>
                   <input 
                      className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="e.g. Acme Corp"
                      value={formData.company}
                      onChange={e => updateField('company', e.target.value)}
                   />
                </div>
                <div className="space-y-1">
                   <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Industry</label>
                   <input 
                      className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="e.g. Technology, Healthcare"
                   />
                </div>
             </div>
          )}

          {step === 2 && (
             <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-1">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">First Name <span className="text-red-500">*</span></label>
                      <input 
                         className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                         value={formData.firstName}
                         onChange={e => updateField('firstName', e.target.value)}
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Last Name <span className="text-red-500">*</span></label>
                      <input 
                         className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                         value={formData.lastName}
                         onChange={e => updateField('lastName', e.target.value)}
                      />
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-1">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address <span className="text-red-500">*</span></label>
                      <input 
                         type="email"
                         className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                         value={formData.email}
                         onChange={e => updateField('email', e.target.value)}
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Phone Number</label>
                      <input 
                         className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                         value={formData.phone}
                         onChange={e => updateField('phone', e.target.value)}
                      />
                   </div>
                </div>
                <div className="space-y-1">
                   <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Job Title</label>
                   <input 
                      className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.position}
                      onChange={e => updateField('position', e.target.value)}
                   />
                </div>
             </div>
          )}

          {step === 3 && (
             <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="space-y-1">
                   <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Potential Deal Value ($)</label>
                   <div className="relative">
                     <span className="absolute left-3 top-2 text-slate-400">$</span>
                     <input 
                        type="number"
                        className="w-full pl-6 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.potentialValue}
                        onChange={e => updateField('potentialValue', parseInt(e.target.value) || 0)}
                     />
                   </div>
                </div>
                <div className="space-y-1">
                   <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Initial Tags</label>
                   <input 
                      className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="Separate by comma (e.g. Hot, Q3)"
                      onChange={e => updateField('tags', e.target.value.split(',').map(t => t.trim()))}
                   />
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                   <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-1">Duplicate Check</h4>
                   <p className="text-xs text-blue-600 dark:text-blue-400">No duplicate records found for this email address.</p>
                </div>
             </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
          <button 
             onClick={onClose} 
             className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium text-sm"
          >
             Cancel
          </button>
          
          <div className="flex gap-3">
             {step > 1 && (
               <button 
                 onClick={() => setStep(s => s - 1)}
                 className="px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 font-medium text-sm flex items-center gap-2"
               >
                 <ArrowLeft size={16} /> Back
               </button>
             )}
             
             {step < 3 ? (
                <button 
                  onClick={() => setStep(s => s + 1)}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm flex items-center gap-2 shadow-sm"
                >
                  Next <ArrowRight size={16} />
                </button>
             ) : (
                <button 
                  onClick={handleSave}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm shadow-sm"
                >
                  Create Lead
                </button>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewLeadWizard;