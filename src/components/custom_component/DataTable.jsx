// src/components/common/DataTable.jsx
import React from "react";
import { PlusCircle, Edit2, Trash2, Eye, Download, Grid } from "react-feather";
import CustomButton from "./CustomButton";

/**
 * Simple DataTable Component
 *
 * @param {string} title - Table ka title
 * @param {string} subtitle - Table ka subtitle
 * @param {Array} columns - Columns configuration
 * @param {Array} data - Table data (array of objects)
 * @param {Function} onAdd - Add button click handler
 * @param {Function} onEdit - Edit button click handler
 * @param {Function} onView - View button click handler
 * @param {Function} onDelete - Delete button click handler
 * @param {Function} onExport - Export button click handler (optional)
 * @param {string} addButtonText - Add button ka text (default: "Add New")
 * @param {string} exportButtonText - Export button ka text (default: "Export Excel")
 * @param {boolean} showExportButton - Export button dikhana hai? (default: true)
 * @param {string} emptyMessage - Empty state message
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
}) => {
  // Empty state check
  const isEmpty = !data || data.length === 0;

  return (
    <div
      style={{
        flexGrow: 1,
        padding: "16px",
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

        {/* ==================== TABLE SECTION ==================== */}
        <div style={{ padding: "16px", overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "1000px",
            }}
          >
            {/* Table Header */}
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
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
                    }}
                  >
                    {column.header}
                  </th>
                ))}

                {/* Actions column agar koi bhi action ho */}
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
                    }}
                  >
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {!isEmpty ? (
                data.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
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
                    {/* Sr.No Column */}
                    <td
                      style={{
                        padding: "12px",
                        color: "#64748b",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      {rowIndex + 1}
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
                        {/* Agar custom render function hai to use karo */}
                        {column.render
                          ? column.render(row[column.field], row, rowIndex)
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
                              onClick={() => onEdit(row, rowIndex)}
                              title="Edit"
                              style={{
                                width: "36px",
                                height: "36px",
                                padding: "0",
                              }}
                            />
                          )}

                          {/* View Button */}
                          {onView && (
                            <CustomButton
                              variant="info"
                              outline
                              size="sm"
                              icon={<Eye size={16} />}
                              onClick={() => onView(row, rowIndex)}
                              title="View"
                              style={{
                                width: "36px",
                                height: "36px",
                                padding: "0",
                              }}
                            />
                          )}

                          {/* Delete Button */}
                          {onDelete && (
                            <CustomButton
                              variant="danger"
                              outline
                              size="sm"
                              icon={<Trash2 size={16} />}
                              onClick={() => onDelete(row, rowIndex)}
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
                ))
              ) : (
                // Empty State
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
                        <Grid size={40} color="#cbd5e1" />
                      </div>
                      <div>
                        <h5 style={{ margin: "0 0 5px 0", color: "#64748b" }}>
                          {emptyMessage}
                        </h5>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "14px",
                            color: "#94a3b8",
                          }}
                        >
                          Get started by adding your first entry
                        </p>
                      </div>
                      {onAdd && (
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
      </div>
    </div>
  );
};

export default DataTable;
