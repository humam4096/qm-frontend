import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { ThemeProvider } from './app/providers/ThemeProvider';
import { AppInitializer } from './app/providers/AppInitializer';
import { Toaster } from 'sonner';
import './app/providers/i18n'; // Initialize i18next globally
import './index.css';
import ReactQueryProvider from './app/providers/ReactQueryProvider';
import { ContractBuilderProvider } from './modules/contracts/components/builder/context/ContractBuilderContext';



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactQueryProvider>
      <ContractBuilderProvider>
        <ThemeProvider defaultTheme="system" storageKey="app-theme">
          <AppInitializer>
            <RouterProvider router={router} />
            <Toaster position="bottom-right" />
          </AppInitializer>
        </ThemeProvider>
      </ContractBuilderProvider>
    </ReactQueryProvider>
  </StrictMode>,
);
