import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './app/providers/ThemeProvider';
import { AppInitializer } from './app/providers/AppInitializer';
import { Toaster } from 'sonner';
import './app/providers/i18n'; // Initialize i18next globally
import './index.css';
import ReactQueryProvider from './app/providers/ReactQueryProvider';
import { ContractBuilderProvider } from './modules/contracts/components/builder/context/ContractBuilderContext';
import App from './App';
import { FormBuilderProvider } from './modules/forms/context/FormBuilderContext';
import { FormRunnerProvider } from './modules/form-submissions/context/FormRunnerContext';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FormRunnerProvider>
      <ReactQueryProvider>
        {/* contracts provider */}
        <ContractBuilderProvider>
          {/* forms provider */}
          <FormBuilderProvider>
            {/* theme provider */}
            <ThemeProvider defaultTheme="light" storageKey="app-theme">
              {/* app initializer */}
              <AppInitializer>
                <App />
                <Toaster position="bottom-right" />
              </AppInitializer>
            </ThemeProvider>
          </FormBuilderProvider>
        </ContractBuilderProvider>
      </ReactQueryProvider>
    </FormRunnerProvider>
  </StrictMode>,
);
