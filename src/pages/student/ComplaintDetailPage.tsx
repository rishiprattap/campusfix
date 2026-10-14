import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { StatusBadge, PriorityIndicator } from '../../components/common/StatusBadge';
import { ComplaintStatus } from '../../types';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  ThumbsUp,
  MessageSquare,
  CheckCircle2,
  Clock,
  Shield,
  Send,
  Star,
  AlertTriangle,
  Building,
  Image as ImageIcon
} from 'lucide-react';

export const ComplaintDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { getComplaintById, addComment, toggleUpvote, rateComplaint } = useComplaints();
  const navigate = useNavigate();

  const complaint = id ? getComplaintById(id) : undefined;

  const [commentText, setCommentText] = useState('');
  const [starRating, setStarRating] = useState<number>(complaint?.rating || 5);
  const [ratingFeedback, setRatingFeedback] = useState<string>(complaint?.ratingFeedback || '');
  const [ratingSubmitted, setRatingSubmitted] = useState<boolean>(Boolean(complaint?.rating));

  if (!complaint) {
    return (
      <div className="p-12 text-center bg-white rounded-xl border border-stone-200">
        <h2 className="text-base font-bold text-stone-900">Complaint Not Found</h2>
        <p className="text-xs text-stone-500 mt-1">
          Complaint #{id} does not exist or has been removed from campus records.
        </p>
        <Link
          to="/student/complaints"
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#166534] text-white text-xs font-semibold rounded-lg hover:bg-[#14532d]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Complaints</span>
        </Link>
      </div>
    );
  }

  const steps: { key: ComplaintStatus; label: string }[] = [
    { key: 'submitted', label: 'Submitted' },
    { key: 'under_review', label: 'Under Review' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'resolved', label: 'Resolved' },
    { key: 'closed', label: 'Closed' }
  ];

  const statusOrder: Record<ComplaintStatus, number> = {
    submitted: 0,
    under_review: 1,
    in_progress: 2,
    resolved: 3,
    closed: 4
  };

  const currentStepIndex = statusOrder[complaint.status];
  const hasUpvoted = user ? complaint.upvotedBy.includes(user.id) : false;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(complaint.id, commentText.trim(), false);
    setCommentText('');
  };

  const handleRateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    rateComplaint(complaint.id, starRating, ratingFeedback);
    setRatingSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/student/complaints"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#166534] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Complaints</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleUpvote(complaint.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
              hasUpvoted
                ? 'bg-emerald-100 text-[#166534] border border-emerald-300'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
            title="Upvote this complaint"
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${hasUpvoted ? 'fill-emerald-600' : ''}`} />
            <span>{complaint.upvotes} Upvotes</span>
          </button>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="p-6 sm:p-8 rounded-xl bg-white border border-stone-200 shadow-xs space-y-4">
        
        {/* Metadata row */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 font-mono">
            <span className="font-bold text-stone-900 text-sm">#{complaint.id}</span>
            <span aria-hidden="true">·</span>
            <span>{complaint.category}</span>
            <span aria-hidden="true">·</span>
            <PriorityIndicator priority={complaint.priority} />
            <span aria-hidden="true">·</span>
            <span>Submitted {new Date(complaint.createdAt).toLocaleDateString()}</span>
          </div>

          <StatusBadge status={complaint.status} size="md" />
        </div>

        {/* Title & Description */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight leading-snug">
            {complaint.title}
          </h1>
          <p className="text-xs sm:text-sm text-stone-700 mt-3 leading-relaxed whitespace-pre-wrap">
            {complaint.description}
          </p>
        </div>

        {/* Location & Reporter Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-100 text-xs">
          <div>
            <div className="text-stone-400 font-medium">Campus Location</div>
            <div className="font-semibold text-stone-800 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              <span>{complaint.building}</span>
            </div>
            <div className="text-stone-500 text-[11px] mt-0.5">{complaint.room}</div>
          </div>

          <div>
            <div className="text-stone-400 font-medium">Reported By</div>
            <div className="font-semibold text-stone-800 mt-0.5">
              {complaint.submittedBy.isAnonymous ? 'Anonymous Student' : complaint.submittedBy.name}
            </div>
            <div className="text-stone-500 text-[11px] mt-0.5">
              {complaint.submittedBy.department || 'Undergraduate Student'}
            </div>
          </div>

          <div>
            <div className="text-stone-400 font-medium">Assigned Operations Team</div>
            <div className="font-semibold text-stone-800 mt-0.5">
              {complaint.assignedTo?.name || 'Awaiting Dispatch'}
            </div>
            <div className="text-stone-500 text-[11px] mt-0.5">
              {complaint.assignedTo?.department || 'Central Campus Operations'}
            </div>
          </div>
        </div>

        {/* Image Attachments */}
        {complaint.images && complaint.images.length > 0 && (
          <div className="pt-4 border-t border-stone-100">
            <div className="text-xs font-semibold text-stone-800 mb-2 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-stone-400" />
              <span>Submitted Photo Evidence</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {complaint.images.map((img, idx) => (
                <div key={idx} className="rounded-lg border border-stone-200 overflow-hidden bg-stone-100 aspect-video">
                  <img
                    src={img}
                    alt={`Evidence ${idx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Visual Resolution Stepper */}
      <div className="p-6 rounded-xl bg-white border border-stone-200 shadow-xs">
        <h2 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-6">
          Lifecycle Progression
        </h2>

        <div className="relative">
          {/* Connector bar */}
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-stone-200 -z-0" />

          <div className="grid grid-cols-5 gap-2 relative z-10 text-center">
            {steps.map((step, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div key={step.key} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isPast
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-[#166534] text-white ring-4 ring-emerald-100'
                        : 'bg-stone-200 text-stone-500'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <div
                    className={`text-[11px] font-semibold mt-2 ${
                      isCurrent ? 'text-[#166534]' : isPast ? 'text-stone-700' : 'text-stone-400'
                    }`}
                  >
                    {step.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Resolution Card & Rating (If Resolved) */}
      {(complaint.status === 'resolved' || complaint.status === 'closed') && (
        <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-[#166534] font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Official Resolution Report</span>
          </div>

          <p className="text-xs text-stone-800 leading-relaxed bg-white/70 p-3.5 rounded-lg border border-emerald-100">
            {complaint.resolutionNotes || 'Technician completed repairs and verified campus compliance.'}
          </p>

          {/* Student Satisfaction Feedback */}
          <div className="pt-2 border-t border-emerald-200/60">
            <div className="text-xs font-bold text-stone-800 mb-2">
              Student Repair Satisfaction
            </div>

            {ratingSubmitted ? (
              <div className="flex items-center gap-2 text-xs text-stone-700">
                <div className="flex items-center text-amber-500">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${star <= (complaint.rating || starRating) ? 'fill-amber-400' : 'text-stone-300'}`}
                    />
                  ))}
                </div>
                <span className="font-semibold font-mono tabular-nums">{complaint.rating || starRating} / 5 Stars</span>
                {complaint.ratingFeedback && (
                  <span className="text-stone-500 italic">· "{complaint.ratingFeedback}"</span>
                )}
              </div>
            ) : (
              <form onSubmit={handleRateSubmit} className="space-y-3">
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setStarRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-5 h-5 ${star <= starRating ? 'fill-amber-400' : 'text-stone-300'}`} />
                    </button>
                  ))}
                  <span className="text-xs font-mono font-medium ml-2 text-stone-600">{starRating} Stars</span>
                </div>
                <input
                  type="text"
                  value={ratingFeedback}
                  onChange={e => setRatingFeedback(e.target.value)}
                  placeholder="Optional: How satisfied are you with this repair?"
                  className="w-full text-xs px-3 py-2 bg-white border border-emerald-200 rounded-lg focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-[#166534] text-white text-xs font-semibold rounded-lg hover:bg-[#14532d]"
                >
                  Submit Satisfaction Rating
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Audit Timeline */}
      <div className="p-6 rounded-xl bg-white border border-stone-200 shadow-xs space-y-4">
        <h2 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
          Audit Activity Log
        </h2>

        <div className="space-y-4 pl-2 border-l-2 border-stone-100">
          {complaint.timeline.map((event, idx) => (
            <div key={event.id || idx} className="relative pl-6">
              <span className="w-2.5 h-2.5 rounded-full bg-[#166534] absolute -left-[19px] top-1" />
              <div className="flex items-center justify-between text-xs">
                <div className="font-bold text-stone-900">{event.title}</div>
                <span className="text-[11px] text-stone-400 font-mono">
                  {new Date(event.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-0.5">{event.description}</p>
              <div className="text-[11px] text-stone-400 mt-1">
                By: {event.actor} ({event.actorRole})
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Comments Thread */}
      <div className="p-6 rounded-xl bg-white border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-stone-400" />
            <span>Discussion Thread ({complaint.comments.length})</span>
          </h2>
          <span className="text-[11px] text-stone-400">All messages visible to facilities staff</span>
        </div>

        {complaint.comments.length === 0 ? (
          <div className="text-center py-6 text-xs text-stone-400">
            No comments posted yet. Ask a question or share extra details below.
          </div>
        ) : (
          <div className="space-y-3">
            {complaint.comments.map(c => (
              <div
                key={c.id}
                className={`p-3.5 rounded-lg text-xs ${
                  c.userRole === 'admin' || c.userRole === 'staff'
                    ? 'bg-blue-50/70 border border-blue-100'
                    : 'bg-stone-50 border border-stone-100'
                }`}
              >
                <div className="flex items-center justify-between font-semibold text-stone-900 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span>{c.userName}</span>
                    <span className="text-[10px] text-stone-400 font-normal uppercase">
                      · {c.userRole}
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-stone-700 leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Comment input form */}
        <form onSubmit={handleCommentSubmit} className="pt-2 flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            placeholder="Add update or question for the repair team..."
            className="flex-1 text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#166534]"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="px-4 py-2 bg-[#166534] hover:bg-[#14532d] disabled:opacity-40 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>

      </div>

    </div>
  );
};
