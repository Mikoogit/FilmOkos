import { useAuth } from "./AuthContext";

export default function useRole() {
  const { role } = useAuth();

  return {
    role,
    isGuest: role === "guest",
    isUser: role === "user",
    isAdmin: role === "admin",
    hasRole: (roles) => roles.includes(role),
  };
}
