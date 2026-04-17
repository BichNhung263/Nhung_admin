import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-72 flex flex-col min-h-screen">
        <Navbar />
        <main className="p-8 flex-1 overflow-y-auto">
          <Outlet />
        </main>
        <footer className="px-8 py-6 border-t border-slate-200 bg-white/50 text-slate-500 text-sm flex items-center justify-between">
          <p>© 2026 Nhung Admin Portfolio. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-primary-600 transition-colors">Documentation</a>
            <a href="#" className="hover:text-primary-600 transition-colors">Support</a>
            <a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
