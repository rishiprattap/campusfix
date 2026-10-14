export type UserRole = 'student' | 'admin' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
  department?: string;
  avatar?: string;
  phone?: string;
  createdAt: string;
}

export type ComplaintCategory =
  | 'Infrastructure'
  | 'Electrical'
  | 'Plumbing'
  | 'Network & Wi-Fi'
  | 'Sanitation & Cleanliness'
  | 'Hostel & Housing'
  | 'Cafeteria & Food'
  | 'Security & Safety'
  | 'Classroom & Labs';

export type ComplaintPriority = 'low' | 'medium' | 'high' | 'urgent';

export type ComplaintStatus =
  | 'submitted'
  | 'under_review'
  | 'in_progress'
  | 'resolved'
  | 'closed';

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  status: ComplaintStatus;
}

export interface ComplaintComment {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  text: string;
  timestamp: string;
  isInternal?: boolean;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  building: string;
  room: string;
  submittedBy: {
    id: string;
    name: string;
    email: string;
    studentId?: string;
    department?: string;
    isAnonymous?: boolean;
  };
  assignedTo?: {
    id: string;
    name: string;
    department: string;
    phone?: string;
  };
  images: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolutionNotes?: string;
  resolutionImage?: string;
  rating?: number;
  ratingFeedback?: string;
  upvotes: number;
  upvotedBy: string[];
  timeline: TimelineEvent[];
  comments: ComplaintComment[];
}

export interface CampusNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  complaintId?: string;
  read: boolean;
  timestamp: string;
  type: 'status_change' | 'comment' | 'assigned' | 'system';
}

export interface CampusBuilding {
  name: string;
  code: string;
  zone: string;
  commonAreas: string[];
}
