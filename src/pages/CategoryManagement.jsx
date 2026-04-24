import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Check,
  X,
  Layers
} from 'lucide-react';
import { categoryService, uploadService } from '../services/apiService';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    image: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await categoryService.getAll();
      setCategories(res.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh mục:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, image: category.image || '' });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', image: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id, { ...formData, id: editingCategory.id });
      } else {
        await categoryService.create({ ...formData, id: 0 });
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Lỗi khi lưu danh mục:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này? Điều này có thể ảnh hưởng đến các sản phẩm thuộc danh mục.')) {
      try {
        await categoryService.delete(id);
        fetchData();
      } catch (error) {
        console.error('Lỗi khi xóa danh mục:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Quản lý Danh mục</h2>
          <p className="text-slate-500 text-sm">Phân loại sản phẩm của bạn một cách hợp lý.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Thêm danh mục mới
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm danh mục..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 outline-none transition-all text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Tên danh mục</th>
                <th className="px-6 py-4 font-semibold">Mã ID</th>
                <th className="px-6 py-4 font-semibold">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-slate-400 italic">Đang tải dữ liệu...</td>
                </tr>
              ) : categories.length > 0 ? categories.map((category) => (
                <tr key={category.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 overflow-hidden">
                        {category.image ? (
                          <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                        ) : (
                          <Layers size={20} />
                        )}
                      </div>
                      <span className="font-bold text-slate-900">{category.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-500 font-medium">#{category.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-green-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      Đang hoạt động
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenModal(category)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(category.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-slate-400">Không có danh mục nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">
                {editingCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-slate-50 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Tên danh mục</label>
                <input 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field" 
                  placeholder="Ví dụ: Thiết bị điện tử" 
                  required 
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Hình ảnh</label>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 items-center">
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          try {
                            const res = await uploadService.uploadImage(file);
                            setFormData(prev => ({ ...prev, image: res.data.url }));
                          } catch (error) {
                            console.error('Lỗi khi tải ảnh lên:', error);
                            alert('Không thể tải ảnh lên. Vui lòng thử lại.');
                          }
                        }
                      }}
                      className="input-field flex-1 cursor-pointer file:cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" 
                    />
                    {formData.image && (
                      <div className="w-[42px] h-[42px] rounded-xl border border-slate-200 overflow-hidden shrink-0">
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <input 
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="input-field text-xs text-slate-500" 
                    placeholder="Hoặc dán URL/Link hình ảnh trực tiếp vào đây..." 
                  />
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
                  {editingCategory ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
