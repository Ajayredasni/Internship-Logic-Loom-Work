// src/components/custom_component/CustomPagination.jsx
import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "react-feather";

/**
 * CustomPagination Component - Industry Standard Pagination
 *
 * Features:
 * - First, Previous, Next, Last buttons
 * - Page number buttons (with ellipsis for many pages)
 * - Entries info (Showing 1 to 10 of 100 entries)
 * - Page size selector
 * - Responsive design (Bootstrap)
 * - Customizable styling
 *
 * @param {number} currentPage - Current active page (1-based)
 * @param {number} totalPages - Total number of pages
 * @param {number} pageSize - Items per page
 * @param {number} totalEntries - Total number of entries
 * @param {function} onPageChange - Callback when page changes (page) => {}
 * @param {function} onPageSizeChange - Callback when page size changes (newSize) => {}
 * @param {Array} pageSizeOptions - Available page sizes [10, 25, 50, 100]
 * @param {boolean} showPageSizeSelector - Show/hide page size dropdown
 * @param {boolean} showEntriesInfo - Show/hide "Showing X to Y of Z entries"
 * @param {number} maxVisiblePages - Max page numbers to show (default: 5)
 * @param {string} size - "sm" | "md" | "lg"
 * @param {string} className - Custom CSS class
 */

const CustomPagination = ({
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  totalEntries = 0,
  onPageChange = () => {},
  onPageSizeChange = () => {},
  pageSizeOptions = [10, 25, 50, 100],
  showPageSizeSelector = true,
  showEntriesInfo = true,
  maxVisiblePages = 5,
  size = "md",
  className = "",
}) => {
  //  Calculate entries info
  const startEntry = totalEntries > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endEntry = Math.min(currentPage * pageSize, totalEntries);

  //  Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  //  Handle page size change
  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    onPageSizeChange(newSize);
  };

  //  Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    // Adjust if at the beginning or end
    if (currentPage <= halfVisible) {
      endPage = Math.min(totalPages, maxVisiblePages);
    }
    if (currentPage >= totalPages - halfVisible) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
    }

    // Add first page + ellipsis if needed
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push("ellipsis-start");
      }
    }

    // Add visible pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis + last page if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("ellipsis-end");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  //  Size classes
  const sizeClasses = {
    sm: "btn-sm",
    md: "",
    lg: "btn-lg",
  };

  const buttonSize = sizeClasses[size];

  //  If no pages, don't show pagination
  if (totalPages <= 1 && !showPageSizeSelector && !showEntriesInfo) {
    return null;
  }

  return (
    <div
      className={`d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 ${className}`}
    >
      {/*  LEFT: Entries Info */}
      {showEntriesInfo && (
        <div className="text-muted small">
          Showing <strong>{startEntry}</strong> to <strong>{endEntry}</strong>{" "}
          of <strong>{totalEntries}</strong> entries
        </div>
      )}

      {/*  CENTER: Page Numbers */}
      {totalPages > 1 && (
        <nav aria-label="Pagination">
          <ul className="pagination mb-0">
            {/* First Page Button */}
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className={`page-link ${buttonSize}`}
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                aria-label="First Page"
              >
                <ChevronsLeft
                  size={size === "sm" ? 14 : size === "lg" ? 20 : 16}
                />
              </button>
            </li>

            {/* Previous Page Button */}
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className={`page-link ${buttonSize}`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous Page"
              >
                <ChevronLeft
                  size={size === "sm" ? 14 : size === "lg" ? 20 : 16}
                />
              </button>
            </li>

            {/* Page Numbers */}
            {pageNumbers.map((page) => {
              if (typeof page === "string" && page.startsWith("ellipsis")) {
                return (
                  <li key={page} className="page-item disabled">
                    <span className={`page-link ${buttonSize}`}>...</span>
                  </li>
                );
              }

              return (
                <li
                  key={page}
                  className={`page-item ${
                    currentPage === page ? "active" : ""
                  }`}
                >
                  <button
                    className={`page-link ${buttonSize}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                </li>
              );
            })}

            {/* Next Page Button */}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className={`page-link ${buttonSize}`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next Page"
              >
                <ChevronRight
                  size={size === "sm" ? 14 : size === "lg" ? 20 : 16}
                />
              </button>
            </li>

            {/* Last Page Button */}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className={`page-link ${buttonSize}`}
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                aria-label="Last Page"
              >
                <ChevronsRight
                  size={size === "sm" ? 14 : size === "lg" ? 20 : 16}
                />
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/*  RIGHT: Page Size Selector */}
      {showPageSizeSelector && (
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted small">Show:</span>
          <select
            className={`form-select form-select-${size}`}
            value={pageSize}
            onChange={handlePageSizeChange}
            style={{
              padding: "8px 40px 8px 12px",
              border: "2px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "14px",
              outline: "none",
              cursor: "pointer",
              backgroundColor: "#fff",
            }}
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="text-muted small">entries</span>
        </div>
      )}

      {/*  Custom Styles */}
      <style>{`
        .pagination .page-link {
          transition: all 0.2s ease;
        }

        .pagination .page-item.active .page-link {
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
          border-color: #2563eb;
          color: white;
          font-weight: 600;
        }

        .pagination .page-link:hover:not(.disabled) {
          background-color: #f8fafc;
          border-color: #2563eb;
          color: #2563eb;
        }

        .pagination .page-item.disabled .page-link {
          cursor: not-allowed;
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
};

export default CustomPagination;
