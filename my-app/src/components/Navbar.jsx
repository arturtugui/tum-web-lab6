import './Navbar.css'

function Navbar({ onAddClick }) {
  return (
    <nav className="navbar">
      <div className="navbar-title">MyInterestsSS</div>
      <div className="navbar-buttons">
        <button className="btn btn-add" onClick={onAddClick}>+ Add</button>
        <button className="btn btn-icon" aria-label="Toggle theme">🌙</button>
        <button className="btn btn-icon" aria-label="Switch role">👤</button>
      </div>
    </nav>
  )
}

export default Navbar
