import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import styles from './NavBar.module.css';

export default function NavBar() {
    const { user, logout } = useAuth();

    return (
        <nav className={styles.nav}>
            <div className={styles.container}>
                <Link to="/" className={styles.brand}>RecipeShare</Link>

                <div className={styles.right}>
                    <Link to="/new" className="btn secondary">Add Recipe</Link>
                    <ThemeToggle />

                    {user ? (
                        <>
                            <span className={styles.user}>{user.display_name || user.email}</span>
                            <button className="btn" onClick={logout}>Logout</button>
                        </>
                    ) : (
                        <Link to="/login" className="btn">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
