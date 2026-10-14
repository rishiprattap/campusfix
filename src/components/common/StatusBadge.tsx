import React from 'react';
import { ComplaintStatus, ComplaintPriority } from '../../types';
import { CheckCircle2, Clock, AlertCircle, Wrench, XCircle, ArrowUpRight, Minus, AlertTriangle } from 'lucide-react';

interface StatusBadgeProps {
  status: ComplaintStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const configs: Record<ComplaintStatus, { label: string; icon: React.ReactNode; colorClass: string }> = {
    submitted: {
      label: 'Submitted',
      icon: <Clock className="w-3.5 h-3.5 text-slate-500" />,
      colorClass: 'text-slate-700 dark:text-slate-300'
    },
    under_review: {
      label: 'Under Review',
      icon: <AlertCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />,
      colorClass: 'text-blue-700 dark:text-blue-400 font-medium'
    },
    in_progress: {
      label: 'In Progress',
      icon: <Wrench className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
      colorClass: 'text-amber-700 dark:text-amber-400 font-medium'
    },
    resolved: {
      label: 'Resolved',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
      colorClass: 'text-emerald-700 dark:text-emerald-400 font-medium'
    },
    closed: {
      label: 'Closed',
      icon: <XCircle className="w-3.5 h-3.5 text-slate-400" />,
      colorClass: 'text-slate-500 font-normal'
    }
  };

  const item = configs[status] || configs.submitted;

  return (
    <span className={`inline-flex items-center gap-1.5 ${size === 'sm' ? 'text-xs' : 'text-sm'} ${item.colorClass} whitespace-nowrap`}>
      {item.icon}
      <span>{item.label}</span>
    </span>
  );
};

interface PriorityIndicatorProps {
  priority: ComplaintPriority;
}

export const PriorityIndicator: React.FC<PriorityIndicatorProps> = ({ priority }) => {
  const configs: Record<ComplaintPriority, { label: string; icon: React.ReactNode; colorClass: string }> = {
    low: {
      label: 'Low',
      icon: <Minus className="w-3.5 h-3.5 text-slate-400" />,
      colorClass: 'text-slate-600 dark:text-slate-400'
    },
    medium: {
      label: 'Medium',
      icon: <ArrowUpRight className="w-3.5 h-3.5 text-blue-500" />,
      colorClass: 'text-blue-700 dark:text-blue-400 font-medium'
    },
    high: {
      label: 'High',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />,
      colorClass: 'text-orange-700 dark:text-orange-400 font-medium'
    },
    urgent: {
      label: 'Urgent',
      icon: <AlertCircle className="w-3.5 h-3.5 text-red-600" />,
      colorClass: 'text-red-700 dark:text-red-400 font-semibold'
    }
  };

  const item = configs[priority] || configs.medium;

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs ${item.colorClass} whitespace-nowrap`}>
      {item.icon}
      <span>{item.label}</span>
    </span>
  );
};
