import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Eye, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Download
} from 'lucide-react';
import { orderService } from '../services/apiService';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getAll();
      setOrders(res.data);
    } catch (error) {
      console.error('Lỗi khi lấy đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
      try {
        await orderService.delete(id);
        fetchOrders();
      } catch (error) {
        console.error('Lỗi khi xóa đơn hàng:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Quản lý Đơn hàng</h2>
          <p className="text-slate-500 text-sm">Theo dõi và quản lý các đơn đặt hàng từ khách hàng.</p>
        </div>
        <button className="btn-secondary flex items-center justify-center gap-2">
          <Download size={20} />
          Xuất báo cáo
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo mã đơn hoặc tên khách..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 outline-none transition-all text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-sm font-medium text-slate-600 transition-colors">
              <Filter size={18} />
              Trạng thái
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Mã Đơn</th>
                <th className="px-6 py-4 font-semibold">Khách hàng</th>
                <th className="px-6 py-4 font-semibold">Tổng tiền</th>
                <th className="px-6 py-4 font-semibold">Trạng thái</th>
                <th className="px-6 py-4 font-semibold">Ngày tạo</th>
                <th className="px-6 py-4 font-semibold">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-400 italic">Đang tải đơn hàng...</td>
                </tr>
              ) : orders.length > 0 ? orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">#{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="font-semibold text-slate-900">{order.user?.name || 'Khách vãng lai'}</p>
                      <p className="text-slate-500 text-xs">{order.user?.email || 'N/A'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-primary-600">
                    {order.totalPrice?.toLocaleString()}đ
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold
                      ${order.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                        order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}
                    `}>
                      {order.status || 'Chờ xử lý'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(order.createdAt).toLocaleString('vi-VN')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg">
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(order.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-400">Không có đơn hàng nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <p className="text-sm text-slate-500">Hiển thị <span className="font-semibold text-slate-900">{orders.length}</span> đơn hàng</p>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50" disabled>
              <ChevronLeft size={18} />
            </button>
            <button className="w-9 h-9 flex items-center justify-center bg-primary-600 text-white rounded-lg font-semibold shadow-sm">1</button>
            <button className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50" disabled>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
