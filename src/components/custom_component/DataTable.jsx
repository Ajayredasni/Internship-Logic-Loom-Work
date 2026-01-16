// src/components/custom_component/DataTable.jsx - UPDATED VERSION WITH CustomPagination
import React, { useState, useMemo } from "react";
import {
  PlusCircle,
  Edit2,
  Trash2,
  Eye,
  Download,
  Grid,
  Search,
} from "react-feather";
import CustomButton from "./CustomButton";
import CustomPagination from "./CustomPagination";

/**
 * Advanced DataTable Component with Search & Pagination
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

  // ==================== HANDLERS ====================
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page on page size change
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

        {/* ==================== SEARCH CONTROLS ==================== */}
        {/*  UPDATED: Removed page size selector - now in CustomPagination */}
        {!isEmpty && searchable && (
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
                  e.target.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </div>
        )}

        {/* ==================== TABLE SECTION ==================== */}
        <div
          className="custom-table-scroll"
          style={{
            overflowX: "auto",
            maxHeight: "calc(100vh - 380px)",
            overflowY: "auto",
            position: "relative",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "1000px",
            }}
          >
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

        {/* ====================  NEW: CUSTOM PAGINATION COMPONENT ==================== */}
        {!isEmpty && paginated && (
          <div style={{ padding: "16px", borderTop: "1px solid #f1f5f9" }}>
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalEntries={filteredData.length}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              pageSizeOptions={[10, 25, 50, 100]}
              showPageSizeSelector={true}
              showEntriesInfo={true}
              maxVisiblePages={5}
              size="md"
            />
          </div>
        )}
      </div>

      {/*  CUSTOM SCROLLBAR STYLING (Unchanged) */}
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
