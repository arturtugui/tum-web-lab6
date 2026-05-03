import { useState } from 'react'
import './ItemCard.css'

function ItemCard({ item }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="item-card">
      {/* Cover Image with Menu */}
      <div className="card-cover">
        <img src={item.coverUrl} alt={item.title} />
        
        {/* Action Menu - Top Right */}
        <div className="card-menu">
          <div className="action-menu">
            <button
              className="btn-menu"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="More actions"
            >
              ⋯
            </button>
            {menuOpen && (
              <div className="dropdown-menu">
                <button className="menu-item">View</button>
                <button className="menu-item">Edit</button>
                <button className="menu-item">Hide</button>
                <button className="menu-item menu-item-danger">Delete</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">{item.title}</h3>
          {item.rating && (
            <div className="card-rating">
              ⭐ {item.rating}/10
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="card-badges">
          <span className="badge badge-category">{item.category}</span>
          <span className={`badge badge-status badge-status-${item.status}`}>
            {item.status.replace('_', ' ')}
          </span>
        </div>

        {/* Notes */}
        {item.notes && (
          <p className="card-notes">{item.notes}</p>
        )}
      </div>
    </div>
  )
}

export default ItemCard
