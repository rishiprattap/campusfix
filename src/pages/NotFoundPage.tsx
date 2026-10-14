import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-2xl bg-white border border-stone-200 shadow-xl text-center space-y-4">
        <div className="text-4xl font-extrabold font-mono text-[#166534]">404</div>
        <h1 className="text-xl font-bold text-stone-900">Page Not Found</h1>
        <p className="text-xs text-stone-600">
          The requested campus URL does not exist or has been moved to another building department.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#166534] hover:bg-[#14532d] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return to CampusFix Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
