import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Mail, 
  MapPin, 
  Calendar,
  MoreVertical,
  ShieldCheck
} from 'lucide-react';
import { userService } from '../services/apiService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userService.getAll();
      setUsers(res.data);
    } catch (error) {
      console.error('Lỗi khi lấy người dùng:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Quản lý Người dùng</h2>
          <p className="text-slate-500 text-sm">Quản lý tài khoản và quyền hạn của người dùng hệ thống.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 underline">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên hoặc email..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 outline-none transition-all text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-0 divide-y divide-x divide-slate-100">
          {loading ? (
            <div className="col-span-full py-20 text-center text-slate-400">Đang tải người dùng...</div>
          ) : users.length > 0 ? users.map((user) => (
            <div key={user.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
                    alt={user.name} 
                    className="w-12 h-12 rounded-xl"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      {user.name}
                      {user.role === 'Admin' && <ShieldCheck size={16} className="text-blue-500" />}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">#{user.id}</p>
                  </div>
                </div>
                <button className="p-2 text-slate-400 hover:bg-white rounded-lg transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Mail size={16} className="text-slate-400" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <MapPin size={16} className="text-slate-400" />
                  <span>Việt Nam</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Calendar size={16} className="text-slate-400" />
                  <span>Tham gia: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '17/04/2026'}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold
                  ${user.role === 'Admin' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}
                `}>
                  {user.role || 'Member'}
                </span>
                <button className="text-xs font-bold text-primary-600 hover:underline">Chi tiết</button>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center text-slate-400">Không có người dùng nào.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
