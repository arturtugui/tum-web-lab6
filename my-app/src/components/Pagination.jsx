import './Pagination.css'

export function Pagination({ currentPage, totalPages, onPageChange }) {
  const isFirstPage = currentPage === 0
  const isLastPage = currentPage >= totalPages - 1

  if (totalPages <= 1) {
    return null // Don't show pagination if only 1 page
  }

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirstPage}
      >
        ← Previous
      </button>

      <span className="pagination-info">
        Page {currentPage + 1} of {totalPages}
      </span>

      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLastPage}
      >
        Next →
      </button>
    </div>
  )
}
