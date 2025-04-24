'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LogoutDialogProps {
  isCollapsed?: boolean;
}

export function LogoutDialog({ isCollapsed }: LogoutDialogProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('role');
    router.push('/login');
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className={`w-full flex items-center gap-3 text-sm justify-${isCollapsed ? 'center' : 'start'} h-9 text-red-500 hover:text-red-500 hover:bg-red-500/10`}
        >
          <LogOut size={18} />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
          <AlertDialogDescription>
            You will be redirected to the login page.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600"
          >
            Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
