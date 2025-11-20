import { useDispatch, useSelector } from "react-redux";
import {
  PlusCircle,
  Edit2,
  Trash2,
  Eye,
  Download,
  Database,
} from "react-feather";
import { useNavigate, useParams } from "react-router-dom";
import { formMenuAction } from "./store/formMenuStoreSlice";
import { useMemo } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const FormMenuTableContent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { formDataStore } = useSelector((store) => store.formDataStore);
  const { formMenuStore } = useSelector((store) => store.formMenuStore);
  const { formId } = useParams();

  const selectedFormData = formDataStore.find(
    (f) => f.formId === formId && f.isMainForm
  );

  const visibleFields =
    selectedFormData?.form?.filter((f) => f.is_show_to_listing) || [];

  const subFormConfigs = formDataStore.filter(
    (f) => f.mainFormName === formId && !f.isMainForm
  );

  const subFormFields = useMemo(() => {
    const fields = [];
    subFormConfigs.forEach((subForm) => {
      const visibleSubFields =
        subForm.form?.filter((f) => f.is_show_to_listing) || [];
      visibleSubFields.forEach((field) => {
        fields.push({
          subFormId: subForm.formId,
          subFormName: subForm.formName,
          fieldName: field.field_name,
          fieldType: field.field_type,
        });
      });
    });
    return fields;
  }, [subFormConfigs]);

  const selectedFormMenuArray = formMenuStore[formId] || [];

  const getDisplayValue = (value, fieldType) => {
    if (!value) return "-";

    if (fieldType === "file" && typeof value === "object" && value.name) {
      return value.name;
    }

    if (typeof value === "object") {
      return "Object data";
    }

    return value;
  };

  const getMultiModuleDisplayValue = (
    form,
    subFormId,
    fieldName,
    fieldType
  ) => {
    const subFormData = form.subForms?.[subFormId];

    if (!subFormData) return "-";

    // If it's an array (multiple rows)
    if (Array.isArray(subFormData)) {
      if (subFormData.length === 0) return "-";

      // Show first row's value + count
      const firstRowValue = subFormData[0]?.[fieldName];
      const displayVal = getDisplayValue(firstRowValue, fieldType);

      if (subFormData.length > 1) {
        return `${displayVal} (+${subFormData.length - 1} more)`;
      }
      return displayVal;
    }

    // Single object (backward compatibility)
    const value = subFormData[fieldName];
    return getDisplayValue(value, fieldType);
  };

  const handleDeleteClick = (index) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      dispatch(formMenuAction.deleteFormDataFromMenuStore({ formId, index }));
    }
  };

  const handleEditClick = (index) => {
    navigate(`/app/AddMenuListData/${formId}?editIndex=${index}`);
  };

  const handelToviewmenuform = (form) => {
    navigate("/app/menuview-form", {
      state: {
        formData: selectedFormData,
        entryData: form,
        allForms: formDataStore,
      },
    });
  };

  const handleExportExcel = () => {
    if (!selectedFormMenuArray || selectedFormMenuArray.length === 0) {
      alert("No data to export!");
      return;
    }

    // Prepare headers
    const headers = ["Sr.No", ...visibleFields.map((f) => f.field_name)];

    // Add multi-module headers with row numbers
    subFormConfigs.forEach((subForm) => {
      const visibleSubFields =
        subForm.form?.filter((f) => f.is_show_to_listing) || [];

      // Find max rows for this subform across all entries
      let maxRows = 1;
      selectedFormMenuArray.forEach((form) => {
        const subData = form.subForms?.[subForm.formId];
        if (Array.isArray(subData)) {
          maxRows = Math.max(maxRows, subData.length);
        }
      });

      // Add headers for each row
      for (let rowIdx = 0; rowIdx < maxRows; rowIdx++) {
        visibleSubFields.forEach((field) => {
          headers.push(
            `${subForm.formName} Row${rowIdx + 1} - ${field.field_name}`
          );
        });
      }
    });

    const worksheetData = selectedFormMenuArray.map((form, idx) => {
      const row = { "Sr.No": idx + 1 };

      // Main form fields
      visibleFields.forEach((field) => {
        row[field.field_name] = getDisplayValue(
          form[field.field_name],
          field.field_type
        );
      });

      // Multi-module fields
      subFormConfigs.forEach((subForm) => {
        const visibleSubFields =
          subForm.form?.filter((f) => f.is_show_to_listing) || [];
        const subData = form.subForms?.[subForm.formId];

        const dataArray = Array.isArray(subData)
          ? subData
          : subData
          ? [subData]
          : [];

        let maxRows = 1;
        selectedFormMenuArray.forEach((f) => {
          const sd = f.subForms?.[subForm.formId];
          if (Array.isArray(sd)) {
            maxRows = Math.max(maxRows, sd.length);
          }
        });

        for (let rowIdx = 0; rowIdx < maxRows; rowIdx++) {
          const rowData = dataArray[rowIdx] || {};
          visibleSubFields.forEach((field) => {
            const headerName = `${subForm.formName} Row${rowIdx + 1} - ${
              field.field_name
            }`;
            row[headerName] = getDisplayValue(
              rowData[field.field_name],
              field.field_type
            );
          });
        }
      });

      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(worksheetData, {
      header: headers,
    });
    worksheet["!cols"] = headers.map((h) => ({
      wch: Math.max(12, h.length + 2),
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Form Data");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, `${selectedFormData?.formName || "Form"}_Data.xlsx`);
  };

  return (
    <div className="flex-grow-1 p-3" style={{ backgroundColor: "#f5f6fa" }}>
      <div
        className="bg-white rounded-4 shadow-sm"
        style={{
          border: "1px solid #e9ecef",
          overflow: "hidden",
        }}
      >
        <div
          className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 p-4 border-bottom"
          style={{ backgroundColor: "#f8f9fa" }}
        >
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center rounded-3"
              style={{
                width: "48px",
                height: "48px",
                background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
              }}
            >
              <Database size={24} color="white" />
            </div>
            <div>
              <h2
                className="mb-0 fw-bold"
                style={{ fontSize: "1.5rem", color: "#1e293b" }}
              >
                {selectedFormData?.formName} Configuration Table
              </h2>
              <p className="mb-0 text-muted" style={{ fontSize: "0.875rem" }}>
                Manage entries for {selectedFormData?.formName || "this form"}
              </p>
            </div>
          </div>

          <div className="d-flex gap-2 flex-wrap">
            <button
              type="button"
              className="btn d-flex align-items-center gap-2 px-4 py-2 rounded-3"
              onClick={() => navigate(`/app/AddMenuListData/${formId}`)}
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "white",
                border: "none",
                fontWeight: "500",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px rgba(16, 185, 129, 0.25)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(16, 185, 129, 0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 2px 8px rgba(16, 185, 129, 0.25)";
              }}
            >
              <PlusCircle size={18} />
              Add {selectedFormData?.formName}
            </button>

            <button
              type="button"
              className="btn d-flex align-items-center gap-2 px-4 py-2 rounded-3"
              onClick={handleExportExcel}
              style={{
                background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
                color: "white",
                border: "none",
                fontWeight: "500",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px rgba(30, 58, 138, 0.25)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(30, 58, 138, 0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 2px 8px rgba(30, 58, 138, 0.25)";
              }}
            >
              <Download size={18} />
              Export Excel
            </button>
          </div>
        </div>

        <div className="p-3" style={{ overflowX: "auto", maxWidth: "100%" }}>
          <table
            className="table table-hover mb-0"
            style={{ minWidth: "1000px", tableLayout: "auto" }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <th
                  className="text-uppercase fw-semibold py-3 px-3"
                  style={{
                    fontSize: "0.75rem",
                    letterSpacing: "0.5px",
                    color: "#64748b",
                    borderBottom: "2px solid #e2e8f0",
                    whiteSpace: "nowrap",
                  }}
                >
                  Sr.No
                </th>
                {visibleFields.map((field) => (
                  <th
                    key={field.field_name}
                    className="text-uppercase fw-semibold py-3 px-3"
                    style={{
                      fontSize: "0.75rem",
                      letterSpacing: "0.5px",
                      color: "#64748b",
                      borderBottom: "2px solid #e2e8f0",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {field.field_name}
                  </th>
                ))}
                {subFormFields.map((field) => (
                  <th
                    key={`${field.subFormId}-${field.fieldName}`}
                    className="text-uppercase fw-semibold py-3 px-3"
                    style={{
                      fontSize: "0.75rem",
                      letterSpacing: "0.5px",
                      color: "#64748b",
                      borderBottom: "2px solid #e2e8f0",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {field.fieldName}
                  </th>
                ))}
                <th
                  className="text-uppercase fw-semibold py-3 px-3 text-center"
                  style={{
                    fontSize: "0.75rem",
                    letterSpacing: "0.5px",
                    color: "#64748b",
                    borderBottom: "2px solid #e2e8f0",
                    whiteSpace: "nowrap",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {selectedFormMenuArray.length > 0 ? (
                selectedFormMenuArray.map((form, idx) => (
                  <tr
                    key={idx}
                    style={{
                      transition: "all 0.2s ease",
                      borderBottom: "1px solid #f1f5f9",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8fafc";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <td
                      className="py-3 px-3"
                      style={{ color: "#64748b", fontWeight: "500" }}
                    >
                      {idx + 1}
                    </td>
                    {visibleFields.map((field) => (
                      <td
                        key={field.field_name}
                        className="py-3 px-3"
                        style={{ color: "#1e293b" }}
                      >
                        {getDisplayValue(
                          form[field.field_name],
                          field.field_type
                        )}
                      </td>
                    ))}
                    {subFormFields.map((field) => {
                      const value = getMultiModuleDisplayValue(
                        form,
                        field.subFormId,
                        field.fieldName,
                        field.fieldType
                      );
                      return (
                        <td
                          key={`${field.subFormId}-${field.fieldName}`}
                          className="py-3 px-3"
                          style={{ color: "#1e293b" }}
                        >
                          {value}
                        </td>
                      );
                    })}
                    <td className="py-3 px-3">
                      <div className="d-flex gap-2 justify-content-center">
                        <button
                          className="btn btn-sm d-flex align-items-center justify-content-center rounded-3"
                          onClick={() => handleEditClick(idx)}
                          style={{
                            width: "36px",
                            height: "36px",
                            backgroundColor: "#fef3c7",
                            color: "#92400e",
                            border: "1px solid #fde68a",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#fde68a";
                            e.currentTarget.style.transform = "scale(1.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#fef3c7";
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                          title="Edit Entry"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn btn-sm d-flex align-items-center justify-content-center rounded-3"
                          onClick={() => handelToviewmenuform(form)}
                          style={{
                            width: "36px",
                            height: "36px",
                            backgroundColor: "#dbeafe",
                            color: "#1e40af",
                            border: "1px solid #bfdbfe",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#bfdbfe";
                            e.currentTarget.style.transform = "scale(1.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#dbeafe";
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                          title="View Entry"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="btn btn-sm d-flex align-items-center justify-content-center rounded-3"
                          onClick={() => handleDeleteClick(idx)}
                          style={{
                            width: "36px",
                            height: "36px",
                            backgroundColor: "#fee2e2",
                            color: "#991b1b",
                            border: "1px solid #fecaca",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#fecaca";
                            e.currentTarget.style.transform = "scale(1.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#fee2e2";
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                          title="Delete Entry"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={visibleFields.length + subFormFields.length + 2}
                    className="text-center py-5"
                    style={{ color: "#94a3b8" }}
                  >
                    <div className="d-flex flex-column align-items-center gap-3">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "80px",
                          height: "80px",
                          backgroundColor: "#f1f5f9",
                        }}
                      >
                        <Database size={40} color="#cbd5e1" />
                      </div>
                      <div>
                        <h5 className="mb-1" style={{ color: "#64748b" }}>
                          No entries available
                        </h5>
                        <p
                          className="mb-0 text-muted"
                          style={{ fontSize: "0.875rem" }}
                        >
                          Get started by adding your first entry
                        </p>
                      </div>
                      <button
                        type="button"
                        className="btn d-flex align-items-center gap-2 px-4 py-2 rounded-3 mt-2"
                        onClick={() =>
                          navigate(`/app/AddMenuListData/${formId}`)
                        }
                        style={{
                          background:
                            "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                          color: "white",
                          border: "none",
                          fontWeight: "500",
                        }}
                      >
                        <PlusCircle size={18} />
                        Add First Entry
                      </button>
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

export default FormMenuTableContent;
