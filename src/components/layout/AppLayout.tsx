import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { CampusChatbot } from '../common/CampusChatbot';
import { useAuth } from '../../context/AuthContext';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isLandingOrAuth = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/unauthorized';

  return (
    <div className="min-h-screen bg-[#F7FAF7] text-[#172B22] flex flex-col">
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        showSidebarToggle={!isLandingOrAuth && isAuthenticated}
      />

      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        {!isLandingOrAuth && isAuthenticated && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        <main className={`flex-1 min-w-0 ${!isLandingOrAuth ? 'p-4 sm:p-6 lg:p-8' : ''}`}>
          <Outlet />
        </main>
      </div>

      {/* 24/7 AI Campus Assistant */}
      <CampusChatbot />
    </div>
  );
};
