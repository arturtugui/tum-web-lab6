import { useUI } from '../context/UIContext'
import { useTheme } from '../context/ThemeContext'
import { useRole } from '../context/RoleContext'
import './Navbar.css'

function Navbar() {
  const { openAddModal } = useUI()
  const { theme, toggleTheme } = useTheme()
  const { role, toggleRole } = useRole()

  return (
    <nav className="navbar">
      <div className="navbar-title">MyInterestsSS</div>
      <div className="navbar-buttons">
        {role === 'owner' && (
          <button className="btn btn-add" onClick={openAddModal}>+ Add</button>
        )}
        <button 
          className="btn btn-icon" 
          aria-label="Toggle theme"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <button 
          className="btn btn-icon" 
          aria-label="Switch role"
          onClick={toggleRole}
          title={`Current role: ${role}. Click to switch.`}
        >
          👤 {role === 'owner' ? 'Owner' : 'Viewer'}
        </button>
      </div>
    </nav>
  )
}

export default Navbar
