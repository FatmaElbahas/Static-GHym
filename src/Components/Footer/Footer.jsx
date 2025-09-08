import { faAppleAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo1 from "../../assets/images/logo-white.webp";
import sbc from "../../assets/images/sbc.png";
import vat from "../../assets/images/vat.png";
import { faFacebookF, faTwitter, faInstagram, faTiktok, faSnapchatGhost } from "@fortawesome/free-brands-svg-icons";
import { 
  faCcMastercard, 
  faCcVisa, 
  faCcApplePay 
} from "@fortawesome/free-brands-svg-icons";
import React from 'react'

export default function Footer() {
  return (
    <footer className='bg-main py-5'>
      <div className="container">
       <div className="foot1 position-relative">
 <div className='d-flex flex-column flex-md-row justify-content-between align-items-center gap-4'>
          
          <div className='d-flex flex-column gap-3 text-center text-md-start'>
              <h5 className='text-white'>حمل تطبيق بلسمي لحجز مواعيدك بسهولة</h5>
              <div className='d-flex gap-3 justify-content-center justify-content-md-start'>
                  <button className='rounded-pill px-4 py-2 bg-transparent text-white border border-white'>
                    جوجل بلاي
                  </button>
                  <button className='rounded-pill px-4 py-2 bg-transparent text-white border border-white'>
                    ابل استور <FontAwesomeIcon icon={faAppleAlt} />
                  </button>
              </div>
          </div>

          <div className='text-center d-flex flex-column justify-content-center align-items-center'>
              <img src={logo1} alt="Logo" style={{ width: "100px" }} />
              <ul className="list-unstyled d-flex gap-3 align-items-center justify-content-center mt-3 mb-0 text-white">
                <li>
                  <a href="https://www.facebook.com/yourpage" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-white">
                    <FontAwesomeIcon icon={faFacebookF}  style={{ fontSize: '1.5em' }}  />
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com/yourprofile" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-white">
                    <FontAwesomeIcon icon={faTwitter} style={{ fontSize: '1.5em' }} />
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/yourprofile" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-white">
                    <FontAwesomeIcon icon={faInstagram} style={{ fontSize: '1.5em' }} />
                  </a>
                </li>
                <li>
                  <a href="https://www.tiktok.com/@yourprofile" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-white">
                    <FontAwesomeIcon icon={faTiktok} style={{ fontSize: '1.5em' }} />
                  </a>
                </li>
                <li>
                  <a href="https://www.snapchat.com/add/yourprofile" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-white">
                    <FontAwesomeIcon icon={faSnapchatGhost} style={{ fontSize: '1.5em' }} />
                  </a>
                </li>
              </ul>
                <ul className="list-unstyled d-flex gap-3 justify-content-center align-items-center mt-3">
      <li>
        <FontAwesomeIcon icon={faCcMastercard} style={{ fontSize: '2em', color: '#FF5F00' }} />
      </li>
      <li>
        <FontAwesomeIcon icon={faCcVisa} style={{ fontSize: '2em', color: '#1A1F71' }} />
      </li>
      <li>
        <FontAwesomeIcon icon={faCcApplePay} style={{ fontSize: '2em', color: '#000' }} />
      </li>
      {/* <li>
        <img src={madaIcon} alt="Mada" style={{ width: '2em', height: '2em' }} />
      </li>
      <li>
        <img src={tabbyIcon} alt="Tabby" style={{ width: '2em', height: '2em' }} />
      </li> */}
    </ul>
          </div>

        </div>
       </div>
       <div className="copyRight mt-4">
        <div className='d-flex justify-content-between align-items-center'>
          <div className='d-flex justify-content-between align-items-center'>  
            <ul className='d-flex justify-content-center align-items-center gap-3'>
              <li className='d-flex justify-content-center align-items-center gap-2 text-white'>
            <img src={vat} alt="" className='w-10' />
            <p>
              الرقم الضريبي:312066452700003
            </p>
              </li>
                 <div style={{ width: '2px', height: '50px', backgroundColor: 'white' }}></div>
              <li>
                           <img src={sbc} alt="" className='w-40' />
 
                </li>
            </ul>
            <div className='text-white d-flex flex-column gap-0'>
              <p>
                جميع الحقوق محفوظة لشركة فن التطبيقات لتقنية المعلومات @ 2025

              </p>
              <p>
                سجل تجاري رقم ٢٠٥٠١٤٢٦٣٧ | سياسة الخصوصية

              </p>
            </div>
          </div>
          <div>
          </div>
        </div>
       </div>
      </div>
    </footer>
  )
}