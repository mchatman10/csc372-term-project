import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import styles from "./NavBar.module.css";
import ThemeToggle from "./ThemeToggle";

export default function NavBar(){
  const { user, logout } = useAuth()
  const nav = useNavigate()
  async function onLogout(){ await logout(); nav('/') }
  return (
    <nav className="nav">
      <div className="container row" style={{justifyContent:'space-between'}}>
        <Link className="brand" to="/">RecipeShare</Link>
        <div className="right">
          <Link className="btn secondary" to="/new">Add Recipe</Link>
          <ThemeToggle />
          {user ? (<><span style={{color:'#b9bec7'}}>{user.display_name || user.email}</span><button className="btn" onClick={onLogout}>Logout</button></>)
                : (<Link className="btn" to="/login">Login</Link>)}
        </div>
      </div>
    </nav>
  )
}
