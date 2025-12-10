import { Lead, Task, User, LeadStatus, PIPELINE_STAGES, Notification, Rule } from './types';

const FIRST_NAMES = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
const COMPANIES = ['Acme Corp', 'Globex', 'Soylent Corp', 'Initech', 'Umbrella Corp', 'Stark Ind', 'Wayne Ent', 'Cyberdyne'];
const SOURCES = ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Conference', 'Ads'];
const POSITIONS = ['CEO', 'CTO', 'VP Sales', 'Director', 'Manager', 'Developer'];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alice Johnson', role: 'Admin', email: 'alice@nexus.com', avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson&background=6366f1&color=fff' },
  { id: 'u2', name: 'Bob Smith', role: 'Sales Rep', email: 'bob@nexus.com', avatar: 'https://ui-avatars.com/api/?name=Bob+Smith&background=22c55e&color=fff' },
  { id: 'u3', name: 'Charlie Davis', role: 'Sales Rep', email: 'charlie@nexus.com', avatar: 'https://ui-avatars.com/api/?name=Charlie+Davis&background=eab308&color=fff' },
  { id: 'u4', name: 'Diana Prince', role: 'Manager', email: 'diana@nexus.com', avatar: 'https://ui-avatars.com/api/?name=Diana+Prince&background=ec4899&color=fff' },
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export const generateLeads = (count: number): Lead[] => {
  return Array.from({ length: count }).map((_, i) => {
    const firstName = getRandomItem(FIRST_NAMES);
    const lastName = getRandomItem(LAST_NAMES);
    const status = getRandomItem(PIPELINE_STAGES).id as LeadStatus;
    const isHot = Math.random() > 0.8;
    
    return {
      id: `lead-${i + 1}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: `(555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      company: getRandomItem(COMPANIES),
      position: getRandomItem(POSITIONS),
      source: getRandomItem(SOURCES),
      status,
      score: Math.floor(Math.random() * 100),
      ownerId: getRandomItem(MOCK_USERS).id,
      createdAt: randomDate(new Date(2023, 0, 1), new Date()).toISOString(),
      potentialValue: Math.floor(Math.random() * 50000) + 1000,
      tags: isHot ? ['Hot', 'Tech'] : ['Warm'],
      notes: [],
      activities: [
        {
          id: `act-${i}`,
          type: 'stage_change',
          description: `Moved to ${status}`,
          timestamp: new Date().toISOString(),
          performedBy: 'System'
        }
      ],
      customFields: {},
      address: {
        street: '123 Business Rd',
        city: 'Tech City',
        state: 'CA',
        zip: '94000',
        country: 'USA'
      },
      isFollowed: Math.random() > 0.8
    };
  });
};

export const generateTasks = (leads: Lead[]): Task[] => {
  return leads.slice(0, 10).map((lead, i) => ({
    id: `task-${i}`,
    title: i % 2 === 0 ? `Follow up with ${lead.firstName}` : `Send proposal to ${lead.company}`,
    dueDate: randomDate(new Date(), new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)).toISOString(),
    priority: Math.random() > 0.5 ? 'High' : 'Medium',
    status: Math.random() > 0.7 ? 'Completed' : 'Pending',
    leadId: lead.id,
    assignedTo: lead.ownerId
  }));
};

export const generateNotifications = (): Notification[] => [
  {
    id: 'n1',
    title: 'Lead Assignment',
    message: 'New lead "Acme Corp" has been assigned to you.',
    read: false,
    timestamp: new Date().toISOString(),
    type: 'system'
  },
  {
    id: 'n2',
    title: 'Mentioned in Note',
    message: 'Alice mentioned you in a note on "Globex Deal"',
    read: true,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    type: 'mention'
  },
  {
    id: 'n3',
    title: 'High Value Alert',
    message: 'Stark Ind deal value increased to $50,000',
    read: false,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    type: 'alert'
  }
];

export const MOCK_RULES: Rule[] = [
  {
    id: 'r1',
    name: 'High Value Lead Assignment',
    active: true,
    description: 'Assign leads with value > 10k to Senior Reps',
    version: 1,
    lastModified: new Date().toISOString(),
    conditionsJson: '{"condition": "AND", "rules": [{"field": "potentialValue", "operator": "greater", "value": 10000}]}'
  },
  {
    id: 'r2',
    name: 'Stale Lead Alert',
    active: false,
    description: 'Notify manager if lead is in "New" for > 3 days',
    version: 2,
    lastModified: new Date(Date.now() - 86400000).toISOString(),
    conditionsJson: '{"condition": "AND", "rules": [{"field": "status", "operator": "equal", "value": "New"}, {"field": "daysInStage", "operator": "greater", "value": 3}]}'
  }
];