import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { StatusBadge, PriorityIndicator } from '../../components/common/StatusBadge';
import {
  AlertCircle,
  Clock,
  CheckCircle2,
  Wrench,
  TrendingUp,
  ArrowRight,
  Shield,
  Users,
  MapPin,
  Calendar,
  Building,
  FileSpreadsheet
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { complaints, updateStatus } = useComplaints();

  const total = complaints.length;
  const submitted = complaints.filter(c => c.status === 'submitted').length;
  const inProgress = complaints.filter(c => c.status === 'in_progress').length;
  const resolved = complaints.filter(c => c.status === 'resolved' || c.status === 'closed').length;
  const urgentCount = complaints.filter(c => c.priority === 'urgent' && c.status !== 'resolved' && c.status !== 'closed').length;

  const urgentQueue = complaints.filter(
    c => (c.priority === 'urgent' || c.priority === 'high') && c.status !== 'resolved' && c.status !== 'closed'
  );

  const recentSubmissions = [...complaints]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Group by building
  const buildingCounts = complaints.reduce<Record<string, number>>((acc, c) => {
    acc[c.building] = (acc[c.building] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#166534]">
            Campus Operations Control Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
            Welcome, Director {user?.name.split(' ')[1] || user?.name}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time monitoring of campus infrastructure, student tickets, and facility technician dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/reports"
            className="px-3.5 py-2 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 text-xs font-semibold rounded-lg shadow-xs transition-colors inline-flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-stone-500" />
            <span>Generate Report</span>
          </Link>
          <Link
            to="/admin/complaints"
            className="px-4 py-2 bg-[#166534] hover:bg-[#14532d] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors inline-flex items-center gap-1.5"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Manage All Complaints</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 mb-1">Total Reported</div>
          <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {total}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">All semester tickets</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
          <div className="text-xs text-amber-700 font-semibold mb-1">Needs Review</div>
          <div className="text-2xl font-bold font-mono text-amber-600 tabular-nums">
            {submitted}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Awaiting triage</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
          <div className="text-xs text-blue-700 font-semibold mb-1">In Progress</div>
          <div className="text-2xl font-bold font-mono text-blue-600 tabular-nums">
            {inProgress}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Active work orders</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
          <div className="text-xs text-emerald-700 font-semibold mb-1">Resolved</div>
          <div className="text-2xl font-bold font-mono text-emerald-600 tabular-nums">
            {resolved}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">{Math.round((resolved / Math.max(1, total)) * 100)}% resolution rate</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-red-200 shadow-xs col-span-2 md:col-span-1 bg-red-50/20">
          <div className="text-xs text-red-700 font-bold mb-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            <span>Urgent Queue</span>
          </div>
          <div className="text-2xl font-bold font-mono text-red-600 tabular-nums">
            {urgentCount}
          </div>
          <div className="text-[11px] text-red-600 font-medium mt-1">Immediate hazards</div>
        </div>

      </div>

      {/* Center 2-Column Split: Urgent Action Queue & Campus Buildings Load */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Urgent Queue */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <h2 className="text-base font-bold text-stone-900">
                Urgent Action Queue ({urgentQueue.length})
              </h2>
            </div>
            <Link
              to="/admin/complaints"
              className="text-xs font-semibold text-[#166534] hover:underline inline-flex items-center gap-1"
            >
              <span>View full queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {urgentQueue.map(c => (
              <div
                key={c.id}
                className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs hover:border-stone-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-stone-500 mb-1">
                      <span className="font-bold text-stone-900">#{c.id}</span>
                      <span>·</span>
                      <span>{c.building}</span>
                      <span>·</span>
                      <PriorityIndicator priority={c.priority} />
                    </div>
                    <Link
                      to={`/admin/complaints/${c.id}`}
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
                  <div className="flex items-center gap-2">
                    <span className="text-stone-400">Reporter:</span>
                    <span className="font-medium text-stone-800">{c.submittedBy.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {c.status === 'submitted' && (
                      <button
                        onClick={() => updateStatus(c.id, 'in_progress', 'Dispatched urgent response crew.')}
                        className="px-2.5 py-1 bg-amber-500 text-white rounded text-xs font-semibold hover:bg-amber-600"
                      >
                        Dispatch Crew
                      </button>
                    )}
                    <Link
                      to={`/admin/complaints/${c.id}`}
                      className="font-semibold text-[#166534] hover:underline"
                    >
                      Open Case
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Building Incident Distribution & Quick Technicians */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Building incident load */}
          <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Building className="w-4 h-4 text-stone-500" />
                <span>Building Incident Load</span>
              </h2>
              <Link to="/admin/analytics" className="text-xs font-semibold text-[#166534] hover:underline">
                Analytics
              </Link>
            </div>

            <div className="space-y-2.5">
              {Object.entries(buildingCounts).map(([bld, count]) => {
                const percentage = Math.round((count / total) * 100);
                return (
                  <div key={bld} className="text-xs">
                    <div className="flex items-center justify-between text-stone-700 mb-1">
                      <span className="font-medium truncate max-w-[200px]">{bld}</span>
                      <span className="font-mono tabular-nums text-stone-500">{count} issues ({percentage}%)</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-stone-100 overflow-hidden">
                      <div
                        className="h-full bg-[#166534] rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Staff Roster */}
          <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-stone-500" />
              <span>Available Facility Leads</span>
            </h2>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-stone-50 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-stone-900">David Miller</div>
                  <div className="text-stone-500 text-[11px]">Plumbing & Electrical Lead</div>
                </div>
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  On Shift
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-stone-50 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-stone-900">Maria Ramos</div>
                  <div className="text-stone-500 text-[11px]">HVAC & Dormitory Specialist</div>
                </div>
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  On Shift
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-stone-50 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-stone-900">Samir Khan</div>
                  <div className="text-stone-500 text-[11px]">Campus IT & Wi-Fi Operations</div>
                </div>
                <span className="text-[11px] font-mono text-stone-500 bg-stone-200 px-2 py-0.5 rounded">
                  Available
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Recent Submissions Table */}
      <div className="p-6 rounded-xl bg-white border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900">
            Recent Campus Ticket Intake
          </h2>
          <Link
            to="/admin/complaints"
            className="text-xs font-semibold text-[#166534] hover:underline inline-flex items-center gap-1"
          >
            <span>Open Management Grid</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-2.5 px-3">Ticket ID</th>
                <th className="py-2.5 px-3">Title & Area</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Reporter</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-mono tabular-nums">
              {recentSubmissions.map(c => (
                <tr key={c.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3 px-3 font-bold text-stone-900">#{c.id}</td>
                  <td className="py-3 px-3 font-sans">
                    <Link
                      to={`/admin/complaints/${c.id}`}
                      className="font-bold text-stone-900 hover:text-[#166534] line-clamp-1"
                    >
                      {c.title}
                    </Link>
                    <span className="text-[11px] text-stone-400 font-mono">{c.building} · {c.room}</span>
                  </td>
                  <td className="py-3 px-3 font-sans">{c.category}</td>
                  <td className="py-3 px-3 font-sans">
                    <PriorityIndicator priority={c.priority} />
                  </td>
                  <td className="py-3 px-3 font-sans">
                    <StatusBadge status={c.status} size="sm" />
                  </td>
                  <td className="py-3 px-3 font-sans text-stone-600">
                    {c.submittedBy.name}
                  </td>
                  <td className="py-3 px-3 text-right font-sans">
                    <Link
                      to={`/admin/complaints/${c.id}`}
                      className="font-semibold text-[#166534] hover:underline"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
