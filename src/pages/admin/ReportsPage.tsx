import React, { useState } from 'react';
import { useComplaints } from '../../context/ComplaintContext';
import { CAMPUS_BUILDINGS } from '../../data/mockData';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Building,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { complaints } = useComplaints();

  const [dateRange, setDateRange] = useState<'7d' | '30d' | 'semester' | 'all'>('30d');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredComplaints = complaints.filter(c => {
    if (selectedBuilding !== 'all' && c.building !== selectedBuilding) return false;
    if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;

    if (dateRange === '7d') {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return new Date(c.createdAt) >= sevenDaysAgo;
    }
    if (dateRange === '30d') {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return new Date(c.createdAt) >= thirtyDaysAgo;
    }
    return true;
  });

  const total = filteredComplaints.length;
  const resolved = filteredComplaints.filter(c => c.status === 'resolved' || c.status === 'closed').length;
  const urgent = filteredComplaints.filter(c => c.priority === 'urgent').length;
  const resolutionPercentage = Math.round((resolved / Math.max(1, total)) * 100);

  const handleExportCSV = () => {
    const headers = ['Complaint ID', 'Title', 'Category', 'Priority', 'Status', 'Building', 'Room', 'Submitted By', 'Upvotes', 'Created At', 'Resolution Notes'];
    const rows = filteredComplaints.map(c => [
      c.id,
      `"${c.title.replace(/"/g, '""')}"`,
      c.category,
      c.priority,
      c.status,
      `"${c.building}"`,
      `"${c.room}"`,
      `"${c.submittedBy.name}"`,
      c.upvotes,
      c.createdAt,
      `"${(c.resolutionNotes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `campusfix-executive-report-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4 no-print">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Campus Operations Reports & Audit Export
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Generate compliance exports, quarterly facility summaries, and board-ready maintenance logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 text-xs font-semibold rounded-lg shadow-xs transition-colors inline-flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-stone-500" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-[#166534] hover:bg-[#14532d] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors inline-flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Report Filter Controls */}
      <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-xs space-y-4 no-print">
        <div className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-stone-400" />
          <span>Report Scope Configuration</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Time Period
            </label>
            <select
              value={dateRange}
              onChange={e => setDateRange(e.target.value as any)}
              className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="semester">Fall 2026 Semester</option>
              <option value="all">All Available Records</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Campus Facility
            </label>
            <select
              value={selectedBuilding}
              onChange={e => setSelectedBuilding(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none"
            >
              <option value="all">All Campus Buildings</option>
              {CAMPUS_BUILDINGS.map(b => (
                <option key={b.code} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Maintenance Trade
            </label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="Network & Wi-Fi">Network & Wi-Fi</option>
              <option value="Hostel & Housing">Hostel & Housing</option>
              <option value="Sanitation & Cleanliness">Sanitation & Cleanliness</option>
              <option value="Infrastructure">Infrastructure</option>
            </select>
          </div>

        </div>
      </div>

      {/* Official Printable Executive Report Card */}
      <div className="p-8 rounded-xl bg-white border border-stone-200 shadow-xs space-y-6">
        
        {/* Printable Letterhead */}
        <div className="border-b-2 border-[#166534] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xl font-bold text-[#166534] tracking-tight">
              CampusFix Executive Facility Operations Report
            </div>
            <div className="text-xs text-stone-500 mt-0.5">
              University Office of Campus Planning & Maintenance · Audited Compliance
            </div>
          </div>

          <div className="text-left sm:text-right text-xs font-mono text-stone-500">
            <div>Report Date: {new Date().toLocaleDateString()}</div>
            <div>Generated By: Director Marcus Vance</div>
          </div>
        </div>

        {/* Executive Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
            <div className="text-stone-500">Total Tickets in Scope</div>
            <div className="text-2xl font-bold font-mono text-stone-900 mt-1 tabular-nums">{total}</div>
          </div>
          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200">
            <div className="text-emerald-800">Closed / Resolved</div>
            <div className="text-2xl font-bold font-mono text-emerald-800 mt-1 tabular-nums">
              {resolved} ({resolutionPercentage}%)
            </div>
          </div>
          <div className="p-3.5 rounded-lg bg-red-50 border border-red-200">
            <div className="text-red-800">Urgent Hazards</div>
            <div className="text-2xl font-bold font-mono text-red-700 mt-1 tabular-nums">{urgent}</div>
          </div>
          <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
            <div className="text-stone-500">Avg Resolution SLA</div>
            <div className="text-2xl font-bold font-mono text-stone-900 mt-1 tabular-nums">11.6 Hours</div>
          </div>
        </div>

        {/* Summary Narrative */}
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-2 leading-relaxed">
          <div className="font-bold text-stone-900">Operations Assessment:</div>
          <p>
            During this period, Campus Facilities recorded a total of <strong>{total}</strong> incident filings. High-priority resolution performance remained strong, with urgent water and electrical issues isolated within an average of 42 minutes of student reporting.
          </p>
          <p>
            The highest concentration of reports was concentrated in <em>Science & Engineering Hall</em> and <em>Central University Library</em>, primarily concerning Wi-Fi access point load balancing and HVAC temperature calibration.
          </p>
        </div>

        {/* Audit Table Preview */}
        <div>
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">
            Itemized Audit Incident Roster
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Ticket ID</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Facility</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Resolution Proof</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono tabular-nums text-xs">
                {filteredComplaints.map(c => (
                  <tr key={c.id}>
                    <td className="py-2.5 px-3 font-bold text-stone-900">#{c.id}</td>
                    <td className="py-2.5 px-3 font-sans max-w-xs">
                      <div className="font-semibold text-stone-800 truncate">{c.title}</div>
                      <div className="text-[10px] text-stone-400 truncate">{c.description}</div>
                    </td>
                    <td className="py-2.5 px-3 font-sans">{c.building} ({c.room})</td>
                    <td className="py-2.5 px-3 font-sans capitalize">{c.priority}</td>
                    <td className="py-2.5 px-3 font-sans capitalize">{c.status.replace('_', ' ')}</td>
                    <td className="py-2.5 px-3 font-sans text-stone-500 max-w-xs truncate">
                      {c.resolutionNotes || 'Active Work Order'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Signatures block for formal compliance */}
        <div className="pt-8 border-t border-stone-200 grid grid-cols-2 gap-8 text-xs text-stone-500">
          <div>
            <div className="border-b border-stone-300 pb-8 mb-2 font-serif italic text-stone-800">
              Marcus Vance
            </div>
            <div>Director of Campus Operations</div>
            <div className="text-[10px] text-stone-400">Authorized Campus Signatory</div>
          </div>
          <div>
            <div className="border-b border-stone-300 pb-8 mb-2 font-serif italic text-stone-800">
              Dean of Student Affairs
            </div>
            <div>University Oversight Board</div>
            <div className="text-[10px] text-stone-400">Institutional Compliance Audit</div>
          </div>
        </div>

      </div>

    </div>
  );
};
