import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  BarChart3,
  Users,
  FileSpreadsheet,
  User,
  Shield,
  GraduationCap,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { complaints } = useComplaints();

  const isAdmin = user?.role === 'admin';

  // Counts for badge numbers
  const studentActiveCount = complaints.filter(
    c => c.submittedBy.id === user?.id && c.status !== 'resolved' && c.status !== 'closed'
  ).length;

  const urgentAdminCount = complaints.filter(
    c => (c.status === 'submitted' || c.status === 'in_progress') && (c.priority === 'urgent' || c.priority === 'high')
  ).length;

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-[#166534] text-white shadow-sm'
        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
    }`;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed md:sticky top-0 md:top-16 z-50 md:z-0 h-screen md:h-[calc(100vh-4rem)] w-64 bg-white border-r border-stone-200 p-4 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Mobile Header with close button */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100 md:hidden">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-md bg-[#166534] text-white flex items-center justify-center font-bold text-xs">
                CF
              </span>
              <span className="font-bold text-[#166534]">CampusFix</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-50"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Role Badge */}
          <div className="px-3 py-2 mb-4 rounded-lg bg-stone-50 border border-stone-200/60 flex items-center gap-2.5">
            {isAdmin ? (
              <Shield className="w-4 h-4 text-blue-600 shrink-0" />
            ) : (
              <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <div className="min-w-0">
              <div className="text-xs font-semibold text-stone-900 truncate">
                {user?.name || 'Guest User'}
              </div>
              <div className="text-[11px] text-stone-500 capitalize">
                {user?.role} · {user?.department || 'University'}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {!isAdmin ? (
              // Student Links
              <>
                <NavLink to="/student/dashboard" className={linkClasses} onClick={() => onClose()}>
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </div>
                </NavLink>

                <NavLink to="/student/complaints/new" className={linkClasses} onClick={() => onClose()}>
                  <div className="flex items-center gap-3">
                    <PlusCircle className="w-4 h-4" />
                    <span>Report Issue</span>
                  </div>
                </NavLink>

                <NavLink to="/student/complaints" className={linkClasses} onClick={() => onClose()}>
                  <div className="flex items-center gap-3">
                    <ClipboardList className="w-4 h-4" />
                    <span>My Complaints</span>
                  </div>
                  {studentActiveCount > 0 && (
                    <span className="text-xs font-mono tabular-nums px-1.5 py-0.5 rounded bg-stone-200/70 text-stone-700">
                      {studentActiveCount}
                    </span>
                  )}
                </NavLink>
              </>
            ) : (
              // Admin Links
              <>
                <NavLink to="/admin/dashboard" className={linkClasses} onClick={() => onClose()}>
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Overview</span>
                  </div>
                </NavLink>

                <NavLink to="/admin/complaints" className={linkClasses} onClick={() => onClose()}>
                  <div className="flex items-center gap-3">
                    <ClipboardList className="w-4 h-4" />
                    <span>Manage Queue</span>
                  </div>
                  {urgentAdminCount > 0 && (
                    <span className="text-xs font-mono tabular-nums px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                      {urgentAdminCount}
                    </span>
                  )}
                </NavLink>

                <NavLink to="/admin/users" className={linkClasses} onClick={() => onClose()}>
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4" />
                    <span>User Directory</span>
                  </div>
                </NavLink>

                <NavLink to="/admin/analytics" className={linkClasses} onClick={() => onClose()}>
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-4 h-4" />
                    <span>Campus Analytics</span>
                  </div>
                </NavLink>

                <NavLink to="/admin/reports" className={linkClasses} onClick={() => onClose()}>
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Reports & Export</span>
                  </div>
                </NavLink>
              </>
            )}

            <div className="pt-3 my-2 border-t border-stone-100">
              <NavLink to="/profile" className={linkClasses} onClick={() => onClose()}>
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4" />
                  <span>Profile & Settings</span>
                </div>
              </NavLink>
            </div>
          </nav>
        </div>

        {/* Bottom Campus Helpline card */}
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100/80 text-xs">
          <div className="font-semibold text-emerald-950 mb-1">Campus Dispatch</div>
          <div className="text-emerald-800 text-[11px] space-y-0.5">
            <div>Emergency: <span className="font-mono tabular-nums font-medium">(555) 019-4444</span></div>
            <div>Facilities: <span className="font-mono tabular-nums font-medium">(555) 019-3333</span></div>
          </div>
        </div>

      </aside>
    </>
  );
};
