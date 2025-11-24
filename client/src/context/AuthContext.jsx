import { createContext, useContext, useEffect, useState } from "react";
import { API } from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    async function loadUser() {
        try {
            const u = await API.get("/auth/me");
            setUser(u);
        } catch {
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

    const value = {
        user,
        setUser,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
