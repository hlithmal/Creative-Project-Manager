export enum ProjectStatus {
  NOT_STARTED = 'Not Started',
  IN_PROGRESS = 'In Progress',
  REVIEW = 'Review',
  COMPLETED = 'Completed',
  ON_HOLD = 'On Hold'
}

export enum ClientStatus {
  ACTIVE = 'Active',
  PROSPECTIVE = 'Prospective',
  ON_HOLD = 'On Hold',
  PAST = 'Past',
  ARCHIVED = 'Archived'
}

export interface FolderNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: FolderNode[];
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  avatar: string;
  type: 'Individual' | 'Small Business' | 'Agency' | 'Corporation';
  status: ClientStatus;
  rating: number;
  tags: string[];
  address: string;
  city: string;
  country: string;
  totalRevenue: number;
  currency: string;
  joinedDate: string;
  industry: string;
  website: string;
  notes: string;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  category: 'Design' | 'Video' | 'Social' | 'Other';
  structure: FolderNode[];
}

export interface Project {
  id: string;
  name: string;
  client: Client;
  status: ProjectStatus;
  deadline: string;
  progress: number;
  type: string;
  tags: string[];
  thumbnail: string;
  folderStructure: FolderNode[];
  createdAt: string;
  timeSpentSeconds: number;
}

export interface TimeEntry {
  id: string;
  projectId: string;
  description: string;
  startTime: string;
  endTime?: string;
  durationSeconds: number;
}

export interface Notification {
  id: string;
  category: 'project' | 'client' | 'system' | 'time' | 'collab';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'critical' | 'high' | 'normal' | 'low';
}
