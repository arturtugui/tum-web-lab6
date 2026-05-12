import { useState } from 'react'
import { useCollection } from '../context/CollectionContext'
import { useUI } from '../context/UIContext'
import { useRole } from '../context/RoleContext'
import './ItemCard.css'

function ItemCard({ item }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { deleteItem: deleteItemAPI, hideItem: hideItemAPI } = useCollection()
  const { openEditModal, openItemView } = useUI()
  const { role } = useRole()

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteItemAPI(item.id)
    } catch (err) {
      console.error('Delete failed:', err)
      alert('Failed to delete item')
    } finally {
      setIsDeleting(false)
      setMenuOpen(false)
    }
  }

  const handleHide = async () => {
    try {
      await hideItemAPI(item.id)
    } catch (err) {
      console.error('Hide failed:', err)
      alert('Failed to hide item')
    } finally {
      setMenuOpen(false)
    }
  }

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
                <button className="menu-item" onClick={() => {
                  openItemView(item)
                  setMenuOpen(false)
                }}>
                  View
                </button>
                {role === 'owner' && (
                  <>
                    <button className="menu-item" onClick={() => {
                      openEditModal(item)
                      setMenuOpen(false)
                    }}>
                      Edit
                    </button>
                    <button 
                      className="menu-item" 
                      onClick={handleHide}
                      disabled={isDeleting}
                    >
                      Hide
                    </button>
                    <button 
                      className="menu-item menu-item-danger" 
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete "${item.title}"? This action cannot be undone.`)) {
                          handleDelete()
                        } else {
                          setMenuOpen(false)
                        }
                      }}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </>
                )}
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
