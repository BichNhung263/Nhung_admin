import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Check,
  X
} from 'lucide-react';
import { productService, categoryService } from '../services/apiService';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    quantity: '',
    categoryId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        productService.getAll(),
        categoryService.getAll()
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        description: product.description || '',
        image: product.image || '',
        quantity: product.quantity,
        categoryId: product.categoryId || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        description: '',
        image: '',
        quantity: '',
        categoryId: categories[0]?.id || ''
      });
    }
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        categoryId: parseInt(formData.categoryId)
      };

      if (editingProduct) {
        await productService.update(editingProduct.id, { ...payload, id: editingProduct.id });
      } else {
        await productService.create(payload);
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Lỗi khi lưu sản phẩm:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await productService.delete(id);
        fetchData();
      } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Quản lý Sản phẩm</h2>
          <p className="text-slate-500 text-sm">Xem, thêm, sửa và xóa các sản phẩm trong kho của bạn.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Thêm sản phẩm mới
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên sản phẩm..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 outline-none transition-all text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-sm font-medium text-slate-600 transition-colors">
              <Filter size={18} />
              Bộ lọc
            </button>
            <select className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-sm font-medium text-slate-600 outline-none bg-white">
              <option>Sắp xếp: Mới nhất</option>
              <option>Sắp xếp: Giá thấp - cao</option>
              <option>Sắp xếp: Giá cao - thấp</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Sản phẩm</th>
                <th className="px-6 py-4 font-semibold">Danh mục</th>
                <th className="px-6 py-4 font-semibold">Giá</th>
                <th className="px-6 py-4 font-semibold">Kho</th>
                <th className="px-6 py-4 font-semibold">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-400 italic">Đang tải dữ liệu...</td>
                </tr>
              ) : products.length > 0 ? products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-100">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={20} className="text-slate-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm leading-tight">{product.name}</p>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{product.description || 'Không có mô tả'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-primary-50 text-primary-600 rounded-md text-xs font-semibold">
                      {product.category?.name || 'Chưa phân loại'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">
                    {product.price?.toLocaleString()}đ
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <span className={`font-semibold ${product.quantity < 10 ? 'text-red-500' : 'text-slate-900'}`}>{product.quantity}</span>
                      <span className="text-slate-400 text-xs ml-1">đơn vị</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenModal(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-400">Không có sản phẩm nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <p className="text-sm text-slate-500">Hiển thị <span className="font-semibold text-slate-900">{products.length}</span> sản phẩm</p>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-slate-200 rounded-lg hover:bg-white transition-colors disabled:opacity-50" disabled>
              <ChevronLeft size={18} />
            </button>
            <button className="w-9 h-9 flex items-center justify-center bg-primary-600 text-white rounded-lg font-semibold shadow-sm">1</button>
            <button className="p-2 border border-slate-200 rounded-lg hover:bg-white transition-colors disabled:opacity-50" disabled>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative animate-in fade-in zoom-in duration-300 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">
                {editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-slate-50 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-1 sm:col-span-2 space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Tên sản phẩm</label>
                  <input 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-field" 
                    placeholder="Nhập tên sản phẩm..." 
                    required 
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Giá (VNĐ)</label>
                  <input 
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="input-field" 
                    placeholder="Ví dụ: 150000" 
                    required 
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Số lượng</label>
                  <input 
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="input-field" 
                    placeholder="Nhập số lượng kho..." 
                    required 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Danh mục</label>
                  <select 
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Link hình ảnh</label>
                  <input 
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="input-field" 
                    placeholder="https://..." 
                  />
                </div>

                <div className="col-span-1 sm:col-span-2 space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Mô tả</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4" 
                    className="input-field resize-none py-3" 
                    placeholder="Mô tả chi tiết sản phẩm..."
                  ></textarea>
                </div>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  className="flex-[2] btn-primary flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  {editingProduct ? 'Cập nhật sản phẩm' : 'Tạo mới sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
