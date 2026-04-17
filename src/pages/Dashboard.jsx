import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Package, 
  ShoppingBag, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  Clock
} from 'lucide-react';
import { productService, orderService, userService } from '../services/apiService';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} text-white shadow-lg`}>
        <Icon size={24} />
      </div>
      <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
        <MoreVertical size={20} />
      </button>
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <div className="flex items-end gap-3">
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-semibold mb-1 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {trendValue}
          </div>
        )}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes, usersRes] = await Promise.all([
          productService.getAll(),
          orderService.getAll(),
          userService.getAll()
        ]);
        
        const products = productsRes.data;
        const orders = ordersRes.data;
        const users = usersRes.data;

        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

        setStats({
          products: products.length,
          orders: orders.length,
          users: users.length,
          revenue: totalRevenue
        });

        setRecentOrders(orders.slice(0, 5).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Chào mừng trở lại, Bích Nhung! 👋</h2>
        <p className="text-slate-500 mt-1">Dưới đây là tóm tắt những gì đang xảy ra với doanh nghiệp của bạn ngày hôm nay.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Tổng doanh thu" 
          value={`${stats.revenue.toLocaleString()}đ`} 
          icon={TrendingUp} 
          trend="up" 
          trendValue="12.5%" 
          color="bg-primary-600"
        />
        <StatCard 
          title="Tổng đơn hàng" 
          value={stats.orders} 
          icon={ShoppingBag} 
          trend="up" 
          trendValue="8.2%" 
          color="bg-purple-600"
        />
        <StatCard 
          title="Tổng sản phẩm" 
          value={stats.products} 
          icon={Package} 
          color="bg-orange-500"
        />
        <StatCard 
          title="Tổng người dùng" 
          value={stats.users} 
          icon={Users} 
          trend="down" 
          trendValue="3.1%" 
          color="bg-green-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Đơn hàng gần đây</h3>
            <button className="text-primary-600 text-sm font-semibold hover:underline">Xem tất cả</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">ID Đơn</th>
                  <th className="px-6 py-4 font-semibold">Khách hàng</th>
                  <th className="px-6 py-4 font-semibold">Tổng tiền</th>
                  <th className="px-6 py-4 font-semibold">Trạng thái</th>
                  <th className="px-6 py-4 font-semibold">Ngày tạo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.length > 0 ? recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">#{order.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{order.user?.name || 'Guest'}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{order.totalPrice?.toLocaleString()}đ</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${order.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                          order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}
                      `}>
                        {order.status || 'Chờ xử lý'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-slate-400">Không có đơn hàng nào gần đây.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900">Hoạt động gần đây</h3>
            <Clock size={20} className="text-slate-400" />
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4 relative">
                {i !== 4 && <div className="absolute left-4 top-8 bottom-[-24px] w-px bg-slate-100"></div>}
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold
                  ${i === 1 ? 'bg-blue-500' : i === 2 ? 'bg-green-500' : i === 3 ? 'bg-amber-500' : 'bg-red-500'}
                `}>
                  {i}
                </div>
                <div>
                  <p className="text-sm text-slate-900 font-medium">Cập nhật kho hàng</p>
                  <p className="text-xs text-slate-500 mt-1">Admin đã cập nhật số lượng cho Sản phẩm #{100 + i}</p>
                  <p className="text-[10px] text-slate-400 uppercase mt-2 font-bold">2 giờ trước</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 bg-slate-50 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-100 transition-colors">
            Xem tất cả hoạt động
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
