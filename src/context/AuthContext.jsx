// import { createContext, useContext, useEffect, useState } from "react";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // 🔁 refresh után auth check
//   useEffect(() => {
//     fetch("http://localhost:3000/me", {
//       credentials: "include"
//     })
//       .then(res => res.ok ? res.json() : null)
//       .then(data => {
//         setUser(data);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, []);

//   const login = async (email, password) => {
//     const res = await fetch("http://localhost:3000/login", {
//       method: "POST",
//       credentials: "include",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password })
//     });

//     if (!res.ok) throw new Error("Login failed");

//     const data = await res.json();
//     setUser(data);
//   };

//   const logout = async () => {
//     await fetch("http://localhost:3000/logout", {
//       method: "POST",
//       credentials: "include"
//     });
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);
