import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { ThemeProvider } from './app/providers/ThemeProvider';
import './app/providers/i18n'; // Initialize i18next globally
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
