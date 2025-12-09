import styles from './ThemeToggle.module.css'
import { useTheme } from '../context/ThemeContext'
export default function ThemeToggle() { const { theme, toggle } = useTheme(); return <button className={styles.toggle} onClick={toggle} title='Toggle theme'>{theme === 'dark' ? '🌙 Dark' : '☀️ Light'}</button> }