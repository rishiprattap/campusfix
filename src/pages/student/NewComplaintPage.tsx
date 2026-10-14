import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { CAMPUS_BUILDINGS } from '../../data/mockData';
import { ComplaintCategory, ComplaintPriority } from '../../types';
import { analyzeComplaintDescription } from '../../services/aiAssistant';
import {
  Sparkles,
  Upload,
  X,
  AlertCircle,
  CheckCircle2,
  MapPin,
  ArrowRight,
  Shield,
  EyeOff,
  Building,
  Layers,
  HelpCircle
} from 'lucide-react';

const CATEGORIES: { label: ComplaintCategory; desc: string }[] = [
  { label: 'Infrastructure', desc: 'Doors, windows, walls, stairs, walkways' },
  { label: 'Electrical', desc: 'Lighting, switches, power outlets, circuit breakers' },
  { label: 'Plumbing', desc: 'Leaks, clogged sinks, toilets, water supply' },
  { label: 'Network & Wi-Fi', desc: 'Eduroam, campus Wi-Fi, ethernet ports, LAN' },
  { label: 'Sanitation & Cleanliness', desc: 'Spills, trash overflows, restrooms, pest control' },
  { label: 'Hostel & Housing', desc: 'Dorm radiators, appliances, beds, dorm plumbing' },
  { label: 'Cafeteria & Food', desc: 'Dining halls, food hygiene, seating areas' },
  { label: 'Security & Safety', desc: 'Broken locks, dark trails, fire extinguishers, emergency signs' },
  { label: 'Classroom & Labs', desc: 'Projectors, whiteboards, lab benches, audio mics' }
];

