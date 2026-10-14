import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintContext';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  BarChart2,
  GraduationCap,
  ChevronRight
} from 'lucide-react';
import heroImage from '../assets/images/campus_quad_hero_1791949528940.jpg';

const DEFAULT_HERO_IMAGE = heroImage;
const FALLBACK_HERO_IMAGE = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { complaints } = useComplaints();
  const [imgSrc, setImgSrc] = useState(DEFAULT_HERO_IMAGE);

  // Safe fallback if complaints is null/undefined or loading
  const complaintList = complaints ?? [];
  const totalCount = complaintList.length;
  const resolvedCount = complaintList.filter(
    (c) => c?.status === 'resolved' || c?.status === 'closed'
  ).length;
  const resolutionRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;

  // Determine dashboard destination based on user role
  const dashboardPath = user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading and CTAs */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="text-xs font-semibold uppercase tracking-wider text-[#166534]">
                Campus Operations & Student Voice
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#172B22] tracking-tight leading-[1.1] text-balance">
                A Better Campus Starts With Your Voice.
              </h1>

              <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl">
                CampusFix empowers students to report physical hazards, Wi-Fi outages, and dormitory maintenance in seconds. Track real-time progress while university facility managers resolve issues transparently.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to={isAuthenticated ? '/student/complaints/new' : '/login'}
                  className="px-6 py-3.5 bg-[#166534] hover:bg-[#14532d] text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all inline-flex items-center gap-2"
                >
                  <span>Report an Issue</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to={isAuthenticated ? dashboardPath : '/login'}
                  className="px-6 py-3.5 bg-white hover:bg-stone-50 text-stone-800 text-sm font-semibold rounded-lg border border-stone-300 transition-colors inline-flex items-center gap-2"
                >
                  <span>Explore CampusFix</span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </Link>
              </div>

              {/* Verified Trust Stats */}
              <div className="pt-8 border-t border-stone-200 grid grid-cols-3 gap-6 text-left">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-[#166534] tabular-nums">
                    {resolutionRate}%
                  </div>
                  <div className="text-xs text-stone-500 mt-1">Resolution Rate</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900 tabular-nums">
                    &lt; 24h
                  </div>
                  <div className="text-xs text-stone-500 mt-1">Urgent Response</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900 tabular-nums">
                    100%
                  </div>
                  <div className="text-xs text-stone-500 mt-1">Audited Timeline</div>
                </div>
              </div>

            </div>

            {/* Right Column: High-Fidelity Campus Photo */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-stone-200 aspect-[16/10] bg-stone-100">
                <img
                  src={imgSrc}
                  alt="Historic university quad with stone buildings and tree-lined walkways"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={() => setImgSrc(FALLBACK_HERO_IMAGE)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-white/20 text-xs shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-semibold text-stone-900">Campus Facilities Active Dispatch</span>
                    </div>
                    <span className="text-stone-500 font-mono tabular-nums">Central Quad Zone</span>
                  </div>
                  <p className="text-stone-600 mt-1 text-[11px]">
                    All reported maintenance tickets are routed directly to qualified building technicians within 15 minutes of submission.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Three-step Explanation: Report, Track, Resolve */}
      <section id="how-it-works" className="py-20 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#166534] mb-2">
              Simple 3-Step Lifecycle
            </div>
            <h2 className="text-3xl font-bold text-stone-900 tracking-tight">
              From Report to Resolution in Hours
            </h2>
            <p className="text-stone-600 mt-3 text-sm sm:text-base">
              A transparent, closed-loop workflow that ensures no student ticket ever gets lost in an administrative inbox.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="p-6 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-[#166534] flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">
                Report with Precision
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Select your campus hall, upload photos, and let our integrated AI assistant auto-classify categories and suggest safety priority tiers.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-[#166534] flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">
                Track Live Milestones
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Receive instant status notifications when work orders are reviewed, assigned to specific technicians, and actively under repair.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-[#166534] flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">
                Verify & Rate Outcome
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Inspect completion notes and resolution photos provided by facility crews, and rate your repair satisfaction to ensure high campus standards.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-20 bg-[#F7FAF7] border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#166534] mb-2">
              System Capabilities
            </div>
            <h2 className="text-3xl font-bold text-stone-900 tracking-tight">
              Designed for Campus Excellence
            </h2>
            <p className="text-stone-600 mt-3 text-sm sm:text-base">
              Modern tools engineered specifically for college campuses, dormitories, academic laboratories, and facility departments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-xl bg-white border border-stone-200 shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#166534] flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">Easy Reporting</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Clean mobile-first submission forms with photo previews, anonymous reporting mode, and AI hazard classification.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-stone-200 shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#166534] flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">Real-Time Tracking</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Full chronological audit trails with timestamps, assigned staff details, and in-thread two-way dialogue.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-stone-200 shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#166534] flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">Faster Resolution</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Priority triage algorithms highlight emergency safety risks, preventing property damage and prolonged downtime.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-stone-200 shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#166534] flex items-center justify-center mb-4">
                <BarChart2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">Campus Analytics</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Visual building heatmaps, monthly incident trends, departmental load balancing, and exportable administrative reports.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Dual Benefits Section: Students vs Administrators */}
      <section id="impact" className="py-20 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Student Benefits */}
            <div className="p-8 rounded-2xl bg-stone-50 border border-stone-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-stone-900">For University Students</h3>
                  <p className="text-xs text-stone-500">Fast, confidential, and accountable</p>
                </div>
              </div>
              <ul className="space-y-4 text-sm text-stone-700">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 shrink-0" />
                  <span>Report issues from your smartphone anywhere on campus in under 60 seconds.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 shrink-0" />
                  <span>Upvote recurring issues reported by peers to help administrators identify high-impact problems.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 shrink-0" />
                  <span>24/7 AI CampusFix Assistant ready to guide you or check complaint progress anytime.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 shrink-0" />
                  <span>Rate repair quality and leave direct feedback for continuous campus improvement.</span>
                </li>
              </ul>
              <div className="mt-8">
                <Link
                  to={isAuthenticated ? '/student/dashboard' : '/login'}
                  className="text-xs font-semibold text-[#166534] hover:text-[#14532d] inline-flex items-center gap-1.5"
                >
                  <span>Access Student Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Administrator Benefits */}
            <div className="p-8 rounded-2xl bg-stone-50 border border-stone-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-stone-900">For Campus Administrators</h3>
                  <p className="text-xs text-stone-500">Operations triage, audit compliance & analytics</p>
                </div>
              </div>
              <ul className="space-y-4 text-sm text-stone-700">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 shrink-0" />
                  <span>Centralized management queue with filter by building, priority, and department.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 shrink-0" />
                  <span>One-click technician assignment and status tracking with official resolution proof.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 shrink-0" />
                  <span>Student directory with individual complaint histories for targeted academic support.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 shrink-0" />
                  <span>Data-driven executive reports exportable as CSV or printable PDF summaries.</span>
                </li>
              </ul>
              <div className="mt-8">
                <Link
                  to={isAuthenticated ? '/admin/dashboard' : '/login'}
                  className="text-xs font-semibold text-stone-900 hover:text-stone-700 inline-flex items-center gap-1.5"
                >
                  <span>Access Administrator Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Call to action section */}
      <section className="py-16 bg-[#166534] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to upgrade campus life?
          </h2>
          <p className="mt-3 text-emerald-100 text-sm sm:text-base max-w-xl mx-auto">
            Join thousands of students and faculty members who make our university safer, cleaner, and better maintained every day.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to={isAuthenticated ? dashboardPath : '/login'}
              className="px-6 py-3 bg-white text-[#166534] font-semibold text-sm rounded-lg hover:bg-emerald-50 transition-colors shadow-sm"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 text-xs border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="text-white font-bold text-sm flex items-center gap-2 mb-3">
              <span className="w-5 h-5 rounded bg-emerald-600 text-white flex items-center justify-center text-xs font-mono">CF</span>
              <span>CampusFix</span>
            </div>
            <p className="text-stone-400 leading-relaxed">
              Smart Campus Complaint Management System for modern collegiate institutions.
            </p>
          </div>

          <div>
            <div className="text-white font-semibold mb-3">Portals</div>
            <ul className="space-y-2">
              <li><Link to="/student/dashboard" className="hover:text-white transition-colors">Student Hub</Link></li>
              <li><Link to="/admin/dashboard" className="hover:text-white transition-colors">Admin Console</Link></li>
              <li><Link to="/student/complaints/new" className="hover:text-white transition-colors">Submit Issue</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-white font-semibold mb-3">Emergency Lines</div>
            <ul className="space-y-2 font-mono tabular-nums">
              <li>Campus Police: (555) 019-4444</li>
              <li>Facilities Desk: (555) 019-3333</li>
              <li>IT Help Desk: (555) 019-2222</li>
            </ul>
          </div>

          <div>
            <div className="text-white font-semibold mb-3">Compliance & Privacy</div>
            <ul className="space-y-2">
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Student Privacy (FERPA)</Link></li>
              <li><Link to="/safety" className="hover:text-white transition-colors">Campus Safety Standards</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-stone-800 text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© {new Date().getFullYear()} CampusFix System. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <span>Official University Operations</span>
            <span>·</span>
            <span>24/7 Monitored Dispatch</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
