import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Lead, Task, User, LeadStatus, Notification, Rule, Theme } from '../types';
import { generateLeads, generateTasks, generateNotifications, MOCK_USERS, MOCK_RULES } from '../data';

interface CRMContextType {
  leads: Lead[];
  tasks: Task[];
  users: User[];
  currentUser: User;
  notifications: Notification[];
  rules: Rule[];
  isSidebarCollapsed: boolean;
  theme: Theme;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  addLead: (lead: Lead) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  moveLeadStage: (id: string, newStage: LeadStatus) => void;
  addTask: (task: Task) => void;
  toggleTaskComplete: (id: string) => void;
  deleteTask: (id: string) => void;
  importLeads: (newLeads: Lead[]) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  toggleLeadFollow: (id: string) => void;
  addActivity: (leadId: string, activity: any) => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const CRMProvider = ({ children }: { children: ReactNode }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [rules, setRules] = useState<Rule[]>(MOCK_RULES);
  const [users] = useState<User[]>(MOCK_USERS);
  const [currentUser] = useState<User>(MOCK_USERS[0]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Initialize with data
    const initialLeads = generateLeads(35);
    setLeads(initialLeads);
    setTasks(generateTasks(initialLeads));
    setNotifications(generateNotifications());

    // Check system preference for theme
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const addLead = (lead: Lead) => {
    setLeads((prev) => [lead, ...prev]);
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  const moveLeadStage = (id: string, newStage: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          const activity = {
            id: `act-${Date.now()}`,
            type: 'stage_change' as const,
            description: `Stage changed from ${l.status} to ${newStage}`,
            timestamp: new Date().toISOString(),
            performedBy: currentUser.name,
          };
          return { ...l, status: newStage, activities: [activity, ...l.activities] };
        }
        return l;
      })
    );
  };

  const addTask = (task: Task) => {
    setTasks((prev) => [task, ...prev]);
  };

  const toggleTaskComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: t.status === 'Pending' ? 'Completed' : 'Pending' } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const importLeads = (newLeads: Lead[]) => {
    const existingEmails = new Set(leads.map(l => l.email));
    const uniqueNewLeads = newLeads.filter(l => !existingEmails.has(l.email));
    setLeads(prev => [...uniqueNewLeads, ...prev]);
    
    const notif: Notification = {
      id: `n-${Date.now()}`,
      title: 'Import Successful',
      message: `Successfully imported ${uniqueNewLeads.length} new leads.`,
      read: false,
      timestamp: new Date().toISOString(),
      type: 'system'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const toggleLeadFollow = (id: string) => {
    setLeads(prev => prev.map(l => {
      if (l.id === id) {
        const isFollowing = !l.isFollowed;
        return { ...l, isFollowed: isFollowing };
      }
      return l;
    }));
  };

  const addActivity = (leadId: string, activity: any) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return { ...l, activities: [activity, ...l.activities] };
      }
      return l;
    }));
  };

  return (
    <CRMContext.Provider
      value={{
        leads,
        tasks,
        users,
        currentUser,
        notifications,
        rules,
        isSidebarCollapsed,
        theme,
        toggleTheme,
        toggleSidebar,
        addLead,
        updateLead,
        deleteLead,
        moveLeadStage,
        addTask,
        toggleTaskComplete,
        deleteTask,
        importLeads,
        markNotificationRead,
        markAllNotificationsRead,
        toggleLeadFollow,
        addActivity
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};