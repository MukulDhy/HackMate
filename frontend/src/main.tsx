import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { ThemeProvider } from '@/components/theme/theme-provider';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from './store';
// import WebSocketManager from '@/context/WebSocketManager.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="hackmate-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {/* <WebSocketManager /> */}
          <App />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </Provider>
);
