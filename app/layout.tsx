import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { Lato } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';
import StoreProvider from '@/redux/StoreProvider';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export const metadata: Metadata = {
  title: 'Next Shadcn',
  description: 'Basic dashboard with Next.js and Shadcn'
};

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap'
});

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // const session = await auth();
  const session = await getServerSession(authOptions);
  return (
    <html
      lang="en"
      className={`${lato.className}`}
      suppressHydrationWarning={true}
    >
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
      </head>
      <body className={'overflow-hidden'}>
        <StoreProvider>
          <NextTopLoader showSpinner={false} />
          <Providers session={session}>
            <Toaster />
            {children}
          </Providers>
        </StoreProvider>
      </body>
    </html>
  );
}
