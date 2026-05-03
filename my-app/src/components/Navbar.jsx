import { useUI } from '../context/UIContext'
import './Navbar.css'

function Navbar() {
  const { openAddModal } = useUI()

  return (
    <nav className="navbar">
      <div className="navbar-title">MyInterestsSS</div>
      <div className="navbar-buttons">
        <button className="btn btn-add" onClick={openAddModal}>+ Add</button>
        <button className="btn btn-icon" aria-label="Toggle theme">🌙</button>
        <button className="btn btn-icon" aria-label="Switch role">👤</button>
      </div>
    </nav>
  )
}

export default Navbar
