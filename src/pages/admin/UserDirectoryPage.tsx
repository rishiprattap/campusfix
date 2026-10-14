import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_USERS } from '../../data/mockData';
import { useComplaints } from '../../context/ComplaintContext';
import { User, Complaint } from '../../types';
import { StatusBadge, PriorityIndicator } from '../../components/common/StatusBadge';
import {
  Users,
  Search,
  GraduationCap,
  Shield,
  Wrench,
  ChevronRight,
  X,
  FileText,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

export const UserDirectoryPage: React.FC = () => {
  const { complaints } = useComplaints();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Group complaints by user
  const userComplaintStats = MOCK_USERS.map(u => {
    const userComplaints = complaints.filter(c => c.submittedBy.id === u.id);
    const resolved = userComplaints.filter(c => c.status === 'resolved' || c.status === 'closed').length;
    const active = userComplaints.length - resolved;
    return {
      user: u,
      complaints: userComplaints,
      total: userComplaints.length,
      active,
      resolved
    };
  });

  const filtered = userComplaintStats.filter(item => {
    const q = search.toLowerCase();
    const matchesQuery =
      item.user.name.toLowerCase().includes(q) ||
      item.user.email.toLowerCase().includes(q) ||
      (item.user.studentId && item.user.studentId.toLowerCase().includes(q)) ||
      (item.user.department && item.user.department.toLowerCase().includes(q));

    if (!matchesQuery) return false;
    if (roleFilter !== 'all' && item.user.role !== roleFilter) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Campus User Directory & Individual Summaries
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Review registered students, faculty, and maintenance staff with their individual complaint filing records.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search student name, ID, email or department..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#166534]"
          />
        </div>

        <div className="sm:w-48">
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-700 focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="admin">Administrators</option>
            <option value="staff">Facility Staff</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Identifier</th>
                <th className="py-3 px-3 text-center">Total Reports</th>
                <th className="py-3 px-3 text-center">Active</th>
                <th className="py-3 px-3 text-center">Resolved</th>
                <th className="py-3 px-4 text-right">Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-mono tabular-nums">
              {filtered.map(item => (
                <tr key={item.user.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-4 font-sans">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                        alt={item.user.name}
                        className="w-8 h-8 rounded-full object-cover border border-stone-200"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="font-bold text-stone-900">{item.user.name}</div>
                        <div className="text-[11px] text-stone-500 font-mono">{item.user.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 font-sans capitalize">
                    <span className="inline-flex items-center gap-1.5 text-xs text-stone-700">
                      {item.user.role === 'admin' ? (
                        <Shield className="w-3.5 h-3.5 text-blue-600" />
                      ) : item.user.role === 'staff' ? (
                        <Wrench className="w-3.5 h-3.5 text-amber-600" />
                      ) : (
                        <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                      <span>{item.user.role}</span>
                    </span>
                  </td>

                  <td className="py-3 px-3 font-sans text-stone-700">
                    {item.user.department || 'General'}
                  </td>

                  <td className="py-3 px-3 text-stone-500">
                    {item.user.studentId || 'N/A'}
                  </td>

                  <td className="py-3 px-3 text-center font-bold text-stone-900">
                    {item.total}
                  </td>

                  <td className="py-3 px-3 text-center text-amber-700 font-bold">
                    {item.active}
                  </td>

                  <td className="py-3 px-3 text-center text-emerald-700 font-bold">
                    {item.resolved}
                  </td>

                  <td className="py-3 px-4 text-right font-sans">
                    <button
                      type="button"
                      onClick={() => setSelectedUser(item.user)}
                      className="px-2.5 py-1.5 bg-stone-100 hover:bg-[#166534] hover:text-white text-stone-700 font-semibold rounded text-xs transition-colors inline-flex items-center gap-1"
                    >
                      <span>View History</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Individual User Summary Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={selectedUser.name}
                  className="w-10 h-10 rounded-full object-cover border border-stone-300"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-base font-bold text-stone-900">{selectedUser.name}</h3>
                  <div className="text-xs text-stone-500 font-mono">
                    {selectedUser.studentId} · {selectedUser.department}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              
              {/* Contact info grid */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200/70">
                <div>
                  <div className="text-stone-400 font-medium">Email Address</div>
                  <div className="font-semibold text-stone-900 mt-0.5 font-mono">{selectedUser.email}</div>
                </div>
                <div>
                  <div className="text-stone-400 font-medium">Telephone</div>
                  <div className="font-semibold text-stone-900 mt-0.5 font-mono">{selectedUser.phone || 'Not on file'}</div>
                </div>
              </div>

              {/* Complaints History Header */}
              <div>
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">
                  Filed Complaint History
                </h4>

                {complaints.filter(c => c.submittedBy.id === selectedUser.id).length === 0 ? (
                  <div className="p-6 text-center text-stone-400 border border-dashed border-stone-200 rounded-xl">
                    No complaints registered under this user profile.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {complaints
                      .filter(c => c.submittedBy.id === selectedUser.id)
                      .map(c => (
                        <div
                          key={c.id}
                          className="p-3.5 rounded-xl border border-stone-200 bg-white shadow-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-stone-900">#{c.id}</span>
                            <StatusBadge status={c.status} size="sm" />
                          </div>
                          <div className="font-semibold text-stone-800">{c.title}</div>
                          <div className="text-stone-500 font-mono text-[11px]">
                            {c.building} ({c.room}) · Submitted {new Date(c.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800"
              >
                Close Summary
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
