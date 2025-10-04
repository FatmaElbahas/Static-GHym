import React from 'react';
import commentImg from '../../assets/images/comment.png';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import useReviewsData from '../../hooks/useReviewsData';

const STATIC_TESTIMONIALS = [
  {
    id: 1,
    name: 'fatma elbahas',
    text:
      'ألف شكر للدكتور مهاب محمد على تعامله الراقي ومصداقيته وأمانته مثال للدكتور الأمين والخلص في عمله',
  },
  {
    id: 2,
    name: 'fatma elbahas',
    text: 'تجربة ممتازة وخدمة سريعة، أنصح الجميع. شكراً على الاحترافية العالية.',
  },
  {
    id: 3,
    name: 'fatma elbahas',
    text: 'أفضل عيادة تعاملت معها. اهتمام بالتفاصيل واحترام للمواعيد.',
  },
  {
    id: 4,
    name: 'fatma elbahas',
    text: 'خدمة رائعة وتعامل محترم جدًا، تجربة تستحق التكرار.',
  },
  {
    id: 5,
    name: 'fatma elbahas',
    text: 'النتيجة ممتازة والدعم سريع. شكراً لكم.',
  },
  {
    id: 6,
    name: 'fatma elbahas',
    text: 'اهتمام واضح براحة العميل من أول لحظة.',
  },
  {
    id: 7,
    name: 'fatma elbahas',
    text: 'دقة في المواعيد وأسعار مناسبة وجودة عالية.',
  },
  {
    id: 8,
    name: 'fatma elbahas',
    text: 'تعامل راقٍ ونتائج مبهرة. أوصي بها للجميع.',
  },
  {
    id: 9,
    name: 'fatma elbahas',
    text: 'شكراً لاهتمامكم بالتفاصيل وحرصكم على رضا العميل.',
  },
];

// Star Rating Component
const StarRating = ({ rating }) => {
  return (
    <div className="d-flex gap-1 mb-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <i
          key={star}
          className={`fas fa-star`}
          style={{
            color: star <= rating ? '#FFD700' : '#E0E0E0',
            fontSize: '16px',
          }}
        ></i>
      ))}
    </div>
  );
};

const Testimonials = () => {
  const { data: apiReviews, loading, error } = useReviewsData();

  // Use API data if available, otherwise use static data
  const reviews = apiReviews && apiReviews.length > 0 
    ? apiReviews.map(review => ({
        id: review.id,
        name: review.user?.fullname || 'عميل',
        text: review.comment,
        rating: review.rating || 5,
        image: review.user?.profile_image,
        salon: review.salon?.salon_name,
      }))
    : STATIC_TESTIMONIALS.map(t => ({ ...t, rating: 5 }));

  // Loading state
  if (loading) {
    return (
      <section className="py-5 testimonials" style={{ backgroundColor: '#ffffff' }}>
        <div className="mx-auto" style={{ width: '90%' }}>
          <div className="mb-4 text-end" style={{ marginTop: '20px', paddingRight: '10px' }}>
            <h2 className="m-0" style={{ color: '#484848', fontWeight: 800, fontSize: '34px' }}>آراء العملاء</h2>
          </div>
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">جاري التحميل...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="py-0 testimonials" style={{ backgroundColor: 
    
    
    
    
    
    
    
    
    '#ffffff' }}>
      <div className="mx-auto" style={{ width: '90%' }}>
        <div className="mb-4 text-end" style={{ marginTop: '20px', paddingRight: '10px' }}>
          <h2 className="m-0" style={{ color: '#484848', fontWeight: 800, fontSize: '34px' }}>آراء العملاء</h2>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{ 576: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } }}
          autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: false }}
          loop={true}
          allowTouchMove={false}
          pagination={{ 
            clickable: true,
            dynamicBullets: false
          }}
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <div
                className="position-relative rounded-4"
                style={{
                  background: '#ffffff',
                  border: '1px solid #f0f0f0',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                  padding: '24px',
                  minHeight: '250px',
                  overflow: 'hidden',
                }}
              >
                <div
                  aria-hidden
                  style={{
                    position: 'absolute',
                    insetInlineStart: '16px',
                    top: '0px',
                    bottom: 'auto',
                    width: '200px',
                    height: '200px',
                    opacity: 0.05,
                    color: '#000',
                    pointerEvents: 'none',
                  }}
                >
                  <img src={commentImg} alt="comment" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>

                {/* Star Rating */}
                <StarRating rating={review.rating} />

                {/* Review Text */}
                <p
                  className="mb-3"
                  style={{
                    color: '#484848',
                    fontSize: '18px',
                    lineHeight: 1.8,
                    textAlign: 'start',
                    margin: '12px 0',
                  }}
                >
                  {review.text}
                </p>

                {/* User Info */}
                <div className="mt-3 d-flex justify-content-end">
                  <div>
                    <span className="fw-bold d-block text-end" style={{ color: '#0171BD', fontSize: '16px' }}>
                      {review.name}
                    </span>
                    {review.salon && (
                      <span className="text-muted d-block text-end" style={{ fontSize: '13px' }}>
                        {review.salon}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <style>{`
          .testimonials .swiper-scrollbar { display: none !important; }
          .testimonials .swiper-scrollbar-drag { display: none !important; }
          @media (max-width: 576px) { .testimonial-card { padding: 20px; } }
        `}</style>
      </div>
    </section>
  );
};

export default Testimonials;


