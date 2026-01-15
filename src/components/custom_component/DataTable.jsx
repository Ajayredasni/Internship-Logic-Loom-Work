// src/components/custom_component/DataTable.jsx
import React, { useState, useMemo } from "react";
import {
  PlusCircle,
  Edit2,
  Trash2,
  Eye,
  Download,
  Grid,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "react-feather";
import CustomButton from "./CustomButton";

/**
 * Advanced DataTable Component with Search & Pagination
 * ✅ FIXED: White gap issue when scrolling table
 */
const DataTable = ({
  title = "Data Table",
  subtitle = "",
  columns = [],
  data = [],
  onAdd,
  onEdit,
  onView,
  onDelete,
  onExport,
  addButtonText = "Add New",
  exportButtonText = "Export Excel",
  showExportButton = true,
  emptyMessage = "No data available",
  searchable = true,
  paginated = true,
  defaultPageSize = 10,
}) => {
  // ==================== STATE - Search & Pagination ====================
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // ==================== SEARCH LOGIC ====================
  const filteredData = useMemo(() => {
    if (!searchable || !searchTerm.trim()) return data;

    return data.filter((row) => {
      return columns.some((column) => {
        const value = row[column.field];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [data, searchTerm, columns, searchable]);

  // ==================== PAGINATION LOGIC ====================
  const paginatedData = useMemo(() => {
    if (!paginated) return filteredData;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, pageSize, paginated]);

  // ==================== PAGINATION CALCULATIONS ====================
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startEntry =
    filteredData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endEntry = Math.min(currentPage * pageSize, filteredData.length);

  // ==================== HANDLERS ====================
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Empty state check
  const isEmpty = !data || data.length === 0;
  const isFiltered = searchTerm.trim() && filteredData.length === 0;

  return (
    <div
      style={{
        flexGrow: 1,
        padding: "5px 16px 5px 16px",
        backgroundColor: "#f5f6fa",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          border: "1px solid #e9ecef",
          overflow: "hidden",
        }}
      >
        {/* ==================== HEADER SECTION ==================== */}
        <div
          style={{
            display: "flex",
            flexDirection: window.innerWidth < 768 ? "column" : "row",
            justifyContent: "space-between",
            alignItems: window.innerWidth < 768 ? "flex-start" : "center",
            gap: "15px",
            padding: "16px",
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          {/* Left side - Title */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
                borderRadius: "12px",
              }}
            >
              <Grid size={24} color="white" />
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#1e293b",
                }}
              >
                {title}
              </h2>
              {subtitle && (
                <p
                  style={{
                    margin: "4px 0 0 0",
                    fontSize: "0.875rem",
                    color: "#64748b",
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right side - Action Buttons */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {onAdd && (
              <CustomButton
                variant="success"
                icon={<PlusCircle size={18} />}
                onClick={onAdd}
              >
                {addButtonText}
              </CustomButton>
            )}
            {showExportButton && onExport && !isEmpty && (
              <CustomButton
                variant="primary"
                icon={<Download size={18} />}
                onClick={onExport}
              >
                {exportButtonText}
              </CustomButton>
            )}
          </div>
        </div>

        {/* ==================== SEARCH & PAGINATION CONTROLS ==================== */}
        {!isEmpty && (searchable || paginated) && (
          <div
            style={{
              padding: "16px",
              display: "flex",
              flexDirection: window.innerWidth < 768 ? "column" : "row",
              justifyContent: "space-between",
              alignItems: window.innerWidth < 768 ? "flex-start" : "center",
              gap: "12px",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            {/* Search Bar */}
            {searchable && (
              <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
                <Search
                  size={18}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#64748b",
                  }}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  style={{
                    width: "100%",
                    padding: "10px 12px 10px 40px",
                    border: "2px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#2563eb";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(37, 99, 235, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            )}

            {/* Page Size Selector */}
            {paginated && (
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span style={{ fontSize: "14px", color: "#64748b" }}>
                  Show:
                </span>
                <select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  style={{
                    padding: "8px 12px",
                    border: "2px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    cursor: "pointer",
                    backgroundColor: "#fff",
                  }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span style={{ fontSize: "14px", color: "#64748b" }}>
                  entries
                </span>
              </div>
            )}
          </div>
        )}

        {/* ==================== DATA INFO ==================== */}
        {!isEmpty && paginated && (
          <div
            style={{
              padding: "12px 16px",
              fontSize: "14px",
              color: "#64748b",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            Showing {startEntry} to {endEntry} of {filteredData.length} entries
            {searchTerm && ` (filtered from ${data.length} total entries)`}
          </div>
        )}

        {/* ==================== ✅ FIXED TABLE SECTION - WHITE GAP REMOVED ==================== */}
        <div
          className="custom-table-scroll"
          style={{
            // ✅ CHANGE 1: padding: "16px" REMOVE KIYA - Ye white gap create kar raha tha
            overflowX: "auto",
            maxHeight: "calc(100vh - 380px)",
            overflowY: "auto",
            position: "relative",
          }}
        >
          <table
            style={{
              width: "100%",
              // ✅ CHANGE 2: borderCollapse "separate" se "collapse" kiya - Proper sticky header ke liye
              borderCollapse: "collapse",
              minWidth: "1000px",
            }}
          >
            {/* ✅ CHANGE 3: <thead> se position: sticky remove kiya, direct <th> par lagaya */}
            <thead>
              <tr>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    borderBottom: "2px solid #e2e8f0",
                    whiteSpace: "nowrap",
                    // ✅ CHANGE 4: Sticky header ke liye ye properties add ki
                    backgroundColor: "#f8f9fa",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                  }}
                >
                  Sr.No
                </th>

                {columns.map((column, index) => (
                  <th
                    key={index}
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderBottom: "2px solid #e2e8f0",
                      whiteSpace: "nowrap",
                      // ✅ CHANGE 5: Har column header par sticky properties
                      backgroundColor: "#f8f9fa",
                      position: "sticky",
                      top: 0,
                      zIndex: 10,
                    }}
                  >
                    {column.header}
                  </th>
                ))}

                {(onEdit || onView || onDelete) && (
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderBottom: "2px solid #e2e8f0",
                      whiteSpace: "nowrap",
                      // ✅ CHANGE 6: Actions column bhi sticky
                      backgroundColor: "#f8f9fa",
                      position: "sticky",
                      top: 0,
                      zIndex: 10,
                    }}
                  >
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {!isEmpty && !isFiltered ? (
                paginatedData.map((row, rowIndex) => {
                  const actualIndex = (currentPage - 1) * pageSize + rowIndex;
                  return (
                    <tr
                      key={actualIndex}
                      style={{
                        borderBottom: "1px solid #f1f5f9",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#f8fafc";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <td
                        style={{
                          padding: "12px",
                          color: "#64748b",
                          fontWeight: "500",
                          fontSize: "14px",
                        }}
                      >
                        {actualIndex + 1}
                      </td>

                      {/* Data Columns */}
                      {columns.map((column, colIndex) => (
                        <td
                          key={colIndex}
                          style={{
                            padding: "12px",
                            color: "#1e293b",
                            fontSize: "14px",
                            fontWeight:
                              column.field === "formName" ? "500" : "400",
                          }}
                        >
                          {column.render
                            ? column.render(row[column.field], row, actualIndex)
                            : row[column.field] || "-"}
                        </td>
                      ))}

                      {/* Action Buttons */}
                      {(onEdit || onView || onDelete) && (
                        <td style={{ padding: "12px" }}>
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              justifyContent: "center",
                            }}
                          >
                            {onEdit && (
                              <CustomButton
                                variant="warning"
                                outline
                                size="sm"
                                icon={<Edit2 size={16} />}
                                onClick={() => onEdit(row, actualIndex)}
                                title="Edit"
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  padding: "0",
                                }}
                              />
                            )}

                            {onView && (
                              <CustomButton
                                variant="info"
                                outline
                                size="sm"
                                icon={<Eye size={16} />}
                                onClick={() => onView(row, actualIndex)}
                                title="View"
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  padding: "0",
                                }}
                              />
                            )}

                            {onDelete && (
                              <CustomButton
                                variant="danger"
                                outline
                                size="sm"
                                icon={<Trash2 size={16} />}
                                onClick={() => onDelete(row, actualIndex)}
                                title="Delete"
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  padding: "0",
                                }}
                              />
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + 2}
                    style={{ padding: "60px 20px", textAlign: "center" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "15px",
                      }}
                    >
                      <div
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "50%",
                          backgroundColor: "#f1f5f9",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {isFiltered ? (
                          <Search size={40} color="#cbd5e1" />
                        ) : (
                          <Grid size={40} color="#cbd5e1" />
                        )}
                      </div>
                      <div>
                        <h5 style={{ margin: "0 0 5px 0", color: "#64748b" }}>
                          {isFiltered
                            ? `No results found for "${searchTerm}"`
                            : emptyMessage}
                        </h5>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "14px",
                            color: "#94a3b8",
                          }}
                        >
                          {isFiltered
                            ? "Try different keywords"
                            : "Get started by adding your first entry"}
                        </p>
                      </div>
                      {onAdd && !isFiltered && (
                        <CustomButton
                          variant="success"
                          icon={<PlusCircle size={18} />}
                          onClick={onAdd}
                          style={{ marginTop: "10px" }}
                        >
                          {addButtonText}
                        </CustomButton>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ==================== PAGINATION CONTROLS ==================== */}
        {!isEmpty && paginated && totalPages > 1 && (
          <div
            style={{
              padding: "8px 16px 8px 16px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              borderTop: "1px solid #f1f5f9",
            }}
          >
            {/* First Page */}
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              style={{
                padding: "8px 12px",
                border: "2px solid #e2e8f0",
                borderRadius: "8px",
                backgroundColor: "#fff",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                opacity: currentPage === 1 ? 0.5 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 1) {
                  e.currentTarget.style.borderColor = "#2563eb";
                  e.currentTarget.style.backgroundColor = "#f8fafc";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.backgroundColor = "#fff";
              }}
            >
              <ChevronsLeft size={18} />
            </button>

            {/* Previous Page */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                padding: "8px 12px",
                border: "2px solid #e2e8f0",
                borderRadius: "8px",
                backgroundColor: "#fff",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                opacity: currentPage === 1 ? 0.5 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 1) {
                  e.currentTarget.style.borderColor = "#2563eb";
                  e.currentTarget.style.backgroundColor = "#f8fafc";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.backgroundColor = "#fff";
              }}
            >
              <ChevronLeft size={18} />
            </button>

            {/* Page Numbers */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    style={{
                      padding: "8px 14px",
                      border: "2px solid",
                      borderColor:
                        currentPage === pageNum ? "#2563eb" : "#e2e8f0",
                      borderRadius: "8px",
                      backgroundColor:
                        currentPage === pageNum ? "#2563eb" : "#fff",
                      color: currentPage === pageNum ? "#fff" : "#1e293b",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: currentPage === pageNum ? "600" : "400",
                      transition: "all 0.2s ease",
                      minWidth: "40px",
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== pageNum) {
                        e.currentTarget.style.borderColor = "#2563eb";
                        e.currentTarget.style.backgroundColor = "#f8fafc";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== pageNum) {
                        e.currentTarget.style.borderColor = "#e2e8f0";
                        e.currentTarget.style.backgroundColor = "#fff";
                      }
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next Page */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                padding: "8px 12px",
                border: "2px solid #e2e8f0",
                borderRadius: "8px",
                backgroundColor: "#fff",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                opacity: currentPage === totalPages ? 0.5 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (currentPage !== totalPages) {
                  e.currentTarget.style.borderColor = "#2563eb";
                  e.currentTarget.style.backgroundColor = "#f8fafc";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.backgroundColor = "#fff";
              }}
            >
              <ChevronRight size={18} />
            </button>

            {/* Last Page */}
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              style={{
                padding: "8px 12px",
                border: "2px solid #e2e8f0",
                borderRadius: "8px",
                backgroundColor: "#fff",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                opacity: currentPage === totalPages ? 0.5 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (currentPage !== totalPages) {
                  e.currentTarget.style.borderColor = "#2563eb";
                  e.currentTarget.style.backgroundColor = "#f8fafc";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.backgroundColor = "#fff";
              }}
            >
              <ChevronsRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* ✅ CUSTOM SCROLLBAR STYLING */}
      <style>{`
        .custom-table-scroll::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }

        .custom-table-scroll::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        .custom-table-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
          border-radius: 10px;
          transition: background 0.3s ease;
        }

        .custom-table-scroll::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
        }

        /* For Firefox */
        .custom-table-scroll {
          scrollbar-width: thin;
          scrollbar-color: #2563eb #f1f5f9;
        }
      `}</style>
    </div>
  );
};

export default DataTable;
