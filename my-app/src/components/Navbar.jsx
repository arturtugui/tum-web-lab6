import { useUI } from '../context/UIContext'
import { useTheme } from '../context/ThemeContext'
import './Navbar.css'

function Navbar() {
  const { openAddModal } = useUI()
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="navbar">
      <div className="navbar-title">MyInterestsSS</div>
      <div className="navbar-buttons">
        <button className="btn btn-add" onClick={openAddModal}>+ Add</button>
        <button 
          className="btn btn-icon" 
          aria-label="Toggle theme"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <button className="btn btn-icon" aria-label="Switch role">👤</button>
      </div>
    </nav>
  )
}

export default Navbar
