import { documentClasses } from './app/theme.js';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App.jsx';
import './index.css';
document.documentElement.className = documentClasses;
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,

);
