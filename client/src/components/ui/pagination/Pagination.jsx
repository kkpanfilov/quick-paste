import { useEffect, useState } from "react";

import styles from "./Pagination.module.scss";

export const Pagination = ({
  currentPage,
  totalPages,
  pageLimit,
  onPageChange,
}) => {
  const [activePage, setActivePage] = useState(currentPage);

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const visiblePageLimit = Math.min(pageLimit, totalPages);

  let startPage = activePage - Math.floor(visiblePageLimit / 2);
  let endPage = startPage + visiblePageLimit - 1;

  if (startPage < 1) {
    startPage = 1;
    endPage = visiblePageLimit;
  }

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(totalPages - visiblePageLimit + 1, 1);
  }

  const visiblePages = pages.slice(startPage - 1, endPage);
  const beforeCurrentPage = visiblePages.filter((page) => page < activePage);
  const afterCurrentPage = visiblePages.filter((page) => page > activePage);

  useEffect(() => onPageChange(activePage), [activePage, onPageChange]);

  return (
    <nav className={styles.pagination} aria-label="Pastes pagination">
      <button
        className={styles.paginationButton}
        type="button"
        disabled={activePage <= 1}
        aria-label="Previous page"
        onClick={() => setActivePage(activePage - 1)}
      >
        Prev
      </button>

      <div className={styles.paginationPages}>
        {!visiblePages.includes(1) && (
          <>
            <button
              className={`${styles.paginationButton}`}
              type="button"
              onClick={() => setActivePage(1)}
            >
              1
            </button>
            <span className={`${styles.paginationDots}`}>...</span>
          </>
        )}
        {beforeCurrentPage.map((page) => (
          <button
            key={page}
            className={`${styles.paginationButton}`}
            type="button"
            onClick={() => setActivePage(page)}
          >
            {page}
          </button>
        ))}
        <button
          className={`${styles.paginationButton} ${styles.paginationButtonActive}`}
          type="button"
          aria-current="page"
        >
          {activePage}
        </button>
        {afterCurrentPage.map((page) => (
          <button
            key={page}
            className={`${styles.paginationButton}`}
            type="button"
            onClick={() => setActivePage(page)}
          >
            {page}
          </button>
        ))}

        {!visiblePages.includes(totalPages) && (
          <>
            <span className={`${styles.paginationDots}`}>...</span>
            <button
              className={`${styles.paginationButton}`}
              type="button"
              onClick={() => setActivePage(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        className={styles.paginationButton}
        type="button"
        aria-label="Next page"
        disabled={activePage >= totalPages}
        onClick={() => setActivePage(activePage + 1)}
      >
        Next
      </button>
    </nav>
  );
};
