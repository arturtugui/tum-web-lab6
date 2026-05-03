import { useUI } from '../context/UIContext'
import './ItemView.css'

function ItemView() {
  const { viewingItem, closeItemView } = useUI()

  if (!viewingItem) return null

  // Category-specific field labels
  const categoryFieldLabels = {
    movie: { genres: 'Genres' },
    series: { genres: 'Genres', episodes: 'Episodes' },
    anime: { genres: 'Genres', episodes: 'Episodes' },
    game: { platform: 'Platform', developer: 'Developer' },
    manga: { author: 'Author', chapters: 'Chapters' },
    comic: { author: 'Author', chapters: 'Chapters' },
    book: { author: 'Author', pages: 'Pages' },
    album: { artist: 'Artist', year: 'Year' },
    youtube: { channelUrl: 'Channel URL', uploadFrequency: 'Upload Frequency' },
  }

  const fields = categoryFieldLabels[viewingItem.category] || {}

  const formatStatus = (status) => {
    return status.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const formatCategory = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1)
  }

  return (
    <div className="item-view-overlay" onClick={closeItemView}>
      <div className="item-view-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header with close button */}
        <div className="item-view-header">
          <h2>{viewingItem.title}</h2>
          <button className="item-view-close" onClick={closeItemView} aria-label="Close">✕</button>
        </div>

        {/* Main content */}
        <div className="item-view-content">
          {/* Cover image */}
          <div className="item-view-image-section">
            <img
              src={viewingItem.coverUrl}
              alt={viewingItem.title}
              className="item-view-image"
            />
          </div>

          {/* Details */}
          <div className="item-view-details">
            {/* Quick info */}
            <div className="quick-info">
              <div className="info-badge category-badge">{formatCategory(viewingItem.category)}</div>
              <div className={`info-badge status-badge status-${viewingItem.status}`}>
                {formatStatus(viewingItem.status)}
              </div>
              {viewingItem.rating && (
                <div className="info-badge rating-badge">⭐ {viewingItem.rating}/10</div>
              )}
            </div>

            {/* Notes section */}
            {viewingItem.notes && (
              <div className="details-section">
                <h3 className="section-title">Notes</h3>
                <p className="section-content">{viewingItem.notes}</p>
              </div>
            )}

            {/* Category-specific fields */}
            {Object.keys(fields).length > 0 && (
              <div className="details-section">
                <h3 className="section-title">Details</h3>
                <div className="fields-grid">
                  {Object.keys(fields).map((key) => (
                    viewingItem[key] && (
                      <div key={key} className="field-item">
                        <span className="field-label">{fields[key]}:</span>
                        <span className="field-value">
                          {typeof viewingItem[key] === 'object'
                            ? JSON.stringify(viewingItem[key])
                            : viewingItem[key]}
                        </span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Full info table */}
            <div className="details-section">
              <h3 className="section-title">All Information</h3>
              <table className="info-table">
                <tbody>
                  <tr>
                    <td className="info-label">Title</td>
                    <td className="info-value">{viewingItem.title}</td>
                  </tr>
                  <tr>
                    <td className="info-label">Category</td>
                    <td className="info-value">{formatCategory(viewingItem.category)}</td>
                  </tr>
                  <tr>
                    <td className="info-label">Status</td>
                    <td className="info-value">{formatStatus(viewingItem.status)}</td>
                  </tr>
                  <tr>
                    <td className="info-label">Rating</td>
                    <td className="info-value">{viewingItem.rating ? `${viewingItem.rating}/10` : 'Not rated'}</td>
                  </tr>
                  <tr>
                    <td className="info-label">Cover URL</td>
                    <td className="info-value" style={{ fontSize: '0.85rem', wordBreak: 'break-all' }}>
                      {viewingItem.coverUrl}
                    </td>
                  </tr>
                  {viewingItem.isHidden && (
                    <tr>
                      <td className="info-label">Status</td>
                      <td className="info-value" style={{ color: 'var(--text-secondary)' }}>
                        🔒 Archived (Hidden)
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="item-view-footer">
          <button className="btn btn-primary" onClick={closeItemView}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ItemView
