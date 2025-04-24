'use client';

import { ChevronDown, LogOut, Menu, Settings } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface AppHeaderProps {
  isCollapsed: boolean;
}

const AppHeader = ({ isCollapsed }: AppHeaderProps) => {
  const { user, loading } = useUser();
  const router = useRouter();

  // Get display name from user data, with fallbacks
  const getDisplayName = () => {
    if (!user) return 'Guest';

    // If we have firstname and lastname, use them
    if (user.firstname && user.lastname) {
      return `${user.firstname} ${user.lastname}`;
    }

    // If we have only one, use it
    if (user.firstname) return user.firstname;
    if (user.lastname) return user.lastname;

    // If we have username, use it
    if (user.username) return user.username;

    // Last resort
    return `User #${user.id}`;
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return 'U';

    if (user.firstname && user.lastname) {
      return `${user.firstname.charAt(0)}${user.lastname.charAt(0)}`.toUpperCase();
    }

    if (user.firstname) return user.firstname.charAt(0).toUpperCase();
    if (user.lastname) return user.lastname.charAt(0).toUpperCase();
    if (user.username) return user.username.charAt(0).toUpperCase();

    return 'U';
  };

  const handleLogout = async () => {
    // Clear user data from localStorage
    try {
      localStorage.removeItem('user');
    } catch (e) {
      console.warn('Error removing from localStorage:', e);
    }

    // Call logout API to clear cookies
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (e) {
      console.error('Error logging out:', e);
    }

    // Redirect to login page
    router.push('/login');
  };

  const handleProfileClick = () => {
    router.push('/profile');
  };

  return (
    <header
      className={`fixed top-0 right-0 border-b z-40 transition-all duration-300 h-16 bg-background ${
        isCollapsed ? 'left-[80px]' : 'left-[256px]'
      }`}
    >
      <div className="flex items-center justify-between h-full px-4">
        <div className="sm:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu size={20} />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              {/* Mobile sidebar content would go here */}
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          {loading ? (
            <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 px-2 gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-sm">
                    <span className="font-medium leading-none">
                      {getDisplayName()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user?.role || 'Guest'}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handleProfileClick}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-500 focus:text-red-500"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
