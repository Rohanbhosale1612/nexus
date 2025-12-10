import React, { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, ArrowRight, X } from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { Lead } from '../types';

interface ImportWizardProps {
  onClose: () => void;
}

const ImportWizard: React.FC<ImportWizardProps> = ({ onClose }) => {
  const { importLeads } = useCRM();
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Mock mapping state
  const [mappings, setMappings] = useState({
    'Full Name': 'firstName',
    'Email Address': 'email',
    'Company Name': 'company',
    'Phone': 'phone'
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleImport = () => {
    // Mock import logic
    const mockLeads: Lead[] = [
      {
         id: `imp-${Date.now()}-1`,
         firstName: 'Imported',
         lastName: 'Lead 1',
         email: 'lead1@imported.com',
         company: 'Imported Corp',
         position: 'Manager',
         status: 'New',
         score: 10,
         ownerId: 'u1',
         createdAt: new Date().toISOString(),
         potentialValue: 5000,
         tags: ['Imported'],
         notes: [],
         activities: [],
         customFields: {},
         source: 'Import',
         phone: '555-0101'
      },
      {
         id: `imp-${Date.now()}-2`,
         firstName: 'Imported',
         lastName: 'Lead 2',
         email: 'lead2@imported.com',
         company: 'Global Import',
         position: 'Director',
         status: 'New',
         score: 20,
         ownerId: 'u1',
         createdAt: new Date().toISOString(),
         potentialValue: 12000,
         tags: ['Imported'],
         notes: [],
         activities: [],
         customFields: {},
         source: 'Import',
         phone: '555-0102'
      }
    ];
    importLeads(mockLeads);
    setStep(4); // Success step
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Import Leads</h2>
            <div className="flex items-center gap-2 mt-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-2">
                   <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= i ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                      {step > i ? <CheckCircle2 size={14} /> : i}
                   </div>
                   {i < 3 && <div className={`w-8 h-0.5 ${step > i ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}></div>}
                </div>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><X size={20} /></button>
        </div>

        {/* Content */}
        <div className="p-8 min-h-[300px]">
          {step === 1 && (
            <div className="space-y-6">
              <div 
                className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all
                  ${isDragging ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}
                `}
                onDragOver={handleDragOver}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                 <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-full mb-4">
                    <Upload className="text-indigo-600 dark:text-indigo-400" size={32} />
                 </div>
                 {file ? (
                    <div>
                       <p className="font-medium text-slate-800 dark:text-white">{file.name}</p>
                       <p className="text-sm text-slate-500 dark:text-slate-400">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                 ) : (
                    <div>
                       <p className="font-medium text-slate-800 dark:text-white mb-1">Click to upload or drag and drop</p>
                       <p className="text-sm text-slate-500 dark:text-slate-400">CSV or Excel files (max 5MB)</p>
                    </div>
                 )}
                 <input id="file-upload" type="file" className="hidden" accept=".csv,.xlsx" onChange={e => e.target.files && setFile(e.target.files[0])} />
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm">
                 <FileSpreadsheet size={20} />
                 <span>Download sample template to ensure correct formatting.</span>
                 <a href="#" className="font-bold underline ml-auto">Download</a>
              </div>
            </div>
          )}

          {step === 2 && (
             <div className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Map the columns from your CSV to CRM fields.</p>
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                   <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-300">
                         <tr>
                            <th className="px-4 py-3">CSV Column</th>
                            <th className="px-4 py-3">Sample Data</th>
                            <th className="px-4 py-3">CRM Field</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                         {Object.entries(mappings).map(([csvCol, crmField]) => (
                            <tr key={csvCol}>
                               <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{csvCol}</td>
                               <td className="px-4 py-3 text-slate-500 dark:text-slate-400 italic">Sample Value</td>
                               <td className="px-4 py-3">
                                  <select 
                                    className="border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={crmField}
                                    onChange={() => {}} // dummy
                                  >
                                     <option value="firstName">First Name</option>
                                     <option value="lastName">Last Name</option>
                                     <option value="email">Email</option>
                                     <option value="company">Company</option>
                                     <option value="phone">Phone</option>
                                  </select>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          )}

          {step === 3 && (
             <div className="space-y-6 text-center">
                <div className="flex justify-center">
                   <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                      <CheckCircle2 size={32} />
                   </div>
                </div>
                <div>
                   <h3 className="text-lg font-bold text-slate-800 dark:text-white">Ready to Import</h3>
                   <p className="text-slate-600 dark:text-slate-400 mt-2">We found <span className="font-bold">2</span> valid records.</p>
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg text-left flex items-start gap-3">
                   <AlertTriangle className="text-yellow-600 dark:text-yellow-400 mt-0.5" size={18} />
                   <div>
                      <p className="font-bold text-sm text-yellow-800 dark:text-yellow-300">Duplicates Detected</p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">0 duplicates found. No records will be skipped.</p>
                   </div>
                </div>
             </div>
          )}

          {step === 4 && (
             <div className="space-y-6 text-center py-8">
                <div className="flex justify-center">
                   <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg animate-in zoom-in duration-300">
                      <CheckCircle2 size={40} />
                   </div>
                </div>
                <div>
                   <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Import Complete!</h3>
                   <p className="text-slate-600 dark:text-slate-400 mt-2">Your leads have been added to the database.</p>
                </div>
             </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
           {step < 4 ? (
              <>
                 <button onClick={onClose} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium">Cancel</button>
                 <div className="flex gap-3">
                    {step > 1 && <button onClick={() => setStep(s => s - 1)} className="px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">Back</button>}
                    <button 
                       disabled={step === 1 && !file}
                       onClick={() => {
                          if (step === 3) handleImport();
                          else setStep(s => s + 1);
                       }} 
                       className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-sm shadow-indigo-200 dark:shadow-none"
                    >
                       {step === 3 ? 'Start Import' : 'Next Step'} <ArrowRight size={16} />
                    </button>
                 </div>
              </>
           ) : (
              <button onClick={onClose} className="w-full px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">View Leads</button>
           )}
        </div>
      </div>
    </div>
  );
};

export default ImportWizard;