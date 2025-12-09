import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { setUser } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!window.google) return;

    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (resp) => {
        try {
          const u = await API.googleLogin(resp.credential);
          setUser(u);
          nav("/");
        } catch (e) {
          alert("Google login failed");
          console.error(e);
        }
      },
    });

    const div = document.getElementById("gbtn");
    google.accounts.id.renderButton(div, { theme: "outline", size: "large" });
    google.accounts.id.prompt();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>Sign in with Google</h2>
      <div id="gbtn"></div>
    </div>
  );
}
