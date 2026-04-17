import React from 'react';
import { Bell, Search, Settings, HelpCircle } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="h-20 bg-white/70 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Tìm kiếm mọi thứ..." 
            className="w-full pl-12 pr-4 py-2.5 bg-slate-100 border-transparent focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 rounded-xl outline-none transition-all placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded-xl transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <button className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
          <Settings size={20} />
        </button>
        <button className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
          <HelpCircle size={20} />
        </button>
        <div className="h-8 w-px bg-slate-200 mx-2"></div>
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 leading-tight">Admin</p>
            <p className="text-xs text-green-500 font-medium tracking-wide leading-tight">Online</p>
          </div>
          <img 
            src="https://ui-avatars.com/api/?name=Admin&background=0284c7&color=fff" 
            alt="User avatar" 
            className="w-10 h-10 rounded-xl border border-slate-200 shadow-sm"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
