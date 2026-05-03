import { useState } from 'react'
import { useCollection } from '../context/CollectionContext'
import './ItemCard.css'

function ItemCard({ item }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { dispatch } = useCollection()

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
                <button className="menu-item" onClick={() => console.log('Viewing item:', item)}>
                  View
                </button>
                <button className="menu-item" onClick={() => dispatch({ type: 'EDIT_ITEM', payload: item})}>
                  Edit
                </button>
                <button className="menu-item" onClick={() => dispatch({ type: 'HIDE_ITEM', payload: item.id })}>
                  Hide
                </button>
                <button className="menu-item menu-item-danger" onClick={() => dispatch({ type: 'DELETE_ITEM', payload: item.id })}>
                  Delete
                </button>
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
