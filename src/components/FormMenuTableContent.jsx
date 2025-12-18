// src/components/FormMenuTableContent.jsx
import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { formMenuAction } from "./store/FormMenuStoreSlice";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import DataTable from "./custom_component/DataTable";
import CustomAlert from "./custom_component/CustomAlert"; // ✨ NEW IMPORT

const FormMenuTableContent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { formId } = useParams();

  const { formDataStore } = useSelector((store) => store.formDataStore);
  const { formMenuStore } = useSelector((store) => store.formMenuStore);

  const selectedFormData = formDataStore.find((f) => f.formId === formId);
  const selectedFormMenuArray = formMenuStore[formId] || [];

  // ==================== ALERT STATE ====================
  const [alert, setAlert] = useState({
    show: false,
    type: "success",
    title: "",
    message: "",
  });

  // ==================== HELPER FUNCTIONS ====================
  const getDisplayValue = (value, fieldType) => {
    if (!value) return "-";
    if (fieldType === "file" && typeof value === "object" && value.name) {
      return value.name;
    }
    if (typeof value === "object") return "Object data";
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

    if (Array.isArray(subFormData)) {
      if (subFormData.length === 0) return "-";
      const firstRowValue = subFormData[0]?.[fieldName];
      const displayVal = getDisplayValue(firstRowValue, fieldType);
      return subFormData.length > 1
        ? `${displayVal} (+${subFormData.length - 1} more)`
        : displayVal;
    }

    return getDisplayValue(subFormData[fieldName], fieldType);
  };

  // ==================== COLUMNS CONFIGURATION ====================

  // Main form visible fields
  const visibleFields = useMemo(
    () => selectedFormData?.form?.filter((f) => f.is_show_to_listing) || [],
    [selectedFormData]
  );

  // Sub forms
  const subFormConfigs = formDataStore.filter(
    (f) => f.mainFormName === formId && !f.isMainForm
  );

  // Sub form fields
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

  // Build columns array
  const columns = [
    // Main form columns
    ...visibleFields.map((field) => ({
      header: field.field_name,
      field: field.field_name,
      render: (value) => getDisplayValue(value, field.field_type),
    })),

    // Sub form columns
    ...subFormFields.map((field) => ({
      header: field.fieldName,
      field: `${field.subFormId}_${field.fieldName}`,
      render: (_, row) =>
        getMultiModuleDisplayValue(
          row,
          field.subFormId,
          field.fieldName,
          field.fieldType
        ),
    })),
  ];

  // ==================== ALERT HELPER ====================
  const showAlert = (type, title, message) => {
    setAlert({ show: true, type, title, message });
  };

  const closeAlert = () => {
    setAlert({ ...alert, show: false });
  };

  // ==================== ACTION HANDLERS ====================

  const handleAdd = () => {
    navigate(`/app/AddMenuListData/${formId}`);
  };

  const handleEdit = (row, index) => {
    navigate(`/app/AddMenuListData/${formId}?editIndex=${index}`);
  };

  const handleView = (row) => {
    navigate("/app/menuview-form", {
      state: {
        formData: selectedFormData,
        entryData: row,
        allForms: formDataStore,
      },
    });
  };

  const handleDelete = (row, index) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      dispatch(formMenuAction.deleteFormDataFromMenuStore({ formId, index }));

      // ✨ Show success alert
      showAlert("success", "Deleted!", "Entry has been deleted successfully.");
    }
  };

  const handleExport = () => {
    if (!selectedFormMenuArray || selectedFormMenuArray.length === 0) {
      // ✨ Show warning alert
      showAlert("warning", "No Data", "No data available to export!");
      return;
    }

    try {
      // Prepare headers
      const headers = ["Sr.No", ...visibleFields.map((f) => f.field_name)];

      // Add multi-module headers
      subFormConfigs.forEach((subForm) => {
        const visibleSubFields =
          subForm.form?.filter((f) => f.is_show_to_listing) || [];
        let maxRows = 1;
        selectedFormMenuArray.forEach((form) => {
          const subData = form.subForms?.[subForm.formId];
          if (Array.isArray(subData)) {
            maxRows = Math.max(maxRows, subData.length);
          }
        });

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

      // ✨ Show success alert
      showAlert(
        "success",
        "Exported!",
        "Excel file has been downloaded successfully."
      );
    } catch (error) {
      // ✨ Show error alert
      showAlert(
        "error",
        "Export Failed",
        "Failed to export Excel file. Please try again."
      );
      console.error("Export error:", error);
    }
  };

  // ==================== RENDER ====================
  return (
    <div className="flex-grow-1 p-3" style={{ backgroundColor: "#f5f6fa" }}>
      {/* ✨ Custom Alert Component */}
      <CustomAlert
        type={alert.type}
        title={alert.title}
        message={alert.message}
        show={alert.show}
        onClose={closeAlert}
        autoClose={3000} // Auto close after 3 seconds
      />

      <DataTable
        title={`${selectedFormData?.formName} Configuration Table`}
        subtitle={`Manage entries for ${
          selectedFormData?.formName || "this form"
        }`}
        columns={columns}
        data={selectedFormMenuArray}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        onExport={handleExport}
        addButtonText={`Add ${selectedFormData?.formName}`}
        exportButtonText="Export Excel"
        showExportButton={true}
        emptyMessage="No entries available"
      />
    </div>
  );
};

export default FormMenuTableContent;
