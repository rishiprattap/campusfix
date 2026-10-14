import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { StatusBadge, PriorityIndicator } from '../../components/common/StatusBadge';
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  Sparkles,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { complaints, toggleUpvote } = useComplaints();

  // Filter complaints submitted by this user
  const myComplaints = complaints.filter(c => c.submittedBy.id === user?.id);
  const activeComplaints = myComplaints.filter(c => c.status !== 'resolved' && c.status !== 'closed');
  const resolvedComplaints = myComplaints.filter(c => c.status === 'resolved' || c.status === 'closed');

  // Campus-wide active issues students can upvote
  const highPriorityCampusIssues = complaints
    .filter(c => c.status !== 'resolved' && c.status !== 'closed' && (c.priority === 'urgent' || c.priority === 'high'))
    .slice(0, 4);

  return (
    <div className="space-y-8">
      
      {/* Welcome & Primary CTA Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#166534] to-[#14532d] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-200 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Student Hub · {user?.department || 'College of Engineering'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name.split(' ')[0]}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
            Notice an issue on campus? Report broken facility fixtures, Wi-Fi outages, or dormitory problems for instant review by campus dispatch.
          </p>
        </div>

        <Link
          to="/student/complaints/new"
          className="px-5 py-3 bg-white hover:bg-emerald-50 text-[#166534] font-semibold text-xs sm:text-sm rounded-xl shadow-sm transition-all whitespace-nowrap inline-flex items-center gap-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-[#166534]" />
          <span>Report New Issue</span>
        </Link>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 mb-1">My Active Reports</div>
          <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {activeComplaints.length}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">In progress or review</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 mb-1">Successfully Resolved</div>
          <div className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">
            {resolvedComplaints.length}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Completed & verified</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 mb-1">Campus Resolution SLA</div>
          <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
            18.4 hrs
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">Faster than campus avg</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 mb-1">Community Upvotes</div>
          <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {myComplaints.reduce((acc, c) => acc + c.upvotes, 0)}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Student peer support</div>
        </div>

      </div>

      {/* Main Grid: My Recent Reports & Campus High-Priority Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: My Active Complaints */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                My Reported Complaints
              </h2>
              <p className="text-xs text-stone-500">Live status of issues submitted by your account</p>
            </div>
            <Link
              to="/student/complaints"
              className="text-xs font-semibold text-[#166534] hover:underline inline-flex items-center gap-1"
            >
              <span>View All ({myComplaints.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {myComplaints.length === 0 ? (
            <div className="p-8 rounded-xl bg-white border border-stone-200 text-center space-y-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="text-sm font-semibold text-stone-900">No active complaints logged</div>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Everything looks clean! If you spot broken facilities, water leaks, or security concerns, click below to log your report.
              </p>
              <Link
                to="/student/complaints/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#166534] text-white text-xs font-semibold rounded-lg hover:bg-[#14532d]"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Submit First Complaint</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myComplaints.slice(0, 3).map(c => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs hover:border-stone-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-stone-500 mb-1 font-mono">
                        <span>#{c.id}</span>
                        <span>·</span>
                        <span>{c.category}</span>
                        <span>·</span>
                        <PriorityIndicator priority={c.priority} />
                      </div>
                      <Link
                        to={`/student/complaints/${c.id}`}
                        className="text-sm font-bold text-stone-900 hover:text-[#166534] transition-colors line-clamp-1"
                      >
                        {c.title}
                      </Link>
                    </div>
                    <StatusBadge status={c.status} size="sm" />
                  </div>

                  <p className="text-xs text-stone-600 mt-2 line-clamp-2">
                    {c.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span className="truncate max-w-[200px]">{c.building} ({c.room})</span>
                    </div>

                    <Link
                      to={`/student/complaints/${c.id}`}
                      className="font-medium text-[#166534] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Track Progress</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Campus-Wide Urgent Issues to Upvote */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Campus Priority Radar
            </h2>
            <p className="text-xs text-stone-500">
              Upvote active issues affecting your classes or dorm
            </p>
          </div>

          <div className="space-y-3">
            {highPriorityCampusIssues.map(c => {
              const hasUpvoted = user ? c.upvotedBy.includes(user.id) : false;
              return (
                <div
                  key={c.id}
                  className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[11px] text-stone-500 flex items-center gap-1.5 font-mono">
                        <span>{c.building}</span>
                        <span>·</span>
                        <PriorityIndicator priority={c.priority} />
                      </div>
                      <Link
                        to={`/student/complaints/${c.id}`}
                        className="text-xs font-bold text-stone-900 hover:text-[#166534] line-clamp-1 mt-0.5"
                      >
                        {c.title}
                      </Link>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleUpvote(c.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold font-mono transition-colors shrink-0 ${
                        hasUpvoted
                          ? 'bg-emerald-100 text-[#166534] border border-emerald-300'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
                      }`}
                      title="Upvote to raise urgency"
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${hasUpvoted ? 'fill-emerald-600' : ''}`} />
                      <span className="tabular-nums">{c.upvotes}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-stone-600 line-clamp-2">
                    {c.description}
                  </p>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                    <StatusBadge status={c.status} size="sm" />
                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Help Box */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs space-y-1.5">
            <div className="font-semibold text-emerald-950 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Need Quick Answers?</span>
            </div>
            <p className="text-emerald-800 text-[11px] leading-relaxed">
              Use the floating <strong>CampusFix AI</strong> in the bottom right corner anytime to ask about maintenance schedules, complaint ticket updates, or library hours.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
