'use client';

import { usePathname } from 'next/navigation';
import localFont from 'next/font/local';
import './globals.css';
import Sidebar from '../components/sidebar';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginOrRootPage = pathname === '/login' || pathname === '/';
  const isLoginPage = pathname === '/login';

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex h-screen w-full bg-gray-100">
          {!isLoginOrRootPage && <Sidebar />}
          <div
            className={`flex flex-col w-full h-full ${isLoginPage ? '' : 'ml-64'} p-4`}
          >
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
