import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("guest");

  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed.user);
        setRole(parsed.user.role);
      } catch {
        localStorage.removeItem("auth");
      }
    }
  }, []);

  const login = (data) => {
    localStorage.setItem("auth", JSON.stringify(data));
    setUser(data.user);
    setRole(data.user.role);
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setUser(null);
    setRole("guest");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
