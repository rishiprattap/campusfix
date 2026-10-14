import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft, GraduationCap, Shield } from 'lucide-react';

export const UnauthorizedPage: React.FC = () => {
  const { user, switchDemoUser } = useAuth();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-2xl bg-white border border-stone-200 shadow-xl text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <h1 className="text-xl font-bold text-stone-900">
          Access Restricted
        </h1>

        <p className="text-xs text-stone-600 leading-relaxed">
          The requested section requires administrative credentials. Your current account (<strong className="capitalize">{user?.role || 'Guest'}</strong>) is not authorized to view internal campus management records.
        </p>

        <div className="pt-2 flex flex-col gap-2">
          {user?.role === 'student' && (
            <button
              onClick={() => switchDemoUser('admin')}
              className="w-full py-2.5 px-4 bg-[#166534] hover:bg-[#14532d] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>Switch to Administrator Persona (Demo)</span>
            </button>
          )}

          <Link
            to={user?.role === 'student' ? '/student/dashboard' : '/'}
            className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Safe Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
