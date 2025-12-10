import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Calendar, CheckCircle2, Circle, Clock, Plus, Filter, ArrowUpRight, Users } from 'lucide-react';

const Tasks = () => {
  const { tasks, toggleTaskComplete, addTask, leads, users } = useCRM();
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Completed' | 'Overdue'>('All');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');

  const filteredTasks = tasks.filter(t => {
     // Status Filter
     let matchesStatus = true;
     if (filter === 'Pending') matchesStatus = t.status === 'Pending';
     else if (filter === 'Completed') matchesStatus = t.status === 'Completed';
     else if (filter === 'Overdue') matchesStatus = t.status === 'Pending' && new Date(t.dueDate) < new Date();
     
     // Assignee Filter
     const matchesAssignee = assigneeFilter === 'All' || t.assignedTo === assigneeFilter;

     return matchesStatus && matchesAssignee;
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if(newTaskTitle) {
       addTask({
          id: `task-${Date.now()}`,
          title: newTaskTitle,
          status: 'Pending',
          priority: 'Medium',
          dueDate: new Date().toISOString(),
          assignedTo: newTaskAssignee || users[0]?.id || 'u1'
       });
       setNewTaskTitle('');
       setNewTaskAssignee('');
       setIsModalOpen(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Tasks & Activities</h1>
           <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your daily actions and follow-ups.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 shadow-sm transition-colors">
           <Plus size={16} /> New Task
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Status Tabs */}
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit overflow-x-auto max-w-full">
           {['All', 'Pending', 'Overdue', 'Completed'].map(f => (
              <button 
                 key={f}
                 onClick={() => setFilter(f as any)}
                 className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                    filter === f 
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                 }`}
              >
                 {f}
              </button>
           ))}
        </div>

        {/* Assignee Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
           <Users size={16} className="text-slate-400 hidden sm:block" />
           <select 
              className="w-full sm:w-auto bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
           >
              <option value="All">All Team Members</option>
              {users.map(u => (
                 <option key={u.id} value={u.id}>{u.name}</option>
              ))}
           </select>
        </div>
      </div>

      <div className="space-y-3">
         {filteredTasks.map(task => {
            const lead = leads.find(l => l.id === task.leadId);
            const assignee = users.find(u => u.id === task.assignedTo);
            const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Completed';
            
            return (
               <div key={task.id} className={`bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-start sm:items-center gap-4 group transition-all hover:border-indigo-300 dark:hover:border-slate-600 ${task.status === 'Completed' ? 'opacity-60 bg-slate-50 dark:bg-slate-900/50' : ''}`}>
                  <button 
                     onClick={() => toggleTaskComplete(task.id)}
                     className={`flex-shrink-0 mt-1 sm:mt-0 transition-colors ${task.status === 'Completed' ? 'text-green-500' : 'text-slate-300 dark:text-slate-600 hover:text-indigo-500'}`}
                  >
                     {task.status === 'Completed' ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                     <p className={`font-medium text-slate-800 dark:text-slate-200 truncate pr-4 ${task.status === 'Completed' ? 'line-through decoration-slate-400' : ''}`}>
                        {task.title}
                     </p>
                     <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {lead && (
                           <span className="flex items-center gap-1 hover:text-indigo-500 cursor-pointer whitespace-nowrap">
                              Related to: <span className="font-semibold">{lead.company}</span>
                              <ArrowUpRight size={10} />
                           </span>
                        )}
                        <span className={`flex items-center gap-1 whitespace-nowrap ${isOverdue ? 'text-red-500 font-medium' : ''}`}>
                           <Calendar size={12} /> {new Date(task.dueDate).toLocaleDateString()} {isOverdue && '(Overdue)'}
                        </span>
                        
                        {assignee && (
                           <div className="flex items-center gap-1.5 whitespace-nowrap">
                              <div className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-[8px] font-bold text-indigo-700 dark:text-indigo-300">
                                 {assignee.name.charAt(0)}
                              </div>
                              <span>{assignee.name}</span>
                           </div>
                        )}

                        <span className={`px-1.5 py-0.5 rounded border ${
                           task.priority === 'High' 
                           ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800' 
                           : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}>
                           {task.priority}
                        </span>
                     </div>
                  </div>
               </div>
            );
         })}
         
         {filteredTasks.length === 0 && (
            <div className="text-center py-16 text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
               <CheckCircle2 size={48} className="mx-auto mb-4 opacity-20" />
               <p className="font-medium">No tasks found</p>
               <p className="text-sm mt-1">Try adjusting your filters or create a new task.</p>
            </div>
         )}
      </div>

      {isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
               <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">Create New Task</h3>
               <form onSubmit={handleAddTask}>
                  <div className="space-y-4">
                     <div>
                        <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1 block">Subject <span className="text-red-500">*</span></label>
                        <input 
                           autoFocus
                           type="text" 
                           className="w-full border border-slate-300 dark:border-slate-700 p-2.5 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                           placeholder="e.g. Follow up with client"
                           value={newTaskTitle}
                           onChange={e => setNewTaskTitle(e.target.value)}
                        />
                     </div>
                     <div>
                        <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1 block">Assign To</label>
                        <select 
                           className="w-full border border-slate-300 dark:border-slate-700 p-2.5 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                           value={newTaskAssignee}
                           onChange={e => setNewTaskAssignee(e.target.value)}
                        >
                           <option value="">Select Team Member...</option>
                           {users.map(u => (
                              <option key={u.id} value={u.id}>{u.name}</option>
                           ))}
                        </select>
                     </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                     <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium text-sm">Cancel</button>
                     <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm shadow-sm">Add Task</button>
                  </div>
               </form>
            </div>
         </div>
      )}
    </div>
  );
};

export default Tasks;