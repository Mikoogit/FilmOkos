import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../db/supaBaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("guest");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user || null;
      setUser(u);

      if (u) {
        loadRole(u.id);
      } else {
        setRole("guest");
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const u = session?.user || null;
        setUser(u);

        if (u) {
          loadRole(u.id);
        } else {
          setRole("guest");
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // 🔥 Szerepkör betöltése a profiles táblából
  const loadRole = async (userId) => {
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    setRole(data?.role || "guest");
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const u = data.user;
    setUser(u);

    if (u) {
      await loadRole(u.id);
    } else {
      setRole("guest");
    }

    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole("guest");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        setRole,   // 🔥 EZ KELL A ROLE VÁLTÁSHOZ
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
