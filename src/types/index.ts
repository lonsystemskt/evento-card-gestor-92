
export interface Event {
  id: string;
  name: string;
  logo?: string;
  date: Date;
  isArchived: boolean;
  isPriority: boolean;
  priorityOrder?: number;
  createdAt: Date;
}

export interface Demand {
  id: string;
  eventId: string;
  title: string;
  subject: string;
  date: Date;
  isCompleted: boolean;
  isArchived: boolean;
  createdAt: Date;
}

export interface CRMContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  priorityDate: Date;
  createdAt: Date;
}

export interface Note {
  id: string;
  subject: string;
  priorityDate: Date;
  owner: 'Thiago' | 'Kalil';
  createdAt: Date;
}

export type DemandStatus = 'overdue' | 'current' | 'upcoming';

export interface EventFormData {
  name: string;
  logo?: File;
  date: Date;
}

export interface DemandFormData {
  title: string;
  subject: string;
  date: Date;
}

export interface CRMFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  priorityDate: Date;
}

export interface NoteFormData {
  subject: string;
  priorityDate: Date;
  owner: 'Thiago' | 'Kalil';
}
