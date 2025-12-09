import { createContext, useContext, useEffect, useState } from "react";
import { API } from "../util/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  async function loadUser() {
    try {
      const u = await API.get("/auth/me");
      setUser(u);
    } catch (err) {
      setUser(null);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  async function logout() {
    await API.post("/auth/logout");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
