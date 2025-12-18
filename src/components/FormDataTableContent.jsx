// src/components/FormDataTableContent.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formDataAction } from "./store/FormDataStoreSlice";
import { formMenuAction } from "./store/FormMenuStoreSlice";
import { exportFormsToExcel } from "./store/exportUtils";
import DataTable from "./custom_component/DataTable";
import CustomAlert from "./custom_component/CustomAlert"; // ✨ NEW IMPORT

const FormDataTableContent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { formDataStore } = useSelector((store) => store.formDataStore);

  const activeFormList = formDataStore.filter((f) => f.active);

  // ==================== ALERT STATE ====================
  const [alert, setAlert] = useState({
    show: false,
    type: "success",
    title: "",
    message: "",
  });

  // ==================== COLUMNS CONFIGURATION ====================
  const columns = [
    {
      header: "Organization Name",
      field: "organizationName",
    },
    {
      header: "Form Name",
      field: "formName",
    },
    {
      header: "Is Main Form",
      field: "isMainForm",
      render: (value) => (
        <span
          style={{
            padding: "4px 12px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "500",
            backgroundColor: value ? "#dbeafe" : "#f3f4f6",
            color: value ? "#1e40af" : "#6b7280",
          }}
        >
          {value ? "Yes" : "No"}
        </span>
      ),
    },
    {
      header: "Main Form Name",
      field: "mainFormName",
      render: (value) => value || "-",
    },
    {
      header: "Description",
      field: "description",
    },
    {
      header: "Status",
      field: "active",
      render: (value) => (
        <span
          style={{
            padding: "4px 12px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "500",
            backgroundColor: value ? "#d1fae5" : "#fee2e2",
            color: value ? "#065f46" : "#991b1b",
          }}
        >
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  // ==================== ALERT HELPER ====================
  const showAlert = (type, title, message) => {
    setAlert({ show: true, type, title, message });
  };

  const closeAlert = () => {
    setAlert({ ...alert, show: false });
  };

  // ==================== ACTION HANDLERS ====================

  // Add button click
  const handleAdd = () => {
    navigate("/app/add-form");
  };

  // Edit button click
  const handleEdit = (row) => {
    navigate("/app/add-form", { state: { formData: row } });
  };

  // View button click
  const handleView = (row) => {
    navigate(`/app/view-form/${row.formId}`, { state: { formData: row } });
  };

  // Delete button click
  const handleDelete = (row) => {
    if (window.confirm(`Are you sure you want to delete "${row.formName}"?`)) {
      dispatch(formDataAction.deleteForm({ formId: row.formId }));
      dispatch(formMenuAction.deleteFormMenuCategory(row.formId));

      // ✨ Show success alert
      showAlert(
        "success",
        "Deleted!",
        `Form "${row.formName}" has been deleted successfully.`
      );
    }
  };

  // Export button click
  const handleExport = () => {
    try {
      exportFormsToExcel(activeFormList);
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
    }
  };

  // ==================== RENDER ====================
  return (
    <div className="flex-grow-1 p-4" style={{ backgroundColor: "#f5f6fa" }}>
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
        title="Form Configuration Table"
        subtitle="Manage all your dynamic forms"
        columns={columns}
        data={activeFormList}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        onExport={handleExport}
        addButtonText="Add Form"
        exportButtonText="Export Excel"
        showExportButton={true}
        emptyMessage="No forms available"
      />
    </div>
  );
};

export default FormDataTableContent;
