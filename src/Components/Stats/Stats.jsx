import React from 'react';
import CountUp from 'react-countup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faUsers, faUserMd, faHospital, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';

export default function Stats() {
  const statsData = [
    {
      icon: faStar,
      number: 5000,
      text: "تقييم حقيقي",
      suffix: " +"
    },
    {
      icon: faUsers,
      number: 30000,
      text: "مستخدم راضي",
      suffix: " +"
    },
    {
      icon: faUserMd,
      number: 500,
      text: "الأطباء",
      suffix: " +"
    },
    {
      icon: faHospital,
      number: 70,
      text: "المراكز",
      suffix: " +"
    },
    {
      icon: faCalendarCheck,
      number: 100000,
      text: "حجز ناجح",
      suffix: " +"
    }
  ];

  return (
    <section className="stats-section py-5 ">
      <div className="container-fluid">
        <div className="row g-3 g-lg-4 justify-content-center">
          {statsData.map((stat, index) => (
            <div key={index} className="col-6 col-sm-6 col-md-4 col-lg-2">
              <div className="stat-card bg-light rounded-4 p-3 p-lg-4 text-center h-100 d-flex flex-column justify-content-between">
                <div className="stat-icon mb-3 mb-lg-4">
                  <FontAwesomeIcon 
                    icon={stat.icon} 
                    className="fs-1" 
                    style={{color: '#008a91'}}
                  />
                </div>
                <div className="stat-number mb-3">
                  <CountUp
                    end={stat.number}
                    duration={2.5}
                    separator=","
                    className="fs-2 fw-bold text-muted"
                  />
                  <span className="fs-2 fw-bold text-muted">{stat.suffix}</span>
                </div>
                <div className="stat-text">
                  <p className="mb-0 fs-4 fw-semibold" style={{color: '#008a91'}}>
                    {stat.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
