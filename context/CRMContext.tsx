import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Lead, Task, User, LeadStatus, Notification, Rule, Theme, SLAConfig, RoutingRule, PIPELINE_STAGES, Activity } from '../types';
import { generateLeads, generateTasks, generateNotifications, MOCK_USERS, MOCK_RULES, MOCK_SLAS, MOCK_ROUTING } from '../data';

interface CRMContextType {
  leads: Lead[];
  tasks: Task[];
  users: User[];
  currentUser: User;
  notifications: Notification[];
  rules: Rule[];
  slas: SLAConfig[];
  routingRules: RoutingRule[];
  isSidebarCollapsed: boolean;
  theme: Theme;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  addLead: (lead: Lead) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  moveLeadStage: (id: string, newStage: LeadStatus) => { success: boolean; missingFields?: string[] };
  addTask: (task: Task) => void;
  toggleTaskComplete: (id: string) => void;
  deleteTask: (id: string) => void;
  importLeads: (newLeads: Lead[]) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  toggleLeadFollow: (id: string) => void;
  addActivity: (leadId: string, activity: any) => void;
  findDuplicates: (lead: Lead) => Lead[];
  mergeLeads: (primaryId: string, duplicateId: string) => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const CRMProvider = ({ children }: { children: ReactNode }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [rules, setRules] = useState<Rule[]>(MOCK_RULES);
  const [slas, setSlas] = useState<SLAConfig[]>(MOCK_SLAS);
  const [routingRules, setRoutingRules] = useState<RoutingRule[]>(MOCK_ROUTING);
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

  // Module 3: SLA Engine Simulator
  // Checks periodically for leads exceeding stage time limits
  useEffect(() => {
    const checkSLAs = () => {
      setLeads(currentLeads => currentLeads.map(lead => {
        const stageSLA = slas.find(sla => sla.stage === lead.status);
        if (!stageSLA) return lead;

        // Mock calculation: Assume lead created date is entry date for demo
        const entryTime = new Date(lead.createdAt).getTime();
        const now = new Date().getTime();
        const hoursInStage = (now - entryTime) / (1000 * 60 * 60);

        if (hoursInStage > stageSLA.maxTimeInStageHours) {
          if (lead.slaStatus !== 'breached') {
            // Create notification if new breach
             setNotifications(prev => [
              {
                id: `n-${Date.now()}`,
                title: 'SLA Breach Detected',
                message: `Lead ${lead.company} exceeded time in ${lead.status}`,
                read: false,
                timestamp: new Date().toISOString(),
                type: 'alert'
              },
              ...prev
            ]);
          }
          return { ...lead, slaStatus: 'breached' };
        } else if (hoursInStage > stageSLA.maxTimeInStageHours * 0.8) {
          return { ...lead, slaStatus: 'warning' };
        }
        return { ...lead, slaStatus: 'ok' };
      }));
    };

    const interval = setInterval(checkSLAs, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [slas]);

  const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const addLead = (lead: Lead) => {
    // Module 2: Smart Routing Hook
    // Simple mock round robin assignment
    const nextUser = users[Math.floor(Math.random() * users.length)];
    const routedLead = { ...lead, ownerId: nextUser.id };
    
    setLeads((prev) => [routedLead, ...prev]);
    
    setNotifications(prev => [{
      id: `n-${Date.now()}`,
      title: 'New Lead Routed',
      message: `${lead.company} assigned to ${nextUser.name} via ${routingRules[0].name}`,
      read: false,
      timestamp: new Date().toISOString(),
      type: 'system'
    }, ...prev]);
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  // Module 5: Dynamic Stage Requirements
  const moveLeadStage = (id: string, newStage: LeadStatus) => {
    const lead = leads.find(l => l.id === id);
    if (!lead) return { success: false };

    // Find previous stage config to check exit criteria
    const currentStageConfig = PIPELINE_STAGES.find(s => s.id === lead.status);
    
    // Check validation rules
    if (currentStageConfig?.exitCriteria) {
      const missingFields = currentStageConfig.exitCriteria.filter(field => {
        // Simple check if field exists on top level or address
        if (field === 'email' && !lead.email) return true;
        if (field === 'phone' && !lead.phone) return true;
        if (field === 'company' && !lead.company) return true;
        if (field === 'potentialValue' && !lead.potentialValue) return true;
        return false;
      });

      if (missingFields.length > 0) {
        return { success: false, missingFields };
      }
    }

    // If valid, proceed
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          const activity: Activity = {
            id: `act-${Date.now()}`,
            type: 'stage_change',
            description: `Stage changed from ${l.status} to ${newStage}`,
            timestamp: new Date().toISOString(),
            performedBy: currentUser.name,
            isMilestone: true
          };
          return { ...l, status: newStage, activities: [activity, ...l.activities], slaStatus: 'ok' }; // Reset SLA on move
        }
        return l;
      })
    );
    return { success: true };
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
    // Module 4: Dedupe on Import
    const existingEmails = new Set(leads.map(l => l.email));
    const uniqueNewLeads = newLeads.filter(l => !existingEmails.has(l.email));
    setLeads(prev => [...uniqueNewLeads, ...prev]);
    
    const notif: Notification = {
      id: `n-${Date.now()}`,
      title: 'Import Successful',
      message: `Successfully imported ${uniqueNewLeads.length} new leads. ${newLeads.length - uniqueNewLeads.length} duplicates skipped.`,
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

  // Module 4: Fuzzy Duplicate Detection
  const findDuplicates = (lead: Lead): Lead[] => {
    return leads.filter(l => {
      if (l.id === lead.id) return false;
      
      let score = 0;
      // Exact email match
      if (l.email.toLowerCase() === lead.email.toLowerCase()) score += 50;
      // Exact phone match
      if (l.phone === lead.phone) score += 40;
      // Fuzzy company match (simple includes check for demo)
      if (l.company.toLowerCase().includes(lead.company.toLowerCase()) || lead.company.toLowerCase().includes(l.company.toLowerCase())) score += 20;
      
      return score >= 50;
    });
  };

  const mergeLeads = (primaryId: string, duplicateId: string) => {
    const duplicate = leads.find(l => l.id === duplicateId);
    if (!duplicate) return;

    setLeads(prev => {
      const primary = prev.find(l => l.id === primaryId);
      if (!primary) return prev;

      const mergedActivities = [
        ...primary.activities,
        ...duplicate.activities,
        {
          id: `merge-${Date.now()}`,
          type: 'merge',
          description: `Merged with duplicate ${duplicate.firstName} ${duplicate.lastName}`,
          timestamp: new Date().toISOString(),
          performedBy: currentUser.name,
          details: `Merged record ID: ${duplicateId}`
        } as Activity
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      // Update primary and remove duplicate
      return prev.map(l => {
        if (l.id === primaryId) {
          return { ...l, activities: mergedActivities };
        }
        return l;
      }).filter(l => l.id !== duplicateId);
    });

    setNotifications(prev => [{
      id: `n-${Date.now()}`,
      title: 'Leads Merged',
      message: `Successfully merged records for ${duplicate?.company}`,
      read: false,
      timestamp: new Date().toISOString(),
      type: 'system'
    }, ...prev]);
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
        slas,
        routingRules,
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
        addActivity,
        findDuplicates,
        mergeLeads
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