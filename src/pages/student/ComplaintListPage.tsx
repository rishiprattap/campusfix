import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { StatusBadge, PriorityIndicator } from '../../components/common/StatusBadge';
import { ComplaintStatus, ComplaintCategory } from '../../types';
import {
  Search,
  Filter,
  PlusCircle,
  MapPin,
  Calendar,
  ThumbsUp,
  ArrowRight,
  SlidersHorizontal,
  Inbox
} from 'lucide-react';

export const ComplaintListPage: React.FC = () => {
  const { user } = useAuth();
  const { complaints, toggleUpvote } = useComplaints();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'priority' | 'upvotes'>('newest');
  const [scope, setScope] = useState<'my' | 'all'>('my');

  const filtered = useMemo(() => {
    return complaints.filter(c => {
      // Scope filter: user's own complaints or all campus complaints
      if (scope === 'my' && c.submittedBy.id !== user?.id) {
        return false;
      }

      // Search match
      const query = search.toLowerCase();
      const matchesSearch =
        c.title.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.id.toLowerCase().includes(query) ||
        c.building.toLowerCase().includes(query) ||
        c.room.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      // Status filter
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;

      // Category filter
      if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'upvotes') {
        return b.upvotes - a.upvotes;
      }
      if (sortBy === 'priority') {
        const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      return 0;
    });
  }, [complaints, user, scope, search, statusFilter, categoryFilter, sortBy]);

  const categories = Array.from(new Set(complaints.map(c => c.category)));

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Campus Complaints Directory
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Track resolution milestones, view campus issues, and endorse priority reports.
          </p>
        </div>

        <Link
          to="/student/complaints/new"
          className="px-4 py-2 bg-[#166534] hover:bg-[#14532d] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Report</span>
        </Link>
      </div>

      {/* Scope Toggles: My Reports vs All Campus Reports */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center p-1 bg-stone-100 rounded-lg text-xs font-medium">
          <button
            type="button"
            onClick={() => setScope('my')}
            className={`px-3.5 py-1.5 rounded-md transition-colors ${
              scope === 'my' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            My Reports ({complaints.filter(c => c.submittedBy.id === user?.id).length})
          </button>
          <button
            type="button"
            onClick={() => setScope('all')}
            className={`px-3.5 py-1.5 rounded-md transition-colors ${
              scope === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All Campus Reports ({complaints.length})
          </button>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-stone-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-700 text-xs focus:outline-none"
          >
            <option value="newest">Recently Submitted</option>
            <option value="priority">Highest Urgency</option>
            <option value="upvotes">Most Upvoted</option>
          </select>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Search Box */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by ID, keyword, building or room..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#166534]"
            />
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-700 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-700 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Complaints List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-stone-200">
          <Inbox className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-stone-800">No complaints match your criteria</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Try resetting your search query or switching from "My Reports" to "All Campus Reports".
          </p>
          {(search || statusFilter !== 'all' || categoryFilter !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('all');
                setCategoryFilter('all');
              }}
              className="mt-4 px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(c => {
            const hasUpvoted = user ? c.upvotedBy.includes(user.id) : false;
            return (
              <div
                key={c.id}
                className="p-5 rounded-xl bg-white border border-stone-200 shadow-xs hover:border-stone-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  {/* Clean unboxed metadata (zero-pill rule) */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 font-mono">
                    <span className="font-semibold text-stone-900">#{c.id}</span>
                    <span aria-hidden="true">·</span>
                    <span>{c.category}</span>
                    <span aria-hidden="true">·</span>
                    <PriorityIndicator priority={c.priority} />
                    <span aria-hidden="true">·</span>
                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>

                  <StatusBadge status={c.status} size="sm" />
                </div>

                <div className="py-3">
                  <Link
                    to={`/student/complaints/${c.id}`}
                    className="text-base font-bold text-stone-900 hover:text-[#166534] transition-colors line-clamp-1"
                  >
                    {c.title}
                  </Link>

                  <p className="text-xs text-stone-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{c.building} ({c.room})</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleUpvote(c.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                        hasUpvoted
                          ? 'bg-emerald-50 text-[#166534] font-medium'
                          : 'text-stone-500 hover:bg-stone-100'
                      }`}
                      title="Support this report"
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${hasUpvoted ? 'fill-emerald-600' : ''}`} />
                      <span className="tabular-nums">{c.upvotes}</span>
                    </button>

                    <Link
                      to={`/student/complaints/${c.id}`}
                      className="font-semibold text-[#166534] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Track Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
