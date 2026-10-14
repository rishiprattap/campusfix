import React, { createContext, useContext, useState, useEffect } from 'react';
import { Complaint, ComplaintPriority, ComplaintStatus, CampusNotification, TimelineEvent, ComplaintComment } from '../types';
import { INITIAL_COMPLAINTS } from '../data/mockData';
import { useAuth } from './AuthContext';

interface ComplaintContextType {
  complaints: Complaint[];
  notifications: CampusNotification[];
  unreadNotificationCount: number;
  createComplaint: (data: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'timeline' | 'comments' | 'upvotes' | 'upvotedBy'>) => Complaint;
  updateStatus: (id: string, newStatus: ComplaintStatus, notes?: string, resolutionImage?: string) => void;
  updatePriority: (id: string, newPriority: ComplaintPriority) => void;
  assignComplaint: (id: string, staff: { id: string; name: string; department: string; phone?: string }) => void;
  addComment: (complaintId: string, text: string, isInternal?: boolean) => void;
  toggleUpvote: (complaintId: string) => void;
  rateComplaint: (complaintId: string, rating: number, feedback: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  getComplaintById: (id: string) => Complaint | undefined;
  resetToDefaultData: () => void;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

const COMPLAINTS_KEY = 'campusfix_complaints_v1';
const NOTIFICATIONS_KEY = 'campusfix_notifications_v1';

export const ComplaintProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    try {
      const saved = localStorage.getItem(COMPLAINTS_KEY);
      if (saved) return JSON.parse(saved);
      return INITIAL_COMPLAINTS;
    } catch {
      return INITIAL_COMPLAINTS;
    }
  });

  const [notifications, setNotifications] = useState<CampusNotification[]>(() => {
    try {
      const saved = localStorage.getItem(NOTIFICATIONS_KEY);
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'notif-1',
          userId: 'user-sarah-chen',
          title: 'Work In Progress: Pipe Leak',
          message: 'David Miller was dispatched to Science Hall Lab 304 for repair.',
          complaintId: 'CF-2026-101',
          read: false,
          timestamp: '2026-10-12T10:00:00Z',
          type: 'status_change'
        },
        {
          id: 'notif-2',
          userId: 'user-sarah-chen',
          title: 'Resolution Confirmed: Dining Hall B',
          message: 'Your sanitation report has been marked as Resolved. Please leave your rating.',
          complaintId: 'CF-2026-105',
          read: false,
          timestamp: '2026-10-10T14:45:00Z',
          type: 'status_change'
        }
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notif: Omit<CampusNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: CampusNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const createComplaint = (data: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'timeline' | 'comments' | 'upvotes' | 'upvotedBy'>): Complaint => {
    const now = new Date().toISOString();
    const newId = `CF-${new Date().getFullYear()}-${Math.floor(100 + complaints.length + 1)}`;

    const initialTimeline: TimelineEvent = {
      id: `tl-${newId}-1`,
      title: 'Complaint Submitted',
      description: 'Report successfully logged into CampusFix database.',
      timestamp: now,
      actor: data.submittedBy.name,
      actorRole: user?.role === 'admin' ? 'Administrator' : 'Student',
      status: 'submitted'
    };

    const newComplaint: Complaint = {
      ...data,
      id: newId,
      status: 'submitted',
      createdAt: now,
      updatedAt: now,
      upvotes: 0,
      upvotedBy: [],
      timeline: [initialTimeline],
      comments: []
    };

    setComplaints(prev => [newComplaint, ...prev]);

    // Add confirmation notification
    addNotification({
      userId: data.submittedBy.id,
      title: `Complaint #${newId} Received`,
      message: `Your issue regarding "${data.title}" was routed to Campus Operations.`,
      complaintId: newId,
      type: 'system'
    });

    return newComplaint;
  };

  const updateStatus = (id: string, newStatus: ComplaintStatus, notes?: string, resolutionImage?: string) => {
    const now = new Date().toISOString();
    setComplaints(prev =>
      prev.map(c => {
        if (c.id !== id) return c;

        const statusTitles: Record<ComplaintStatus, string> = {
          submitted: 'Complaint Re-opened',
          under_review: 'Under Administrative Review',
          in_progress: 'Maintenance In Progress',
          resolved: 'Issue Resolved & Verified',
          closed: 'Complaint Closed'
        };

        const newTimelineEvent: TimelineEvent = {
          id: `tl-${id}-${Date.now()}`,
          title: statusTitles[newStatus],
          description: notes || `Status changed to ${newStatus.replace('_', ' ')}.`,
          timestamp: now,
          actor: user?.name || 'Operations Desk',
          actorRole: user?.role === 'admin' ? 'Administrator' : user?.role === 'staff' ? 'Staff' : 'Student',
          status: newStatus
        };

        const isNowResolved = newStatus === 'resolved';

        // Notify complainant
        if (c.submittedBy?.id) {
          addNotification({
            userId: c.submittedBy.id,
            title: `Complaint ${c.id}: ${statusTitles[newStatus]}`,
            message: notes ? `Update: ${notes}` : `Status updated to ${newStatus.replace('_', ' ')}.`,
            complaintId: c.id,
            type: 'status_change'
          });
        }

        return {
          ...c,
          status: newStatus,
          updatedAt: now,
          resolvedAt: isNowResolved ? now : c.resolvedAt,
          resolutionNotes: notes || c.resolutionNotes,
          resolutionImage: resolutionImage || c.resolutionImage,
          timeline: [...c.timeline, newTimelineEvent]
        };
      })
    );
  };

  const updatePriority = (id: string, newPriority: ComplaintPriority) => {
    const now = new Date().toISOString();
    setComplaints(prev =>
      prev.map(c => {
        if (c.id !== id) return c;
        return {
          ...c,
          priority: newPriority,
          updatedAt: now,
          timeline: [
            ...c.timeline,
            {
              id: `tl-${id}-${Date.now()}`,
              title: `Priority Adjusted to ${newPriority.toUpperCase()}`,
              description: `Escalated/adjusted by ${user?.name || 'Operations'}`,
              timestamp: now,
              actor: user?.name || 'Operations Staff',
              actorRole: 'Administrator',
              status: c.status
            }
          ]
        };
      })
    );
  };

  const assignComplaint = (id: string, staff: { id: string; name: string; department: string; phone?: string }) => {
    const now = new Date().toISOString();
    setComplaints(prev =>
      prev.map(c => {
        if (c.id !== id) return c;
        const newStatus: ComplaintStatus = c.status === 'submitted' ? 'under_review' : c.status;
        return {
          ...c,
          status: newStatus,
          assignedTo: staff,
          updatedAt: now,
          timeline: [
            ...c.timeline,
            {
              id: `tl-${id}-${Date.now()}`,
              title: `Assigned to ${staff.name}`,
              description: `Assigned technician from ${staff.department}.`,
              timestamp: now,
              actor: user?.name || 'Administrator',
              actorRole: 'Administrator',
              status: newStatus
            }
          ]
        };
      })
    );
  };

  const addComment = (complaintId: string, text: string, isInternal: boolean = false) => {
    if (!text.trim()) return;
    const now = new Date().toISOString();
    const newComment: ComplaintComment = {
      id: `cm-${Date.now()}`,
      userId: user?.id || 'anonymous',
      userName: user?.name || 'Anonymous User',
      userRole: user?.role || 'student',
      text: text.trim(),
      timestamp: now,
      isInternal
    };

    setComplaints(prev =>
      prev.map(c => {
        if (c.id !== complaintId) return c;
        return {
          ...c,
          updatedAt: now,
          comments: [...c.comments, newComment]
        };
      })
    );
  };

  const toggleUpvote = (complaintId: string) => {
    if (!user) return;
    setComplaints(prev =>
      prev.map(c => {
        if (c.id !== complaintId) return c;
        const alreadyUpvoted = c.upvotedBy.includes(user.id);
        const upvotedBy = alreadyUpvoted
          ? c.upvotedBy.filter(uid => uid !== user.id)
          : [...c.upvotedBy, user.id];
        return {
          ...c,
          upvotes: alreadyUpvoted ? Math.max(0, c.upvotes - 1) : c.upvotes + 1,
          upvotedBy
        };
      })
    );
  };

  const rateComplaint = (complaintId: string, rating: number, feedback: string) => {
    setComplaints(prev =>
      prev.map(c => {
        if (c.id !== complaintId) return c;
        return {
          ...c,
          rating,
          ratingFeedback: feedback
        };
      })
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getComplaintById = (id: string) => {
    return complaints.find(c => c.id.toLowerCase() === id.toLowerCase());
  };

  const resetToDefaultData = () => {
    setComplaints(INITIAL_COMPLAINTS);
    localStorage.removeItem(COMPLAINTS_KEY);
  };

  const unreadNotificationCount = notifications.filter(n => !n.read && (!user || n.userId === user.id)).length;

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        notifications,
        unreadNotificationCount,
        createComplaint,
        updateStatus,
        updatePriority,
        assignComplaint,
        addComment,
        toggleUpvote,
        rateComplaint,
        markNotificationRead,
        markAllNotificationsRead,
        getComplaintById,
        resetToDefaultData
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};
