import '@/app/globals.css';
import { auth } from '@/auth';
import RootProviders from '@/components/providers/RootProviders';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Inter as FontSans } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Time Table App',
  description: 'Generated by authomatic time table',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang='en' suppressHydrationWarning>
        <body
          className={cn(
            'min-h-screen bg-background font-sans antialiased grid place-content-center',
            fontSans.variable
          )}
        >
          <RootProviders>
            {children}
            <ToastContainer theme='dark' />
          </RootProviders>
        </body>
      </html>
    </SessionProvider>
  );
}
