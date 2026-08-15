import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/ultra-large-screen.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext.jsx';
import { AuthProvider } from './AuthContext.jsx';

// Prevent Chrome extension errors (like MetaMask) from hijacking/triggering the React dev server overlay
if (process.env.NODE_ENV === 'development') {
  window.addEventListener('error', (event) => {
    if (
      event.filename?.includes('chrome-extension://') ||
      event.message?.includes('MetaMask') ||
      event.message?.includes('Failed to connect to MetaMask')
    ) {
      event.stopImmediatePropagation();
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    const stack = event.reason?.stack || '';
    const message = event.reason?.message || '';
    if (
      stack.includes('chrome-extension://') ||
      message.includes('MetaMask') ||
      message.includes('Failed to connect to MetaMask')
    ) {
      event.stopImmediatePropagation();
    }
  });
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>  
  </React.StrictMode>
);