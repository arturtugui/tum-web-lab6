import './FilterBar.css'

function FilterBar() {
  const categories = ['All', 'Movies', 'Series', 'Anime', 'Games', 'Manga', 'Comics', 'Books', 'Albums', 'YouTube']
  const statuses = ['All', 'Planned', 'In Progress', 'Completed', 'Dropped']

  return (
    <div className="filter-bar">
      {/* Category Tabs */}
      <div className="filter-section">
        <div className="category-tabs">
          {categories.map((cat) => (
            <button key={cat} className="tab-btn tab-btn-active">
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Status Filter & Search */}
      <div className="filter-controls">
        <select className="filter-dropdown">
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <input
          type="text"
          className="search-input"
          placeholder="Search by title..."
        />
      </div>
    </div>
  )
}

export default FilterBar
