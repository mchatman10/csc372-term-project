import { createContext, useContext, useState } from "react";
import { API } from "../api";

const AuthCtx = createContext();
export function useAuth() { return useContext(AuthCtx); }

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    async function logout() {
        try { await API.post("/auth/logout"); } catch { }
        setUser(null);
    }

    return (
        <AuthCtx.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthCtx.Provider>
    );
}
