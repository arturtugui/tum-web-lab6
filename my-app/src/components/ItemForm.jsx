import { useState, useEffect } from 'react'
import { useCollection } from '../context/CollectionContext'
import { useUI } from '../context/UIContext'
import './ItemForm.css'

// ============================================================================
// CONSTANTS - Define the available options for dropdowns
// ============================================================================

// List of all possible categories a user can choose from
const CATEGORIES = ['movie', 'series', 'anime', 'game', 'manga', 'comic', 'book', 'album', 'youtube']

// List of all possible statuses for an item
const STATUSES = ['planned', 'in_progress', 'completed', 'dropped']

// Mapping of category → additional fields that should appear
// For example, a "movie" shows "genres" input, but a "game" shows "platform" and "developer"
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

// ============================================================================
// COMPONENT: ItemForm
// ============================================================================
// No props needed - gets all state directly from UIContext and CollectionContext
function ItemForm() {
  // Get modal state and UI actions from UIContext
  const { modalMode, editingItem, closeModal } = useUI()
  
  // Get the dispatch function from CollectionContext to send actions to reducer
  const { dispatch } = useCollection()
  
  // For easier reading, alias these values
  const mode = modalMode
  const item = editingItem
  const onClose = closeModal
  
  // ========================================================================
  // STATE: formData - holds all the form input values
  // ========================================================================
  // When editing, pre-fill with existing item data using the optional chaining operator (?.)
  // When adding, start with empty strings / defaults
  const [formData, setFormData] = useState({
    title: item?.title || '',
    category: item?.category || 'movie',
    status: item?.status || 'planned',
    rating: item?.rating || null,
    coverUrl: item?.coverUrl || '',
    notes: item?.notes || '',
    // Also include any category-specific fields (genres, platform, etc.)
    ...getCategoryFields(item?.category || 'movie', item)
  })

  // ========================================================================
  // HELPER FUNCTION: getCategoryFields
  // ========================================================================
  // Purpose: Get the extra fields for a specific category
  // Example: if category is 'game', return { platform: '', developer: '' }
  function getCategoryFields(category, existingItem) {
    const fields = {}
    // Look up which fields this category needs from CATEGORY_FIELDS constant
    const categorySpecific = CATEGORY_FIELDS[category] || []
    // For each field, add it to our object with the existing value or empty string
    categorySpecific.forEach(field => {
      fields[field] = existingItem?.[field] || ''
    })
    return fields
  }

  // ========================================================================
  // EFFECT: When user changes the category dropdown, update the form fields
  // ========================================================================
  // This runs whenever formData.category changes
  // It clears old category fields and loads new ones for the selected category
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      // Spread all existing form data, then overwrite with new category fields
      ...getCategoryFields(prev.category, item)
    }))
    // Dependency array: only re-run when category changes
  }, [formData.category])

  // ========================================================================
  // EVENT HANDLER: handleChange - Update formData when user types in inputs
  // ========================================================================
  const handleChange = (e) => {
    const { name, value } = e.target // Get the input field name and new value
    setFormData(prev => ({
      ...prev,
      // For rating field, convert to number; for others, keep as string
      [name]: name === 'rating' ? (value === '' ? null : parseInt(value)) : value
    }))
  }

  // ========================================================================
  // EVENT HANDLER: handleSubmit - Handle form submission (Add/Edit button)
  // ========================================================================
  const handleSubmit = (e) => {
    // Prevent page reload on form submit
    e.preventDefault()
    
    // VALIDATION: Check that required fields are filled
    if (!formData.title.trim() || !formData.coverUrl.trim()) {
      alert('Please fill in title and cover URL')
      return
    }

    // BUILD PAYLOAD: Create the object to send to the reducer
    const payload = {
      ...formData, // Include all form data
      // For add mode: create new ID (timestamp + random); for edit: keep existing ID
      id: mode === 'edit' ? item.id : Date.now() + Math.random(),
      // For add mode: always unhidden; for edit: keep existing hidden status
      isHidden: mode === 'edit' ? item.isHidden : false
    }

    // CLEAN UP: Remove empty category-specific fields from payload
    // This prevents sending empty strings for unused fields
    Object.keys(payload).forEach(key => {
      if (payload[key] === '') {
        delete payload[key]
      }
    })

    // DISPATCH: Send action to reducer with the payload
    if (mode === 'add') {
      dispatch({ type: 'ADD_ITEM', payload })
    } else {
      dispatch({ type: 'EDIT_ITEM', payload })
    }

    // Close the modal after successful submission
    onClose()
  }

  // Get the category-specific fields for current selected category
  const categorySpecificFields = CATEGORY_FIELDS[formData.category] || []

  // ========================================================================
  // RENDER: Return the JSX (HTML-like code)
  // ========================================================================
  return (
    // Modal overlay: semi-transparent background that closes modal when clicked
    <div className="modal-overlay" onClick={onClose}>
      {/* Modal content: the form itself - stop click propagation so it doesn't close on click */}
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        
        {/* Header: Title and close button */}
        <div className="modal-header">
          <h2>{mode === 'add' ? 'Add Item' : 'Edit Item'}</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        {/* Form container */}
        <form onSubmit={handleSubmit} className="item-form">
          
          {/* ===== ALWAYS SHOWN FIELDS ===== */}
          
          {/* Title input - required field */}
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

          {/* Category and Status dropdowns - side by side */}
          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              {/* Changing this category will trigger useEffect to update category-specific fields */}
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                {/* Map through CATEGORIES constant to create <option> elements */}
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {/* Capitalize first letter: 'movie' → 'Movie' */}
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
                {/* Map through STATUSES to create <option> elements */}
                {STATUSES.map(status => (
                  <option key={status} value={status}>
                    {/* Convert 'in_progress' → 'In progress' */}
                    {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Rating input - optional, 1-10 */}
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

          {/* Cover URL input - required field */}
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

          {/* Notes textarea - optional, for user's own notes */}
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

          {/* ===== CATEGORY-SPECIFIC FIELDS (DYNAMIC) ===== */}
          {/* Only show this section if the current category has extra fields */}
          {categorySpecificFields.length > 0 && (
            <fieldset className="category-fields">
              <legend>Category Details</legend>
              <div className="form-row">
                {/* For each category-specific field, create an input */}
                {categorySpecificFields.map(field => (
                  <div key={field} className="form-group">
                    <label>{formatLabel(field)}</label>
                    {/* Determine correct input type based on field name (URL, number, or text) */}
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

          {/* ===== FORM ACTIONS (Cancel & Submit buttons) ===== */}
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

// ============================================================================
// HELPER FUNCTIONS (at the bottom)
// ============================================================================

// Convert field name to human-readable label
// 'channelUrl' → 'Channel Url'
function formatLabel(fieldName) {
  return fieldName
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(' ')
}

// Determine the HTML input type based on field name
// 'year', 'episodes' → number input
// 'channelUrl' → URL input
// others → text input
function getInputType(field) {
  if (field.includes('Url') || field === 'channelUrl') return 'url'
  if (field === 'episodes' || field === 'chapters' || field === 'pages' || field === 'year') return 'number'
  return 'text'
}

// Provide helpful placeholder text for each field
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
