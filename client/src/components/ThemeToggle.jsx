import { useTheme } from '../context/ThemeContext';
export default function ThemeToggle() {
    const { theme, toggle } = useTheme();
    return <button className="btn secondary" onClick={toggle}>{theme === 'dark' ? 'Light' : 'Dark'} Mode</button>;
}
