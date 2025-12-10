import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Plus, 
  User as UserIcon, 
  Menu,
  ChevronDown,
  Settings,
  LogOut,
  Command,
  Sun,
  Moon,
  FileText,
  Briefcase,
  Phone
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import NewLeadWizard from './NewLeadWizard';

const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const { currentUser, notifications, markAllNotificationsRead, markNotificationRead, theme, toggleTheme } = useCRM();
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [showNewLeadWizard, setShowNewLeadWizard] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const createRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setIsNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setIsProfileOpen(false);
      if (createRef.current && !createRef.current.contains(event.target as Node)) setIsCreateOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 px-4 flex items-center justify-between shadow-sm transition-colors duration-200">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 focus:outline-none md:hidden"
          >
            <Menu size={20} />
          </button>
          
          {/* Global Search */}
          <div className="hidden md:flex items-center relative max-w-md w-96 group">
            <Search className="absolute left-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Search leads, contacts, accounts..."
              className="w-full pl-10 pr-12 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-3 hidden lg:flex items-center gap-1 text-[10px] font-medium text-slate-400 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 bg-white dark:bg-slate-800">
              <Command size={10} />
              <span>K</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Quick Add */}
          <div className="relative" ref={createRef}>
            <button 
              onClick={() => setIsCreateOpen(!isCreateOpen)}
              className="hidden sm:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm shadow-indigo-200 dark:shadow-none active:scale-95"
            >
              <Plus size={18} />
              <span className="hidden lg:inline">Create</span>
              <ChevronDown size={14} className={`opacity-80 transition-transform ${isCreateOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isCreateOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <button 
                  onClick={() => {
                    setIsCreateOpen(false);
                    setShowNewLeadWizard(true);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-3 transition-colors"
                >
                  <UserIcon size={16} /> New Lead
                </button>
                <button className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-3 transition-colors">
                  <Briefcase size={16} /> New Opportunity
                </button>
                <button className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-3 transition-colors">
                  <FileText size={16} /> New Task
                </button>
                <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
                <button className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-3 transition-colors">
                  <Phone size={16} /> Log Call
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative transition-colors"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
              )}
            </button>
            
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                  <h3 className="font-semibold text-slate-800 dark:text-white">Notifications</h3>
                  <button onClick={markAllNotificationsRead} className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium">Mark all read</button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">No notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        onClick={() => markNotificationRead(n.id)}
                        className={`px-4 py-3 border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors ${!n.read ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className={`text-sm font-medium ${!n.read ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-700 dark:text-slate-300'}`}>{n.title}</span>
                          <span className="text-[10px] text-slate-400">{new Date(n.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/80 text-center border-t border-slate-100 dark:border-slate-700">
                  <button className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">View all notifications</button>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full sm:rounded-lg transition-colors"
            >
              <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 object-cover" />
              <div className="hidden md:block text-left mr-1">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">{currentUser.name}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{currentUser.role}</p>
              </div>
              <ChevronDown size={14} className="text-slate-400 hidden md:block" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 md:hidden">
                  <p className="font-medium text-slate-800 dark:text-white">{currentUser.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{currentUser.role}</p>
                </div>
                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2">
                  <UserIcon size={16} /> Profile
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2">
                  <Settings size={16} /> Settings
                </button>
                <button 
                   onClick={() => { toggleTheme(); setIsProfileOpen(false); }}
                   className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2"
                >
                  {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />} {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </button>
                <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Wizard */}
      {showNewLeadWizard && <NewLeadWizard onClose={() => setShowNewLeadWizard(false)} />}
    </>
  );
};

export default Header;