'use client';

import localFont from 'next/font/local';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Sidebar from '../components/sidebar';
import './globals.css';

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
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const isLoginOrRootPage = pathname === '/login' || pathname === '/';

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex h-screen w-full bg-gray-100">
          {!isLoginOrRootPage && (
            <Sidebar
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          )}
          <div
            className={`flex flex-col w-full h-full transition-all duration-300
              ${isLoginOrRootPage ? '' : isCollapsed ? 'ml-20' : 'ml-64'} p-4`}
          >
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
