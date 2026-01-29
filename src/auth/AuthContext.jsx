import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../db/supaBaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("guest"); // <-- szerepkör tárolása

  useEffect(() => {
    // Betöltjük a session-t induláskor
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user || null;
      setUser(u);
      setRole(u?.user_metadata?.role || "guest"); // <-- szerepkör beállítása
    });

    // Figyeljük a Supabase auth változásokat
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const u = session?.user || null;
        setUser(u);
        setRole(u?.user_metadata?.role || "guest"); // <-- szerepkör frissítése
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // sikeres login után beállítjuk a usert és a szerepkört
    const u = data.user;
    setUser(u);
    if (u) {
  setRole(u.user_metadata?.role || "user");
} else {
  setRole("guest");
}


    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole("guest"); // <-- visszaállítjuk vendégre
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,               // <-- szerepkör átadása
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
