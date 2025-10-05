import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBox,
  faPlus,
  faEdit,
  faTrash,
  faSpinner,
  faSearch,
  faTimes,
  faSave,
  faImage
} from '@fortawesome/free-solid-svg-icons';

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    stock: '',
    discount: ''
  });

  // جلب المنتجات من API (مثال)
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // هنا ممكن تستخدمي API الخاص بالمنتجات
      // const response = await fetch('https://your-api.com/products');
      // const data = await response.json();
      
      // مثال بيانات تجريبية
      const mockProducts = [
        {
          id: 1,
          name: 'منتج تجميلي 1',
          description: 'وصف المنتج الأول',
          price: 150,
          category: 'عناية بالبشرة',
          image: 'https://via.placeholder.com/150',
          stock: 50,
          discount: 10
        },
        {
          id: 2,
          name: 'منتج تجميلي 2',
          description: 'وصف المنتج الثاني',
          price: 200,
          category: 'مكياج',
          image: 'https://via.placeholder.com/150',
          stock: 30,
          discount: 0
        }
      ];
      
      setProducts(mockProducts);
      setLoading(false);
    } catch (err) {
      setError('حدث خطأ أثناء تحميل المنتجات');
      setLoading(false);
    }
  };

  // تحديث منتج
  const handleUpdateProduct = async () => {
    try {
      // API call to update product
      // const response = await fetch(`https://your-api.com/products/${selectedProduct.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      const updatedProducts = products.map(p => 
        p.id === selectedProduct.id 
          ? { ...p, ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock), discount: parseInt(formData.discount || 0) }
          : p
      );
      
      setProducts(updatedProducts);
      setShowEditModal(false);
      setSelectedProduct(null);
      resetForm();
      alert('تم تحديث المنتج بنجاح!');
    } catch (err) {
      alert('حدث خطأ أثناء تحديث المنتج');
    }
  };

  // حذف منتج
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      return;
    }
    
    try {
      // API call to delete product
      // await fetch(`https://your-api.com/products/${productId}`, {
      //   method: 'DELETE'
      // });
      
      setProducts(products.filter(p => p.id !== productId));
      alert('تم حذف المنتج بنجاح!');
    } catch (err) {
      alert('حدث خطأ أثناء حذف المنتج');
    }
  };

  // فتح نموذج التعديل
  const openEditModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      stock: product.stock,
      discount: product.discount || ''
    });
    setShowEditModal(true);
  };

  // إعادة تعيين النموذج
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      stock: '',
      discount: ''
    });
  };

  // تصفية المنتجات
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="products-section">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="section-title mb-0">
          <FontAwesomeIcon icon={faBox} className="me-2" />
          المنتجات
        </h3>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/add-product')}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          إضافة منتج جديد
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="input-group">
          <span className="input-group-text">
            <FontAwesomeIcon icon={faSearch} />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="البحث في المنتجات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <FontAwesomeIcon icon={faSpinner} spin size="3x" className="text-primary" />
          <p className="mt-3">جاري تحميل المنتجات...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {/* Products Grid */}
      {!loading && !error && (
        <div className="row">
          {filteredProducts.map((product) => (
            <div key={product.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 product-card">
                <div className="position-relative">
                  <img 
                    src={product.image} 
                    className="card-img-top" 
                    alt={product.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  {product.discount > 0 && (
                    <span className="badge bg-danger position-absolute top-0 end-0 m-2">
                      خصم {product.discount}%
                    </span>
                  )}
                </div>
                
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text text-muted small">{product.description}</p>
                  
                  <div className="mb-2">
                    <span className="badge bg-secondary">{product.category}</span>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <span className="h5 text-primary mb-0" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        {product.price}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 1124.14 1256.39"
                          width="12"
                          height="14"
                          style={{ display: 'inline-block', verticalAlign: 'middle' }}
                          aria-label="ريال سعودي"
                          title="ريال سعودي"
                        >
                          <path fill="currentColor" d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"></path>
                          <path fill="currentColor" d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"></path>
                        </svg>
                      </span>
                      <p className="text-muted small mb-0">المخزون: {product.stock}</p>
                    </div>
                  </div>
                  
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-sm btn-outline-primary flex-grow-1"
                      onClick={() => openEditModal(product)}
                    >
                      <FontAwesomeIcon icon={faEdit} className="me-1" />
                      تعديل
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredProducts.length === 0 && (
            <div className="col-12 text-center py-5">
              <FontAwesomeIcon icon={faBox} size="3x" className="text-muted mb-3" />
              <h5 className="text-muted">لا توجد منتجات</h5>
            </div>
          )}
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">تعديل المنتج</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">اسم المنتج</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">الوصف</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  ></textarea>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">السعر</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">الخصم (%)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.discount}
                      onChange={(e) => setFormData({...formData, discount: e.target.value})}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">التصنيف</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">المخزون</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">رابط الصورة</label>
                  <input
                    type="url"
                    className="form-control"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  إلغاء
                </button>
                <button type="button" className="btn btn-primary" onClick={handleUpdateProduct}>
                  <FontAwesomeIcon icon={faSave} className="me-2" />
                  حفظ التعديلات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .product-card {
          transition: all 0.3s ease;
        }
        
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        
        .modal.show {
          display: block !important;
        }
      `}</style>
    </div>
  );
};

export default Products;

