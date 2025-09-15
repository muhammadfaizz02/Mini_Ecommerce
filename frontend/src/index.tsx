import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
import App from './App';
import { ToastProvider } from './components/ToastContext'; 
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ToastProvider> 
      <App />
    </ToastProvider>
  </React.StrictMode>
);

reportWebVitals();