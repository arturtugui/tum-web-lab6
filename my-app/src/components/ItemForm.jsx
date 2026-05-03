import { useState, useEffect } from 'react'
import { useCollection } from '../context/CollectionContext'
import './ItemForm.css'

const CATEGORIES = ['movie', 'series', 'anime', 'game', 'manga', 'comic', 'book', 'album', 'youtube']
const STATUSES = ['planned', 'in_progress', 'completed', 'dropped']

// Category-specific fields mapping
const CATEGORY_FIELDS = {
  movie: ['genres'],
  series: ['genres', 'episodes'],
  anime: ['genres', 'episodes'],
  game: ['platform', 'developer'],
  manga: ['author', 'chapters'],
  comic: ['author', 'chapters'],
  book: ['author', 'pages'],
  album: ['artist', 'year'],
  youtube: ['channelUrl', 'uploadFrequency']
}

function ItemForm({ mode = 'add', item = null, onClose }) {
  const { dispatch } = useCollection()
  
  const [formData, setFormData] = useState({
    title: item?.title || '',
    category: item?.category || 'movie',
    status: item?.status || 'planned',
    rating: item?.rating || null,
    coverUrl: item?.coverUrl || '',
    notes: item?.notes || '',
    ...getCategoryFields(item?.category || 'movie', item)
  })

  function getCategoryFields(category, existingItem) {
    const fields = {}
    const categorySpecific = CATEGORY_FIELDS[category] || []
    categorySpecific.forEach(field => {
      fields[field] = existingItem?.[field] || ''
    })
    return fields
  }

  // Update category-specific fields when category changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      ...getCategoryFields(prev.category, item)
    }))
  }, [formData.category])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? (value === '' ? null : parseInt(value)) : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.title.trim() || !formData.coverUrl.trim()) {
      alert('Please fill in title and cover URL')
      return
    }

    const payload = {
      ...formData,
      id: mode === 'edit' ? item.id : Date.now() + Math.random(),
      isHidden: mode === 'edit' ? item.isHidden : false
    }

    // Remove empty category-specific fields
    Object.keys(payload).forEach(key => {
      if (payload[key] === '') {
        delete payload[key]
      }
    })

    if (mode === 'add') {
      dispatch({ type: 'ADD_ITEM', payload })
    } else {
      dispatch({ type: 'EDIT_ITEM', payload })
    }

    onClose()
  }

  const categorySpecificFields = CATEGORY_FIELDS[formData.category] || []

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'add' ? 'Add Item' : 'Edit Item'}</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="item-form">
          {/* Always shown fields */}
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Breaking Bad"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                {STATUSES.map(status => (
                  <option key={status} value={status}>
                    {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Rating (1-10)</label>
              <input
                type="number"
                name="rating"
                value={formData.rating || ''}
                onChange={handleChange}
                min="1"
                max="10"
                placeholder="e.g., 9"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Cover URL *</label>
            <input
              type="url"
              name="coverUrl"
              value={formData.coverUrl}
              onChange={handleChange}
              placeholder="https://..."
              required
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any notes..."
              rows="3"
            />
          </div>

          {/* Category-specific fields */}
          {categorySpecificFields.length > 0 && (
            <fieldset className="category-fields">
              <legend>Category Details</legend>
              <div className="form-row">
                {categorySpecificFields.map(field => (
                  <div key={field} className="form-group">
                    <label>{formatLabel(field)}</label>
                    <input
                      type={getInputType(field)}
                      name={field}
                      value={formData[field] || ''}
                      onChange={handleChange}
                      placeholder={getPlaceholder(field)}
                    />
                  </div>
                ))}
              </div>
            </fieldset>
          )}

          {/* Form actions */}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              {mode === 'add' ? 'Add Item' : 'Update Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Helper functions
function formatLabel(fieldName) {
  return fieldName
    .replace(/([A-Z])/g, ' $1')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function getInputType(field) {
  if (field.includes('Url') || field === 'channelUrl') return 'url'
  if (field === 'episodes' || field === 'chapters' || field === 'pages' || field === 'year') return 'number'
  return 'text'
}

function getPlaceholder(field) {
  const placeholders = {
    genres: 'e.g., Drama, Crime',
    episodes: 'e.g., 62',
    platform: 'e.g., PC, PlayStation',
    developer: 'e.g., FromSoftware',
    author: 'e.g., Frank Herbert',
    chapters: 'e.g., 150',
    pages: 'e.g., 688',
    artist: 'e.g., Taylor Swift',
    year: 'e.g., 2023',
    channelUrl: 'https://...',
    uploadFrequency: 'e.g., Weekly'
  }
  return placeholders[field] || ''
}

export default ItemForm
