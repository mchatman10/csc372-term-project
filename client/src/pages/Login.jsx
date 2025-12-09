import { useState } from "react";
import { API } from "../util/api";
import { useAuth } from "../context/AuthContext";
import styles from "./Login.module.css";

export default function Login() {
  const { setUser } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", display_name: "" });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      let endpoint = isRegister ? "/auth/register" : "/auth/login";
      const user = await API.post(endpoint, form);
      setUser(user);
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{isRegister ? "Register" : "Login"}</h2>

      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        {isRegister && (
          <input
            type="text"
            name="display_name"
            placeholder="Display Name"
            value={form.display_name}
            onChange={handleChange}
            className={styles.input}
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className={styles.input}
        />

        <button type="submit" className={styles.button}>
          {isRegister ? "Create Account" : "Login"}
        </button>

        <p className={styles.switchText}>
          {isRegister ? "Have an account?" : "No account?"}
          <span
            className={styles.switchLink}
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? " Login" : " Register"}
          </span>
        </p>
      </form>
    </div>
  );
}
