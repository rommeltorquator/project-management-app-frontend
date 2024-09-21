import { createContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

interface AuthContextType {
  token: string | null;
  setAuthData: (data: { token: string | null }) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  setAuthData: () => {},
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(() => {
    return Cookies.get('token') || null;
  });

  const setAuthData = (data: { token: string | null }) => {
    setToken(data.token);
    if (data.token) {
      // Set cookie with desired attributes
      Cookies.set('token', data.token, {
        expires: 7,
        secure: true,
        sameSite: 'Strict'
      });
    } else {
      // Remove the cookie
      Cookies.remove('token');
    }
  };

  // Effect to synchronize token changes with cookies
  useEffect(() => {
    if (token) {
      Cookies.set('token', token, {
        expires: 7,
        secure: true,
        sameSite: 'Strict',
      });
    } else {
      Cookies.remove('token');
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};
