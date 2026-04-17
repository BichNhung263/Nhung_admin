import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingBag, 
  Users, 
  ChevronRight,
  Monitor
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Bảng điều khiển', icon: LayoutDashboard, path: '/' },
    { name: 'Sản phẩm', icon: Package, path: '/products' },
    { name: 'Danh mục', icon: Layers, path: '/categories' },
    { name: 'Đơn hàng', icon: ShoppingBag, path: '/orders' },
    { name: 'Người dùng', icon: Users, path: '/users' },
  ];

  return (
    <div className="w-72 h-screen bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 left-0 z-50 transition-all duration-300">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200">
          <Monitor size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 leading-none">Nhung Admin</h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Management System</p>
        </div>
      </div>

      <nav className="flex-1 px-4 mt-4 space-y-1 overflow-y-auto pt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
              ${isActive 
                ? 'bg-primary-50 text-primary-600 shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
            `}
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <item.icon 
                    size={20} 
                    className={isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'} 
                  />
                  <span className="font-medium">{item.name}</span>
                </div>
                <ChevronRight size={16} className={`opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100' : ''}`} />
              </>
            )}

          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-100 mt-auto">
        <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
            NB
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">Bích Nhung</p>
            <p className="text-xs text-slate-500 truncate">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
