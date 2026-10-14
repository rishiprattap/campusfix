import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { StatusBadge, PriorityIndicator } from '../../components/common/StatusBadge';
import { ComplaintStatus, ComplaintPriority } from '../../types';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Wrench,
  AlertCircle,
  User,
  MapPin,
  Calendar,
  Send,
  Lock,
  Upload,
  MessageSquare,
  Shield,
  Star,
  FileText
} from 'lucide-react';

const TECHNICIANS = [
  { id: 'user-david-miller', name: 'David Miller', department: 'Plumbing & Electrical Lead', phone: '+1 (555) 456-7890' },
  { id: 'user-maria-ramos', name: 'Maria Ramos', department: 'HVAC & Residential Facilities', phone: '+1 (555) 456-7891' },
  { id: 'user-samir-khan', name: 'Samir Khan', department: 'Campus IT & Wi-Fi Operations', phone: '+1 (555) 456-7892' },
  { id: 'user-elena-rostova', name: 'Elena Rostova', department: 'Structural & Carpentry Crew', phone: '+1 (555) 456-7893' }
];

export const AdminComplaintDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { getComplaintById, updateStatus, updatePriority, assignComplaint, addComment } = useComplaints();
  const navigate = useNavigate();

  const complaint = id ? getComplaintById(id) : undefined;

  const [newStatus, setNewStatus] = useState<ComplaintStatus>(complaint?.status || 'submitted');
  const [resolutionNotes, setResolutionNotes] = useState(complaint?.resolutionNotes || '');
  const [resolutionSuccess, setResolutionSuccess] = useState(false);

  const [selectedTech, setSelectedTech] = useState(complaint?.assignedTo?.id || TECHNICIANS[0].id);
  const [commentText, setCommentText] = useState('');
  const [isInternalComment, setIsInternalComment] = useState(false);

  if (!complaint) {
    return (
      <div className="p-12 text-center bg-white rounded-xl border border-stone-200">
        <h2 className="text-base font-bold text-stone-900">Complaint Record Not Found</h2>
        <Link
          to="/admin/complaints"
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#166534] text-white text-xs font-semibold rounded-lg"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Queue</span>
        </Link>
      </div>
    );
  }

  const handleStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateStatus(complaint.id, newStatus, resolutionNotes);
    setResolutionSuccess(true);
    setTimeout(() => setResolutionSuccess(false), 3000);
  };

  const handleAssignTech = () => {
    const tech = TECHNICIANS.find(t => t.id === selectedTech);
    if (tech) {
      assignComplaint(complaint.id, tech);
    }
  };

  const handlePriorityChange = (p: ComplaintPriority) => {
    updatePriority(complaint.id, p);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(complaint.id, commentText.trim(), isInternalComment);
    setCommentText('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/complaints"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#166534]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Operations Queue</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-stone-400">Case ID:</span>
          <span className="font-bold text-stone-900">#{complaint.id}</span>
        </div>
      </div>

      {/* Main Grid: Left Case Details vs Right Action Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Complaint Details & Timeline */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Header Card */}
          <div className="p-6 rounded-xl bg-white border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
                <span>{complaint.category}</span>
                <span>·</span>
                <PriorityIndicator priority={complaint.priority} />
                <span>·</span>
                <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
              </div>
              <StatusBadge status={complaint.status} size="md" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-stone-900 tracking-tight">
                {complaint.title}
              </h1>
              <p className="text-xs text-stone-700 mt-2 leading-relaxed whitespace-pre-wrap">
                {complaint.description}
              </p>
            </div>

            {/* Complainant Card */}
            <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200/70 text-xs grid grid-cols-2 gap-3">
              <div>
                <div className="text-stone-400 font-medium">Reporting Party</div>
                <div className="font-semibold text-stone-900 mt-0.5">
                  {complaint.submittedBy.name}
                  {complaint.submittedBy.isAnonymous && (
                    <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded ml-1.5 font-normal">
                      Anonymous Flag
                    </span>
                  )}
                </div>
                <div className="text-stone-500 text-[11px]">{complaint.submittedBy.email}</div>
              </div>

              <div>
                <div className="text-stone-400 font-medium">Department / ID</div>
                <div className="font-semibold text-stone-900 mt-0.5">
                  {complaint.submittedBy.department || 'Undergraduate'}
                </div>
                <div className="text-stone-500 text-[11px] font-mono">
                  {complaint.submittedBy.studentId || 'N/A'}
                </div>
              </div>
            </div>

            {/* Photos if any */}
            {complaint.images && complaint.images.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-stone-800 mb-2">Student Photo Evidence</div>
                <div className="grid grid-cols-2 gap-2">
                  {complaint.images.map((img, idx) => (
                    <div key={idx} className="rounded-lg border border-stone-200 overflow-hidden aspect-video bg-stone-100">
                      <img src={img} alt="Evidence" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Chronological Audit Timeline */}
          <div className="p-6 rounded-xl bg-white border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Official Audit Timeline
            </h2>

            <div className="space-y-4 pl-2 border-l-2 border-stone-100 text-xs">
              {complaint.timeline.map((event, idx) => (
                <div key={event.id || idx} className="relative pl-6">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#166534] absolute -left-[19px] top-1" />
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-stone-900">{event.title}</div>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {new Date(event.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </div>
                  <p className="text-stone-600 mt-0.5">{event.description}</p>
                  <div className="text-[10px] text-stone-400 mt-0.5">
                    Actor: {event.actor} ({event.actorRole})
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comments & Internal Communications */}
          <div className="p-6 rounded-xl bg-white border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-stone-400" />
                <span>Case Dialogue & Internal Logs</span>
              </h2>
            </div>

            <div className="space-y-3">
              {complaint.comments.map(c => (
                <div
                  key={c.id}
                  className={`p-3 rounded-lg text-xs ${
                    c.isInternal
                      ? 'bg-amber-50/80 border border-amber-200 text-amber-950'
                      : 'bg-stone-50 border border-stone-100 text-stone-800'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold mb-1">
                    <div className="flex items-center gap-1.5">
                      <span>{c.userName}</span>
                      <span className="text-[10px] text-stone-400 uppercase font-normal">
                        · {c.userRole}
                      </span>
                      {c.isInternal && (
                        <span className="text-[10px] text-amber-800 bg-amber-200/60 px-1 rounded flex items-center gap-0.5 font-bold">
                          <Lock className="w-2.5 h-2.5" /> Internal Note
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>

            {/* Post comment form */}
            <form onSubmit={handleCommentSubmit} className="pt-2 space-y-2">
              <input
                type="text"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Write reply to student or log internal note..."
                className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#166534]"
              />
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-1.5 text-stone-600 cursor-pointer text-[11px]">
                  <input
                    type="checkbox"
                    checked={isInternalComment}
                    onChange={e => setIsInternalComment(e.target.checked)}
                    className="rounded text-[#166534] focus:ring-[#166534]"
                  />
                  <span>Mark as Internal Staff Note (hidden from student)</span>
                </label>

                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-3 py-1.5 bg-[#166534] hover:bg-[#14532d] disabled:opacity-40 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Post Note</span>
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Right Column: Administrative Action Controls */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Status & Resolution Console */}
          <div className="p-6 rounded-xl bg-white border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-stone-500" />
              <span>Update Case Status</span>
            </h2>

            {resolutionSuccess && (
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Status & resolution notes updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleStatusUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Lifecycle Status
                </label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value as ComplaintStatus)}
                  className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#166534]"
                >
                  <option value="submitted">Submitted (Open)</option>
                  <option value="under_review">Under Administrative Review</option>
                  <option value="in_progress">Maintenance In Progress</option>
                  <option value="resolved">Resolved & Verified</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Official Resolution Notes
                </label>
                <textarea
                  rows={3}
                  value={resolutionNotes}
                  onChange={e => setResolutionNotes(e.target.value)}
                  placeholder="Detail parts replaced, tests performed, or explanation for closing..."
                  className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#166534]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#166534] hover:bg-[#14532d] text-white font-semibold rounded-lg shadow-xs transition-colors"
              >
                Apply Status Changes
              </button>
            </form>
          </div>

          {/* Technician Assignment Console */}
          <div className="p-6 rounded-xl bg-white border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-stone-500" />
              <span>Assign Facility Technician</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Current Assignee: <span className="text-stone-900">{complaint.assignedTo?.name || 'None'}</span>
                </label>
                <select
                  value={selectedTech}
                  onChange={e => setSelectedTech(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none"
                >
                  {TECHNICIANS.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.department})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleAssignTech}
                className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg transition-colors"
              >
                Dispatch Selected Technician
              </button>
            </div>
          </div>

          {/* Priority Escalation */}
          <div className="p-6 rounded-xl bg-white border border-stone-200 shadow-xs space-y-3">
            <h2 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Priority Adjustment
            </h2>

            <div className="grid grid-cols-4 gap-1.5">
              {(['low', 'medium', 'high', 'urgent'] as ComplaintPriority[]).map(p => (
                <button
                  type="button"
                  key={p}
                  onClick={() => handlePriorityChange(p)}
                  className={`py-2 text-xs font-semibold rounded-lg capitalize border transition-colors ${
                    complaint.priority === p
                      ? p === 'urgent'
                        ? 'bg-red-600 text-white border-red-600'
                        : p === 'high'
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-[#166534] text-white border-[#166534]'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Student Satisfaction Rating (if rated) */}
          {complaint.rating && (
            <div className="p-6 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-2">
              <div className="font-bold text-amber-950 flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-600 fill-amber-500" />
                <span>Student Resolution Review</span>
              </div>
              <div className="flex items-center gap-1 text-amber-700">
                <span className="font-bold font-mono text-sm">{complaint.rating} / 5</span>
                <span>Stars</span>
              </div>
              {complaint.ratingFeedback && (
                <p className="text-amber-900 italic bg-white/60 p-2 rounded border border-amber-100">
                  "{complaint.ratingFeedback}"
                </p>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