export const NewComplaintPage: React.FC = () => {
  const { user } = useAuth();
  const { createComplaint } = useComplaints();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('Plumbing');
  const [priority, setPriority] = useState<ComplaintPriority>('medium');
  const [selectedBuilding, setSelectedBuilding] = useState(CAMPUS_BUILDINGS[0].name);
  const [room, setRoom] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{
    suggestedAction?: string;
    safetyHazard?: boolean;
    applied?: boolean;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const currentBuildingObj = CAMPUS_BUILDINGS.find(b => b.name === selectedBuilding);

  const handleAiAutoFill = async () => {
    if (!description.trim()) {
      setFormError('Please enter a brief description of the problem first so AI can analyze it.');
      return;
    }

    setFormError(null);
    setIsAiAnalyzing(true);

    try {
      const result = await analyzeComplaintDescription(description, selectedBuilding, room);
      
      if (!title.trim() || title.length < 5) {
        setTitle(result.title);
      }
      setCategory(result.category);
      setPriority(result.priority);
      
      setAiSuggestions({
        suggestedAction: result.suggestedAction,
        safetyHazard: result.safetyHazard,
        applied: true
      });
    } catch {
      setFormError('AI analysis unavailable at this moment. You can manually select category and priority.');
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError('Please provide a brief title for the issue.');
      return;
    }
    if (!description.trim() || description.trim().length < 15) {
      setFormError('Please provide a descriptive explanation (at least 15 characters).');
      return;
    }
    if (!room.trim()) {
      setFormError('Please specify the exact room, floor, or area.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newComplaint = createComplaint({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        status: 'submitted',
        building: selectedBuilding,
        room: room.trim(),
        submittedBy: {
          id: user?.id || 'anonymous',
          name: isAnonymous ? 'Anonymous Student' : user?.name || 'Student',
          email: isAnonymous ? 'confidential@campus.edu' : user?.email || 'student@campus.edu',
          studentId: isAnonymous ? undefined : user?.studentId,
          department: user?.department,
          isAnonymous
        },
        images: imagePreview ? [imagePreview] : []
      });

      // Navigate to the newly created complaint detail page
      navigate(`/student/complaints/${newComplaint.id}`);
    } catch {
      setFormError('Failed to record complaint. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-stone-500">
        <Link to="/student/dashboard" className="hover:text-[#166534]">Dashboard</Link>
        <span>/</span>
        <span className="text-stone-900 font-medium">Submit Complaint</span>
      </div>

      {/* Page Header */}
      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
          Report a Campus Problem
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Submit details and photos directly to the university facility operations team.
        </p>
      </div>

      {/* AI Help Banner */}
      <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#166534] text-white flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 text-emerald-300" />
          </div>
          <div>
            <div className="text-xs font-bold text-stone-900">CampusFix Smart Triage Assistant</div>
            <div className="text-[11px] text-stone-600 mt-0.5">
              Type what happened into the description box below, then click "Analyze with AI" to automatically categorize and set urgency.
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAiAutoFill}
          disabled={isAiAnalyzing}
          className="px-3.5 py-2 bg-[#166534] hover:bg-[#14532d] disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
        >
          {isAiAnalyzing ? (
            <span>Analyzing...</span>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analyze with AI</span>
            </>
          )}
        </button>
      </div>

      {/* Form Error Banner */}
      {formError && (
        <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{formError}</span>
        </div>
      )}

      {/* AI Suggestion Alert */}
      {aiSuggestions?.applied && (
        <div className="p-3.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-800 space-y-1">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>AI Category & Priority Applied</span>
          </div>
          <div className="text-[11px] text-blue-700">
            Suggested Action: {aiSuggestions.suggestedAction}
          </div>
          {aiSuggestions.safetyHazard && (
            <div className="text-[11px] font-semibold text-red-700">
              ⚠️ Safety risk detected: Priority escalated to Urgent.
            </div>
          )}
        </div>
      )}

      {/* Main Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-8 rounded-xl border border-stone-200 shadow-xs">
        
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-stone-800 mb-1">
            Issue Title / Summary <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Water dripping from ceiling over Lab 304 workstations"
            className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#166534] focus:border-[#166534]"
          />
        </div>

        {/* Location Split: Building and Room */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Campus Building <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedBuilding}
              onChange={e => setSelectedBuilding(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#166534]"
            >
              {CAMPUS_BUILDINGS.map(b => (
                <option key={b.code} value={b.name}>
                  {b.name} ({b.zone})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Room, Floor or Area <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={room}
              onChange={e => setRoom(e.target.value)}
              placeholder="e.g. Room 312, 2nd Floor Restroom, East Stairwell"
              className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#166534]"
            />
            {currentBuildingObj && currentBuildingObj.commonAreas.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1 text-[10px] text-stone-400">
                <span className="text-stone-500">Suggestions:</span>
                {currentBuildingObj.commonAreas.slice(0, 3).map((area, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setRoom(area)}
                    className="underline hover:text-stone-700"
                  >
                    {area}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category & Priority */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Issue Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as ComplaintCategory)}
              className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#166534]"
            >
              {CATEGORIES.map(c => (
                <option key={c.label} value={c.label}>
                  {c.label}
                </option>
              ))}
            </select>
            <div className="text-[11px] text-stone-400 mt-1">
              {CATEGORIES.find(c => c.label === category)?.desc}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Urgency / Priority Tier <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5 pt-0.5">
              {(['low', 'medium', 'high', 'urgent'] as ComplaintPriority[]).map(p => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`py-2 text-xs font-semibold rounded-lg capitalize border transition-colors ${
                    priority === p
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
            <div className="text-[11px] text-stone-400 mt-1">
              Urgent is reserved for active leaks, sparks, electrical hazards, or safety locks.
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        <div>
          <label className="block text-xs font-bold text-stone-800 mb-1">
            Detailed Problem Description <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe what is broken, when it started, how severe it is, and any safety precautions already taken..."
            className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#166534]"
          />
        </div>

        {/* Photo Upload Attachment */}
        <div>
          <label className="block text-xs font-bold text-stone-800 mb-1">
            Photo Attachment (Optional)
          </label>
          
          {!imagePreview ? (
            <label className="border-2 border-dashed border-stone-200 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#166534] transition-colors bg-stone-50/50">
              <Upload className="w-6 h-6 text-stone-400 mb-2" />
              <span className="text-xs font-semibold text-stone-700">Click to upload photo evidence</span>
              <span className="text-[11px] text-stone-400 mt-0.5">JPG, PNG up to 10MB</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative rounded-xl border border-stone-200 overflow-hidden max-w-xs">
              <img
                src={imagePreview}
                alt="Upload preview"
                className="w-full h-44 object-cover"
              />
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="absolute top-2 right-2 p-1 bg-stone-900/70 hover:bg-stone-900 text-white rounded-md"
                aria-label="Remove uploaded image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Anonymous Reporting Toggle */}
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start gap-3">
          <input
            type="checkbox"
            id="anonymous"
            checked={isAnonymous}
            onChange={e => setIsAnonymous(e.target.checked)}
            className="mt-0.5 rounded text-[#166534] focus:ring-[#166534]"
          />
          <div>
            <label htmlFor="anonymous" className="text-xs font-bold text-stone-800 cursor-pointer">
              File Anonymously
            </label>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Your name and student ID will be hidden from public view and only accessible to verified university audit administrators if required by law.
            </p>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
          <Link
            to="/student/dashboard"
            className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-[#166534] hover:bg-[#14532d] disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-all inline-flex items-center gap-2"
          >
            {isSubmitting ? (
              <span>Submitting Report...</span>
            ) : (
              <>
                <span>Submit Complaint</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
