'use client';

import { QueryClient, QueryClientProvider as TanstackProvider } from '@tanstack/react-query';
import { useState } from 'react';
import type { ReactNode } from 'react';

/**
 * TanStack Query provider — wraps the app with a QueryClient.
 *
 * Creates the QueryClient inside the component to avoid sharing state
 * between requests in SSR. Configured for typical API patterns:
 * - 5 min stale time (data doesn't refetch on every focus)
 * - 1 retry on failure
 * - Refetch on window focus (catch stale data after tab switch)
 */
import { GoogleOAuthProvider } from '@react-oauth/google';

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: true,
          },
        },
      }),
  );

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <TanstackProvider client={queryClient}>
        {children}
      </TanstackProvider>
    </GoogleOAuthProvider>
  );
}
