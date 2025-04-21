'use client';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  role: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  fetchUserProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      // First check if we have the user stored in localStorage
      const storedUser = localStorage.getItem('user');

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log('Stored user data:', parsedUser);

          // Check if the user data has the required fields
          if (!parsedUser.firstname || !parsedUser.lastname) {
            console.warn(
              'User data missing firstname or lastname:',
              parsedUser
            );

            // Try to recover by fetching from API
            const response = await fetch('/api/users/current');
            if (response.ok) {
              const userData = await response.json();
              console.log('Fetched user data from API:', userData);
              setUser(userData);
              localStorage.setItem('user', JSON.stringify(userData));
            } else {
              setUser(parsedUser); // Use what we have, even if incomplete
            }
          } else {
            setUser(parsedUser);
          }
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          localStorage.removeItem('user'); // Clear invalid data
          setUser(null);
        }
        setLoading(false);
        return;
      }

      // If we don't have the user stored, get the currently logged in user
      const response = await fetch('/api/users/current');

      if (!response.ok) {
        console.warn('Failed to fetch current user:', response.status);
        setUser(null);
        setLoading(false);
        return;
      }

      const userData = await response.json();
      console.log('Fetched user data from API:', userData);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, setUser, fetchUserProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
