'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';

// Create a client
const queryClient = new QueryClient();

interface RootProviderProps {
  children: React.ReactNode;
}

const RootProviders = ({ children }: RootProviderProps) => {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute='class'
        defaultTheme='system'
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default RootProviders;
