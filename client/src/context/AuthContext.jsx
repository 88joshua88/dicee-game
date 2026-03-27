import { createContext, useContext, useState } from 'react';

/**
 * AuthContext — global authentication state for EnergeX.
 *
 * Currently a stub — will be fully implemented in the Auth phase.
 * Placing it here now keeps the import paths stable across the codebase.
 *
 * Provides: { user, token, login, logout }
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Stub handlers — will call the auth API endpoints in the next phase
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Convenience hook
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
