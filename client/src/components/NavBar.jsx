import React from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "../styles/NavBar.module.css";

export default function NavBar() {
  const { user, logout } = useAuth();
  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>RecipeShare</Link>
        <div className={styles.actions}>
          <Link to="/new" className={styles.btnSecondary}>Add Recipe</Link>
          <ThemeToggle />
          {user ? (
            <>
              <span className={styles.user}>{user.display_name || user.email}</span>
              <button className={styles.btn} onClick={logout}>Logout</button>
            </>
          ) : (
            <Link to="/login" className={styles.btn}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
