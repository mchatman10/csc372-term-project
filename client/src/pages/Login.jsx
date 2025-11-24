import { useEffect } from "react";
import { API } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const { setUser } = useAuth();

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = initGoogle;
        document.body.appendChild(script);
    }, []);

    function initGoogle() {
        google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse,
        });
        google.accounts.id.renderButton(
            document.getElementById("google-signin-btn"),
            { theme: "outline", size: "large", width: "360" }
        );
    }

    async function handleGoogleResponse(resp) {
        try {
            const user = await API.post("/auth/google", { credential: resp.credential });
            setUser(user);
        } catch (e) {
            console.error(e);
            alert("Google login failed");
        }
    }

    return (
        <div className="container" style={{ maxWidth: 500 }}>
            <div className="card">
                <h2>Sign in</h2>
                <div id="google-signin-btn" style={{ marginTop: 16 }} />
            </div>
        </div>
    );
}
