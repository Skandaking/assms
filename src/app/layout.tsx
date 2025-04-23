'use client';

import AppHeader from '@/components/layout/AppHeader';
import { SidebarProvider } from '@/context/SidebarContext';
import { UserProvider } from '@/context/UserContext';
import localFont from 'next/font/local';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import './globals.css';
import { Inter } from 'next/font/google';

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

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const isLoginOrRootPage = pathname === '/login' || pathname === '/';

  // Apply styling to ensure no top margin/padding for the login page
  useEffect(() => {
    if (isLoginOrRootPage) {
      // Add this style for login page to ensure no unwanted space
      const style = document.createElement('style');
      style.id = 'login-styles';
      style.innerHTML = `
        html, body { 
          margin: 0 !important; 
          padding: 0 !important; 
          height: 100% !important; 
          width: 100% !important;
          overflow-x: hidden !important;
        }
        #login-container, header, body > div {
          margin-top: 0 !important;
          padding-top: 0 !important;
        }
      `;
      document.head.appendChild(style);

      return () => {
        const styleElement = document.getElementById('login-styles');
        if (styleElement) styleElement.remove();
      };
    }
  }, [isLoginOrRootPage]);

  return (
    <html lang="en" className="h-full m-0 p-0">
      <head>
        <style>
          {`
            html, body { 
              margin: 0 !important; 
              padding: 0 !important; 
              height: 100%; 
              width: 100%;
              overflow-x: hidden;
            }
          `}
        </style>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${inter.className} h-full m-0 p-0`}
      >
        <UserProvider>
          <SidebarProvider>
            <div
              className={`flex h-screen w-full ${isLoginOrRootPage ? 'overflow-hidden' : 'bg-gray-100'}`}
              style={{ margin: 0, padding: 0 }}
            >
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
                className={`flex flex-col w-full h-full transition-all duration-300 ${
                  !isLoginOrRootPage
                    ? `pt-16 ${isCollapsed ? 'ml-20' : 'ml-64'}`
                    : 'm-0 p-0'
                }`}
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
