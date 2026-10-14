import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useComplaints } from '../../context/ComplaintContext';
import { StatusBadge, PriorityIndicator } from '../../components/common/StatusBadge';
import { ComplaintStatus, ComplaintPriority, ComplaintCategory } from '../../types';
import { CAMPUS_BUILDINGS } from '../../data/mockData';
import {
  Search,
  Filter,
  CheckSquare,
  Square,
  ArrowUpDown,
  Download,
  Wrench,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

export const AdminComplaintsPage: React.FC = () => {
  const { complaints, updateStatus, assignComplaint } = useComplaints();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [buildingFilter, setBuildingFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<ComplaintStatus>('in_progress');

  const filtered = useMemo(() => {
    return complaints.filter(c => {
      const q = search.toLowerCase();
      const matchQuery =
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.room.toLowerCase().includes(q) ||
        c.submittedBy.name.toLowerCase().includes(q);

      if (!matchQuery) return false;
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && c.priority !== priorityFilter) return false;
      if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
      if (buildingFilter !== 'all' && c.building !== buildingFilter) return false;

      return true;
    });
  }, [complaints, search, statusFilter, priorityFilter, categoryFilter, buildingFilter]);

  const handleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(c => c.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleApplyBulkStatus = () => {
    if (selectedIds.length === 0) return;
    selectedIds.forEach(id => {
      updateStatus(id, bulkStatus, `Batch administrative status update to ${bulkStatus.replace('_', ' ')}.`);
    });
    setSelectedIds([]);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'Category', 'Priority', 'Status', 'Building', 'Room', 'Reporter', 'Upvotes', 'Date'];
    const rows = filtered.map(c => [
      c.id,
      `"${c.title.replace(/"/g, '""')}"`,
      c.category,
      c.priority,
      c.status,
      `"${c.building}"`,
      `"${c.room}"`,
      `"${c.submittedBy.name}"`,
      c.upvotes,
      new Date(c.createdAt).toLocaleDateString()
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `campusfix-complaints-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Master Complaints Management Queue
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Review incoming complaints, adjust priority tiers, assign field crews, and inspect resolution logs.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3.5 py-2 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 text-xs font-semibold rounded-lg shadow-xs transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto shrink-0"
        >
          <Download className="w-3.5 h-3.5 text-stone-500" />
          <span>Export Filtered ({filtered.length})</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search ID, title, room, reporter..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#166534]"
            />
          </div>

          {/* Status */}
          <div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-700 focus:outline-none"
            >
              <option value="all">Status: All</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-700 focus:outline-none"
            >
              <option value="all">Priority: All</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Building */}
          <div>
            <select
              value={buildingFilter}
              onChange={e => setBuildingFilter(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-700 focus:outline-none"
            >
              <option value="all">Building: All</option>
              {CAMPUS_BUILDINGS.map(b => (
                <option key={b.code} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Bulk Action Strip (appears when items are selected) */}
        {selectedIds.length > 0 && (
          <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
            <div className="font-semibold text-emerald-900">
              {selectedIds.length} complaints selected for batch action
            </div>

            <div className="flex items-center gap-2">
              <span className="text-stone-600 font-medium">Set status to:</span>
              <select
                value={bulkStatus}
                onChange={e => setBulkStatus(e.target.value as ComplaintStatus)}
                className="px-2.5 py-1 bg-white border border-stone-300 rounded text-xs font-medium"
              >
                <option value="under_review">Under Review</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <button
                type="button"
                onClick={handleApplyBulkStatus}
                className="px-3 py-1 bg-[#166534] hover:bg-[#14532d] text-white text-xs font-semibold rounded transition-colors"
              >
                Apply to Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main High-Density Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4 w-10">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-stone-400 hover:text-stone-700"
                    aria-label="Select all"
                  >
                    {selectedIds.length === filtered.length && filtered.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-[#166534]" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-3">Ticket ID</th>
                <th className="py-3 px-3">Title & Area</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Assigned Staff</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-mono tabular-nums">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-xs text-stone-400 font-sans">
                    No tickets match your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(c => {
                  const isSelected = selectedIds.includes(c.id);
                  return (
                    <tr
                      key={c.id}
                      className={`hover:bg-stone-50/80 transition-colors ${isSelected ? 'bg-emerald-50/30' : ''}`}
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(c.id)}
                          className="rounded text-[#166534] focus:ring-[#166534]"
                        />
                      </td>

                      <td className="py-3 px-3 font-bold text-stone-900">
                        <Link to={`/admin/complaints/${c.id}`} className="hover:text-[#166534]">
                          #{c.id}
                        </Link>
                      </td>

                      <td className="py-3 px-3 font-sans">
                        <Link
                          to={`/admin/complaints/${c.id}`}
                          className="font-bold text-stone-900 hover:text-[#166534] line-clamp-1"
                        >
                          {c.title}
                        </Link>
                        <div className="text-[11px] text-stone-400 font-mono">
                          {c.building} · {c.room}
                        </div>
                      </td>

                      <td className="py-3 px-3 font-sans">{c.category}</td>

                      <td className="py-3 px-3 font-sans">
                        <PriorityIndicator priority={c.priority} />
                      </td>

                      <td className="py-3 px-3 font-sans">
                        <select
                          value={c.status}
                          onChange={e => updateStatus(c.id, e.target.value as ComplaintStatus)}
                          className="text-xs px-2 py-1 bg-stone-50 border border-stone-200 rounded font-medium focus:outline-none"
                        >
                          <option value="submitted">Submitted</option>
                          <option value="under_review">Under Review</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>

                      <td className="py-3 px-3 font-sans text-stone-700">
                        {c.assignedTo?.name || (
                          <span className="text-stone-400 italic">Unassigned</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-stone-500">
                        {new Date(c.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </td>

                      <td className="py-3 px-4 text-right font-sans">
                        <Link
                          to={`/admin/complaints/${c.id}`}
                          className="px-2.5 py-1.5 bg-stone-100 hover:bg-[#166534] hover:text-white text-stone-700 font-semibold rounded text-xs transition-colors inline-flex items-center gap-1"
                        >
                          <span>Review</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="px-4 py-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>Showing {filtered.length} of {complaints.length} tickets</span>
          <span>CampusFix Live Database</span>
        </div>
      </div>

    </div>
  );
};
