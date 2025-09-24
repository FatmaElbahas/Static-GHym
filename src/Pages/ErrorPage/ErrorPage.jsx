import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function ErrorPage() {
  return (
    <>
      <Helmet>
        <title>404 - الصفحة غير موجودة | مركز غيم الطبي</title>
        <meta name="description" content="الصفحة التي تبحث عنها غير موجودة. عد إلى الصفحة الرئيسية أو تصفح خدماتنا" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="error-page d-flex align-items-center justify-content-center min-vh-100">
      <div className="container text-center">
        <div className="error-content">
          <div className="error-illustration mb-4">
            <svg width="300" height="200" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="150" cy="100" r="80" fill="#f8f9fa" stroke="#dee2e6" strokeWidth="2"/>
              <circle cx="130" cy="80" r="8" fill="#6c757d"/>
              <circle cx="170" cy="80" r="8" fill="#6c757d"/>
              <path d="M120 130 Q150 150 180 130" stroke="#6c757d" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <text x="150" y="40" textAnchor="middle" fontSize="24" fill="#dc3545" fontWeight="bold">404</text>
            </svg>
          </div>
          
          <h1 className="error-title mb-3">عذراً، الصفحة غير موجودة!</h1>
          <p className="error-description mb-4 text-muted">
            يبدو أن الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى مكان آخر.
          </p>
          
          <div className="error-actions d-flex flex-column flex-md-row gap-3 justify-content-center">
            <Link to="/" className="btn btn-main px-4 py-2">
              العودة للرئيسية
            </Link>
            <Link to="/offers" className="btn btn-outline-main px-4 py-2">
              تصفح العروض
            </Link>
          </div>
          
          <div className="error-suggestions mt-5">
            <h5 className="mb-3">صفحات قد تهمك:</h5>
            <div className="row justify-content-center">
              <div className="col-md-3 col-6 mb-2">
                <Link to="/pricing" className="text-decoration-none text-muted">
                  <div className="suggestion-card p-3 border rounded">
                    <i className="fas fa-tags mb-2 d-block"></i>
                    <small>التسعير</small>
                  </div>
                </Link>
              </div>
              <div className="col-md-3 col-6 mb-2">
                <Link to="/clinics" className="text-decoration-none text-muted">
                  <div className="suggestion-card p-3 border rounded">
                    <i className="fas fa-hospital mb-2 d-block"></i>
                    <small>العيادات</small>
                  </div>
                </Link>
              </div>
              <div className="col-md-3 col-6 mb-2">
                <Link to="/jobs" className="text-decoration-none text-muted">
                  <div className="suggestion-card p-3 border rounded">
                    <i className="fas fa-briefcase mb-2 d-block"></i>
                    <small>الوظائف</small>
                  </div>
                </Link>
              </div>
              <div className="col-md-3 col-6 mb-2">
                <Link to="/contact" className="text-decoration-none text-muted">
                  <div className="suggestion-card p-3 border rounded">
                    <i className="fas fa-envelope mb-2 d-block"></i>
                    <small>اتصل بنا</small>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

