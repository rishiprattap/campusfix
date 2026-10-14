import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintContext';
import {
  User,
  Mail,
  Shield,
  GraduationCap,
  Wrench,
  Check,
  Bell,
  Sparkles,
  Phone,
  Building,
  RotateCcw
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, switchDemoUser } = useAuth();
  const { resetToDefaultData, complaints } = useComplaints();

  const [name, setName] = useState(user?.name || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [studentId, setStudentId] = useState(user?.studentId || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [upvoteAlerts, setUpvoteAlerts] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      department,
      studentId,
      phone
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const myComplaintsCount = complaints.filter(c => c.submittedBy.id === user?.id).length;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      
      {/* Page Header */}
      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
          Profile & Account Preferences
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Manage your verified campus credentials and notification dispatch preferences.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="p-6 rounded-xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={user?.name || 'User'}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#166534]"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-stone-900">{user?.name}</h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold capitalize bg-emerald-100 text-[#166534]">
                {user?.role}
              </span>
            </div>
            <div className="text-xs text-stone-500 font-mono mt-0.5">{user?.email}</div>
            <div className="text-xs text-stone-400 mt-0.5">
              {user?.department} {user?.studentId ? `· ID: ${user.studentId}` : ''}
            </div>
          </div>
        </div>

        <div className="text-left sm:text-right text-xs">
          <div className="text-stone-400">Total Filed Reports</div>
          <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {myComplaintsCount}
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile information updated successfully.</span>
        </div>
      )}

      {/* Account Details Form */}
      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-xl bg-white border border-stone-200 shadow-xs space-y-4 text-xs">
        <h3 className="text-sm font-bold text-stone-900 mb-2">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Full Legal Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#166534]"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Institutional Email
            </label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full text-xs px-3 py-2 bg-stone-100 border border-stone-200 rounded-lg text-stone-500 cursor-not-allowed font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Academic Department
            </label>
            <input
              type="text"
              value={department}
              onChange={e => setDepartment(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#166534]"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Student / Staff Identifier
            </label>
            <input
              type="text"
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#166534] font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Mobile Contact
            </label>
            <input
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#166534] font-mono"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#166534] hover:bg-[#14532d] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>

      {/* Notifications Preferences */}
      <div className="p-6 rounded-xl bg-white border border-stone-200 shadow-xs space-y-4 text-xs">
        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
          <Bell className="w-4 h-4 text-stone-500" />
          <span>Notification & Alert Subscriptions</span>
        </h3>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-lg bg-stone-50 border border-stone-200/60 cursor-pointer">
            <div>
              <div className="font-semibold text-stone-900">Email Status Alerts</div>
              <div className="text-stone-500 text-[11px]">Receive updates when technician arrives or marks repair completed</div>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={e => setEmailAlerts(e.target.checked)}
              className="rounded text-[#166534] focus:ring-[#166534]"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg bg-stone-50 border border-stone-200/60 cursor-pointer">
            <div>
              <div className="font-semibold text-stone-900">SMS Emergency Broadcasts</div>
              <div className="text-stone-500 text-[11px]">Urgent notifications regarding power shutdowns or building pipe bursts</div>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={e => setSmsAlerts(e.target.checked)}
              className="rounded text-[#166534] focus:ring-[#166534]"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg bg-stone-50 border border-stone-200/60 cursor-pointer">
            <div>
              <div className="font-semibold text-stone-900">Peer Upvote Milestones</div>
              <div className="text-stone-500 text-[11px]">Get notified when your issue reaches 10+ student endorsements</div>
            </div>
            <input
              type="checkbox"
              checked={upvoteAlerts}
              onChange={e => setUpvoteAlerts(e.target.checked)}
              className="rounded text-[#166534] focus:ring-[#166534]"
            />
          </label>
        </div>
      </div>

      {/* Data Management & Demo Reset */}
      <div className="p-6 rounded-xl bg-stone-50 border border-stone-200 shadow-xs space-y-3 text-xs">
        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-stone-500" />
          <span>Demo Data Management</span>
        </h3>
        <p className="text-stone-600">
          Reset all mock complaint records and notifications back to the initial university factory state.
        </p>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Reset all demo complaints to initial mock state?')) {
              resetToDefaultData();
              alert('Complaints reset to default campus dataset.');
            }
          }}
          className="px-3.5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold rounded-lg transition-colors"
        >
          Reset Demo Database
        </button>
      </div>

    </div>
  );
};
