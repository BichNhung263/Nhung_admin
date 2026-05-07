import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Package, 
  User, 
  Calendar, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  Printer
} from 'lucide-react';
import { orderService } from '../services/apiService';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await orderService.getById(id);
      setOrder(res.data);
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      0: { label: 'Chờ duyệt', color: 'text-amber-600 bg-amber-50 border-amber-100', icon: <AlertCircle size={18} /> },
      1: { label: 'Đã xác nhận', color: 'text-blue-600 bg-blue-50 border-blue-100', icon: <CheckCircle2 size={18} /> },
      2: { label: 'Đang giao hàng', color: 'text-indigo-600 bg-indigo-50 border-indigo-100', icon: <Truck size={18} /> },
      3: { label: 'Đã giao', color: 'text-green-600 bg-green-50 border-green-100', icon: <CheckCircle2 size={18} /> },
      4: { label: 'Đã hủy', color: 'text-red-600 bg-red-50 border-red-100', icon: <XCircle size={18} /> }
    };
    return statusMap[status] || { label: 'Không xác định', color: 'text-slate-600 bg-slate-50 border-slate-100', icon: <AlertCircle size={18} /> };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-bold text-slate-800">Không tìm thấy đơn hàng</h3>
        <p className="text-slate-500 mt-2">Đơn hàng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <Link to="/orders" className="mt-6 inline-flex items-center gap-2 text-primary-600 font-semibold hover:underline">
          <ArrowLeft size={18} /> Quay lại danh sách
        </Link>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/orders')}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-900">Chi tiết đơn hàng #{order.id}</h2>
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.color}`}>
                {statusInfo.icon}
                {statusInfo.label}
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-1">Đặt ngày {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-sm font-medium text-slate-600 transition-colors">
            <Printer size={18} />
            In hóa đơn
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center gap-2">
              <Package size={20} className="text-primary-600" />
              <h3 className="font-bold text-slate-800">Sản phẩm trong đơn</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Sản phẩm</th>
                    <th className="px-6 py-4 font-semibold">Giá</th>
                    <th className="px-6 py-4 font-semibold text-center">Số lượng</th>
                    <th className="px-6 py-4 font-semibold text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.orderDetails?.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                            <Package size={24} className="text-slate-400" />
                          </div>
                          <p className="font-semibold text-slate-900 text-sm">{item.productName || `Sản phẩm #${item.productId}`}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {item.price?.toLocaleString()}đ
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 font-medium text-center">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">
                        {(item.price * item.quantity)?.toLocaleString()}đ
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50/50">
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-right font-medium text-slate-500">Tổng cộng</td>
                    <td className="px-6 py-4 text-right text-xl font-bold text-primary-600">
                      {order.totalPrice?.toLocaleString()}đ
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <User size={20} className="text-primary-600" />
              <h3 className="font-bold text-slate-800">Khách hàng</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Họ tên</p>
                <p className="font-semibold text-slate-900 mt-0.5">{order.user?.name || 'Khách vãng lai'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Email</p>
                <p className="text-slate-600 text-sm mt-0.5">{order.user?.email || 'Chưa cung cấp'}</p>
              </div>
              {order.user?.phone && (
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Số điện thoại</p>
                  <p className="text-slate-600 text-sm mt-0.5">{order.user.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={20} className="text-primary-600" />
              <h3 className="font-bold text-slate-800">Thanh toán</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Phương thức</span>
                <span className="font-medium text-slate-900">VNPay / Tiền mặt</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Trạng thái</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${order.status > 0 ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                  {order.status > 0 ? 'Đã thanh toán' : 'Chờ thanh toán'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
