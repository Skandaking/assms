'use client';

import AppHeader from '@/components/layout/AppHeader';
import { SidebarProvider } from '@/context/SidebarContext';
import { UserProvider } from '@/context/UserContext';
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
        <UserProvider>
          <SidebarProvider>
            <div className="flex h-screen w-full bg-gray-100">
              {!isLoginOrRootPage && (
                <>
                  <Sidebar
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                  />
                  <AppHeader isCollapsed={isCollapsed} />
                </>
              )}
              <div
                className={`flex flex-col w-full h-full transition-all duration-300 pt-16
                  ${isLoginOrRootPage ? '' : isCollapsed ? 'ml-20' : 'ml-64'}`}
              >
                {children}
              </div>
            </div>
          </SidebarProvider>
        </UserProvider>
      </body>
    </html>
  );
}
