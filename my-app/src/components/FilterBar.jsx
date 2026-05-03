import { useFilter } from '../context/FilterContext.jsx'
import './FilterBar.css'

function FilterBar() {
  const { activeCategory, setActiveCategory, activeStatus, setActiveStatus } = useFilter()

  const categories = [
    { label: 'All', value: 'all' },
    { label: 'Movies', value: 'movie' },
    { label: 'Series', value: 'series' },
    { label: 'Anime', value: 'anime' },
    { label: 'Games', value: 'game' },
    { label: 'Manga', value: 'manga' },
    { label: 'Comics', value: 'comic' },
    { label: 'Books', value: 'book' },
    { label: 'Albums', value: 'album' },
    { label: 'YouTube', value: 'youtube' },
  ]

  const statuses = [
    { label: 'All', value: 'all' },
    { label: 'Planned', value: 'planned' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' },
    { label: 'Dropped', value: 'dropped' },
  ]

  return (
    <div className="filter-bar">
      {/* Category Tabs */}
      <div className="filter-section">
        <div className="category-tabs">
          {categories.map((cat) => (
            <button
              key={cat.value}
              className={`tab-btn ${activeCategory === cat.value ? 'tab-btn-active' : ''}`}
              onClick={() => setActiveCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Status Filter & Search */}
      <div className="filter-controls">
        <select
          className="filter-dropdown"
          value={activeStatus}
          onChange={(e) => setActiveStatus(e.target.value)}
        >
          {statuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
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
