export type Role = 'Admin' | 'Manager' | 'Sales Rep' | 'Viewer';
export type Theme = 'light' | 'dark';

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar: string;
  email: string;
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';

export interface Note {
  id: string;
  text: string;
  createdAt: string;
  authorId: string;
}

export interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'stage_change' | 'task';
  description: string;
  timestamp: string;
  performedBy: string;
  details?: string;
}

export interface CustomField {
  id: string;
  label: string;
  value: string | number | boolean;
  type: 'text' | 'number' | 'date' | 'boolean';
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  source: string;
  status: LeadStatus;
  score: number;
  ownerId: string;
  createdAt: string;
  lastContacted?: string;
  potentialValue: number;
  tags: string[];
  notes: Note[];
  activities: Activity[];
  customFields: Record<string, any>;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  isFollowed?: boolean;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'Completed';
  leadId?: string;
  assignedTo: string;
  description?: string;
}

export interface PipelineStage {
  id: LeadStatus;
  name: string;
  color: string;
  order: number;
}

export const PIPELINE_STAGES: PipelineStage[] = [
  { id: 'New', name: 'New Lead', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200', order: 1 },
  { id: 'Contacted', name: 'Contacted', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200', order: 2 },
  { id: 'Qualified', name: 'Qualified', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200', order: 3 },
  { id: 'Proposal', name: 'Proposal', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200', order: 4 },
  { id: 'Negotiation', name: 'Negotiation', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200', order: 5 },
  { id: 'Closed Won', name: 'Closed Won', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200', order: 6 },
  { id: 'Closed Lost', name: 'Closed Lost', color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200', order: 7 },
];

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  type: 'mention' | 'system' | 'alert';
}

export interface Rule {
  id: string;
  name: string;
  active: boolean;
  description?: string;
  lastModified: string;
  version: number;
  conditionsJson: string;
}