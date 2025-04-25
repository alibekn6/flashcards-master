import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../api/auth';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await authApi.getCurrentUser();
          setUser(userData);
        } catch (err) {
          console.error('Failed to load user:', err);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);