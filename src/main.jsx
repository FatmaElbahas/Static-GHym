import { StrictMode } from 'react';
// Tajawal font removed - using IBM Plex Sans Arabic from Google Fonts instead
// import "@fontsource/tajawal/400.css";
// import "@fontsource/tajawal/500.css";
// import "@fontsource/tajawal/700.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import App from './App.jsx';
import RegisterApp from './RegisterApp.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);