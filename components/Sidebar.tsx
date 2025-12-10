import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  Settings, 
  Zap,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Layers
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';

interface SidebarProps {
  activePage: string;
  setPage: (page: string) => void;
  isOpen: boolean; // Mobile open state
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setPage, isOpen, setIsOpen }) => {
  const { isSidebarCollapsed, toggleSidebar } = useCRM();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'automation', label: 'Automation', icon: Zap },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar Content */}
      <aside 
        className={`fixed md:sticky top-0 left-0 h-screen bg-slate-900 dark:bg-slate-950 text-white flex flex-col transition-all duration-300 z-50 shadow-xl md:shadow-none border-r border-slate-800
          ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'} 
          ${isSidebarCollapsed ? 'md:w-20' : 'md:w-64'}
        `}
      >
        <div className={`h-16 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between px-6'} border-b border-slate-800`}>
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight animate-in fade-in duration-300 text-indigo-400">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white">
                <Layers size={20} />
              </div>
              <span className="text-white">Nexus</span>
            </div>
          )}
          {isSidebarCollapsed && (
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
               <span className="text-lg">N</span>
             </div>
          )}
          
          <button 
            onClick={() => setIsOpen(false)} 
            className="md:hidden text-slate-400 hover:text-white"
          >
            <ChevronLeft />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <li key={item.id} className="relative group">
                  <button
                    onClick={() => {
                      setPage(item.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group
                      ${isActive 
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                  >
                    <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors'} />
                    {!isSidebarCollapsed && <span className="font-medium tracking-wide text-sm">{item.label}</span>}
                  </button>
                  
                  {/* Tooltip for Collapsed State */}
                  {isSidebarCollapsed && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-slate-700 shadow-xl">
                      {item.label}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-800 flex flex-col gap-2">
           {/* Collapse Toggle (Desktop only) */}
          <button 
             onClick={toggleSidebar}
             className="hidden md:flex items-center justify-center w-full p-2 text-slate-500 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
          >
             {isSidebarCollapsed ? <ChevronRight size={20} /> : <div className="flex items-center gap-2"><ChevronLeft size={20} /><span className="text-xs uppercase font-semibold tracking-wider">Collapse</span></div>}
          </button>
          
          <button className={`flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white transition-colors w-full rounded-lg hover:bg-slate-800 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
            <LogOut size={20} />
            {!isSidebarCollapsed && <span className="text-sm">Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;