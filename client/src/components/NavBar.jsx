import { Link, useNavigate } from 'react-router-dom'
import styles from './NavBar.module.css'
import { useAuth } from '../context/AuthContext.jsx'

export default function NavBar() {
  const { user, logout } = useAuth()
  const nav = useNavigate()

  async function handleLogout() {
    await logout()
    nav('/login')
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link to="/" className={styles.brand}>RecipeShare</Link>

        <div className={styles.right}>
          <Link className="btn secondary" to="/new">Add Recipe</Link>

          {user ? (
            <>
              <span className={styles.user}>{user.display_name || user.email}</span>
              <button className="btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link className="btn" to="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  )
}
