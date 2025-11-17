import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

const storageKey = 'cryptoguard-auth';

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : { user: null, token: null };
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state]);

  const value = useMemo(
    () => ({
      ...state,
      isAuthenticated: Boolean(state.token),
      login: ({ user, token }) => setState({ user, token }),
      logout: () => setState({ user: null, token: null }),
    }),
    [state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
