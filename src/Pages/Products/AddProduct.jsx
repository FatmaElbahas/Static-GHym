import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBox,
  faSave,
  faArrowLeft,
  faImage
} from '@fortawesome/free-solid-svg-icons';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    stock: '',
    discount: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category) {
      alert('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('تم إضافة المنتج بنجاح!');
      navigate('/dashboard');
    } catch (err) {
      alert('حدث خطأ أثناء إضافة المنتج');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="mb-0">
                <FontAwesomeIcon icon={faBox} className="me-2 text-primary" />
                إضافة منتج جديد
              </h2>
              <button 
                className="btn btn-outline-secondary"
                onClick={() => navigate('/dashboard')}
                type="button"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                العودة
              </button>
            </div>

            <div className="card shadow-sm">
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label fw-bold">
                      اسم المنتج <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="form-control form-control-lg"
                      placeholder="أدخل اسم المنتج"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold">الوصف</label>
                    <textarea
                      name="description"
                      className="form-control"
                      rows="4"
                      placeholder="أدخل وصف المنتج"
                      value={formData.description}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        السعر (ر.س) <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        name="price"
                        className="form-control form-control-lg"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">نسبة الخصم (%)</label>
                      <input
                        type="number"
                        name="discount"
                        className="form-control form-control-lg"
                        placeholder="0"
                        min="0"
                        max="100"
                        value={formData.discount}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        التصنيف <span className="text-danger">*</span>
                      </label>
                      <select
                        name="category"
                        className="form-select form-select-lg"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="">اختر التصنيف</option>
                        <option value="عناية بالبشرة">عناية بالبشرة</option>
                        <option value="مكياج">مكياج</option>
                        <option value="عناية بالشعر">عناية بالشعر</option>
                        <option value="عطور">عطور</option>
                        <option value="أخرى">أخرى</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">المخزون</label>
                      <input
                        type="number"
                        name="stock"
                        className="form-control form-control-lg"
                        placeholder="0"
                        min="0"
                        value={formData.stock}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold">
                      <FontAwesomeIcon icon={faImage} className="me-2" />
                      رابط الصورة
                    </label>
                    <input
                      type="url"
                      name="image"
                      className="form-control form-control-lg"
                      placeholder="https://example.com/image.jpg"
                      value={formData.image}
                      onChange={handleChange}
                    />
                    {formData.image && (
                      <div className="mt-3">
                        <img 
                          src={formData.image} 
                          alt="Preview" 
                          className="img-thumbnail"
                          style={{ maxWidth: '200px' }}
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary btn-lg"
                      onClick={() => navigate('/dashboard')}
                    >
                      إلغاء
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          جاري الحفظ...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faSave} className="me-2" />
                          حفظ المنتج
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
