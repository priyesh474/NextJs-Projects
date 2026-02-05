"use client";

import styles from "./Pagination.module.css";

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  itemsPerPage = 6,
  totalItems 
}) {
  if (!totalPages || totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage <= 3) {
        // Show first 5 pages
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        // Show last 5 pages
        for (let i = totalPages - 4; i <= totalPages; i++) {
          if (i > 1) pages.push(i);
        }
      } else {
        // Show pages around current
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
      }
      
      // Always show last page if not already included
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={styles.pagination}>
      <div className={styles.info}>
        Showing {startItem}-{endItem} of {totalItems} results
      </div>
      
      <div className={styles.controls}>
        <button
          className={styles.navButton}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className={styles.pageNumbers}>
          {pageNumbers.map((pageNum, index) => {
            // Add ellipsis before if there's a gap
            const showEllipsisBefore = index > 0 && pageNum - pageNumbers[index - 1] > 1;
            
            return (
              <div key={pageNum} className={styles.pageGroup}>
                {showEllipsisBefore && (
                  <span className={styles.ellipsis}>...</span>
                )}
                <button
                  className={`${styles.pageButton} ${
                    currentPage === pageNum ? styles.active : ""
                  }`}
                  onClick={() => onPageChange(pageNum)}
                  aria-label={`Go to page ${pageNum}`}
                  aria-current={currentPage === pageNum ? "page" : undefined}
                >
                  {pageNum}
                </button>
              </div>
            );
          })}
        </div>

        <button
          className={styles.navButton}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
