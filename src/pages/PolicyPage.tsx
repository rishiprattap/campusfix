import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, FileText, Lock, AlertTriangle } from 'lucide-react';

export const PolicyPage: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  const getPolicyContent = () => {
    if (path.includes('privacy')) {
      return {
        title: 'Student Privacy & FERPA Compliance',
        icon: <Lock className="w-6 h-6 text-emerald-600" />,
        subtitle: 'How CampusFix protects student identifiers and complaint confidentiality',
        sections: [
          {
            heading: '1. Family Educational Rights and Privacy Act (FERPA)',
            body: 'CampusFix complies with federal FERPA guidelines. Student identifying numbers, department affiliations, and contact details are stored securely and never made accessible to unauthorized third parties or commercial entities.'
          },
          {
            heading: '2. Anonymous Reporting Protocol',
            body: 'When students choose "File Anonymously" during complaint submission, their name and student ID are obfuscated across all public-facing campus boards. Only authorized campus safety supervisors may inspect audit logs in cases of life safety emergencies.'
          },
          {
            heading: '3. Data Retention & Access Rights',
            body: 'Maintenance tickets and photo attachments are archived at the end of each academic year. Students may inspect or request correction of any inaccurate maintenance records linked to their account.'
          }
        ]
      };
    } else if (path.includes('safety')) {
      return {
        title: 'Campus Safety & Hazardous Incident Standards',
        icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
        subtitle: 'Protocols for reporting physical hazards, electrical risks, and emergency issues',
        sections: [
          {
            heading: '1. Immediate Danger & Life Safety Hotlines',
            body: 'If an issue involves active fire, toxic smoke, gas odor, or violent conduct, call Campus Police Dispatch immediately at (555) 019-4444 or dial 911. Do not rely solely on asynchronous ticket submissions for imminent emergencies.'
          },
          {
            heading: '2. Urgent Maintenance Classification',
            body: 'The "Urgent" tier is strictly reserved for: active water leaks proximate to electrical equipment, broken exterior door locks on dormitories, chemical laboratory ventilation failures, and blackout conditions on primary walkways.'
          },
          {
            heading: '3. Facilities Dispatch Response Times',
            body: 'Urgent priority tickets trigger automated dispatch notifications to on-duty university technicians within 15 minutes. Standard maintenance items are triaged within 24 business hours.'
          }
        ]
      };
    } else {
      return {
        title: 'Institutional Terms of Service',
        icon: <FileText className="w-6 h-6 text-[#166534]" />,
        subtitle: 'Guidelines governing proper utilization of the CampusFix management system',
        sections: [
          {
            heading: '1. Accurate & Good-Faith Reporting',
            body: 'Users agree to submit truthful, accurate descriptions of campus problems. Submitting false reports, harassing campus personnel, or utilizing the platform for non-facility disputes is a violation of the Student Code of Conduct.'
          },
          {
            heading: '2. Photo & Attachment Acceptable Use',
            body: 'Photographs uploaded to CampusFix must strictly depict physical facilities, equipment, or campus grounds. Do not upload photos of individuals without consent or copyrighted material.'
          },
          {
            heading: '3. Service Level Agreement (SLA)',
            body: 'CampusFix provides a unified bridge between students and campus operations. Resolution times depend on parts availability, university contractor schedules, and seasonal maintenance loads.'
          }
        ]
      };
    }
  };

  const content = getPolicyContent();

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#166534] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to CampusFix Home</span>
      </Link>

      <div className="p-8 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
            {content.icon}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              {content.title}
            </h1>
            <p className="text-xs text-stone-500 mt-0.5 font-mono">
              {content.subtitle}
            </p>
          </div>
        </div>

        <div className="space-y-6 text-xs text-stone-700 leading-relaxed">
          {content.sections.map((sec, idx) => (
            <div key={idx} className="space-y-1.5">
              <h2 className="text-sm font-bold text-stone-900">{sec.heading}</h2>
              <p className="text-stone-600">{sec.body}</p>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 font-mono">
          <span>University Legal & Facilities Compliance</span>
          <span>Last revised: Fall Semester 2026</span>
        </div>
      </div>
    </div>
  );
};
