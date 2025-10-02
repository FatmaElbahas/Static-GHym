import React from 'react';
import commentImg from '../../assets/images/comment.png';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

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

const Testimonials = () => {
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
          {STATIC_TESTIMONIALS.map((t) => (
            <SwiperSlide key={t.id}>
              <div
                className="position-relative rounded-4"
                style={{
                  background: '#ffffff',
                  border: '1px solid #f0f0f0',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                  padding: '24px',
                  minHeight: '220px',
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

                <p
                  className="mb-3"
                  style={{
                    color: '#484848',
                    fontSize: '20px',
                    lineHeight: 1.8,
                    textAlign: 'start',
                    margin: 0,
                  }}
                >
                  {t.text}
                </p>

                <div className="mt-3 d-flex justify-content-end">
                  <span className="fw-bold" style={{ color: '#0171BD' }}>{t.name}</span>
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


