// import { useSelector, useDispatch } from "react-redux";
// import { formDataAction } from "./store/FormDataStoreSlice";
// import { formMenuAction } from "./store/FormMenuStoreSlice";
// import { PlusCircle, Edit2, Trash2, Table, Eye } from "react-feather";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./FormDataTableContent.css";

// const FormDataTableContent = () => {
//   const [deleteMessage, setDeleteMessage] = useState("");
//   const navigate = useNavigate();
//   const { formDataStore } = useSelector((store) => store.formDataStore);
//   const dispatch = useDispatch();
//   const activeFormList = formDataStore.filter((f) => f.active);
//   // Send form data to AddForm page via state
//   const handleEditClick = (formId) => {
//     const selectedForm = formDataStore.find((f) => f.formId === formId);
//     if (selectedForm) {
//       navigate("/add-form", { state: { formData: selectedForm } });
//     }
//   };

//   const handleDeleteClick = (formId) => {
//     dispatch(formDataAction.deleteForm({ formId }));
//     dispatch(formMenuAction.deleteFormMenuCategory(formId));
//     setDeleteMessage("Form deleted successfully!");
//     setTimeout(() => setDeleteMessage(""), 1000);
//   };

//   const handleViewClick = (formId) => {
//     const selectedForm = formDataStore.find((f) => f.formId === formId);
//     navigate(`/view-form/${formId}`, { state: { formData: selectedForm } });
//   };

//   return (
//     <div className="formlist-container flex-grow-1 p-3">
//       <div className="formlist-card">
//         <div className="formlist-header">
//           <h2 className="formlist-title">
//             <Table size={28} /> Form Configuration Table
//           </h2>
//           <button
//             type="button"
//             className="btn-addform d-flex align-items-center gap-2"
//             onClick={() => navigate("/add-form")}
//           >
//             <PlusCircle size={20} /> Add Form
//           </button>
//         </div>

//         {deleteMessage && (
//           <div className="alert alert-success text-center">{deleteMessage}</div>
//         )}

//         <div className="table-wrapper">
//           <table className="table-formlist">
//             <thead>
//               <tr>
//                 <th>Sr.No</th>
//                 <th>Organization Name</th>
//                 <th>Form Name</th>
//                 <th>Is Main Form</th>
//                 <th>Main Form Name</th>
//                 <th>Description</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {activeFormList.length > 0 ? (
//                 activeFormList.map((form, idx) => (
//                   <tr key={form.formId}>
//                     <td>{idx + 1}</td>
//                     <td>{form.organizationName}</td>
//                     <td>{form.formName}</td>
//                     <td>{form.isMainForm ? "Yes" : "No"}</td>
//                     <td>{form.mainFormName || "-"}</td>
//                     <td>{form.description}</td>
//                     <td>
//                       <span>{form.active ? "Active" : "Inactive"}</span>
//                     </td>
//                     <td>
//                       <div className="action-buttons-nowrap">
//                         <button
//                           className="btn-action btn-edit"
//                           onClick={() => handleEditClick(form.formId)}
//                         >
//                           <Edit2 size={16} />
//                         </button>
//                         <button
//                           className="btn-action btn-view"
//                           onClick={() => handleViewClick(form.formId)}
//                         >
//                           <Eye size={16} />
//                         </button>
//                         <button
//                           className="btn-action btn-delete"
//                           onClick={() => handleDeleteClick(form.formId)}
//                         >
//                           <Trash2 size={16} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="8" className="no-data">
//                     No forms available. Please add a form.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FormDataTableContent;

// import { useSelector, useDispatch } from "react-redux";
// import { formDataAction } from "./store/FormDataStoreSlice";
// import { formMenuAction } from "./store/FormMenuStoreSlice";
// import { PlusCircle, Edit2, Trash2, Table, Eye } from "react-feather";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { exportFormsToExcel } from "./store/exportUtils"; // import
// import "./FormDataTableContent.css";

// const FormDataTableContent = () => {
//   const [deleteMessage, setDeleteMessage] = useState("");
//   const navigate = useNavigate();
//   const { formDataStore } = useSelector((store) => store.formDataStore);
//   const dispatch = useDispatch();
//   const activeFormList = formDataStore.filter((f) => f.active);

//   const handleEditClick = (formId) => {
//     const selectedForm = formDataStore.find((f) => f.formId === formId);
//     if (selectedForm) {
//       navigate("/app/add-form", { state: { formData: selectedForm } });
//     }
//   };

//   const handleDeleteClick = (formId) => {
//     dispatch(formDataAction.deleteForm({ formId }));
//     dispatch(formMenuAction.deleteFormMenuCategory(formId));
//     setDeleteMessage("Form deleted successfully!");
//     setTimeout(() => setDeleteMessage(""), 1000);
//   };

//   const handleViewClick = (formId) => {
//     const selectedForm = formDataStore.find((f) => f.formId === formId);
//     navigate(`/app/view-form/${formId}`, { state: { formData: selectedForm } });
//   };

//   return (
//     <div className="formlist-container flex-grow-1 p-3">
//       <div className="formlist-card">
//         <div className="formlist-header">
//           <h2 className="formlist-title">
//             <Table size={28} /> Form Configuration Table
//           </h2>

//           <div className="d-flex gap-2">
//             <button
//               type="button"
//               className="btn-addform d-flex align-items-center gap-2"
//               onClick={() => navigate("/app/add-form")}
//             >
//               <PlusCircle size={20} /> Add Form
//             </button>

//             <button
//               type="button"
//               className="btn-addform d-flex align-items-center gap-2"
//               onClick={() => exportFormsToExcel(activeFormList)}
//             >
//               Export Excel
//             </button>
//           </div>
//         </div>

//         {deleteMessage && (
//           <div className="alert alert-success text-center">{deleteMessage}</div>
//         )}

//         <div className="table-wrapper">
//           <table className="table-formlist">
//             <thead>
//               <tr>
//                 <th>Sr.No</th>
//                 <th>Organization Name</th>
//                 <th>Form Name</th>
//                 <th>Is Main Form</th>
//                 <th>Main Form Name</th>
//                 <th>Description</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {activeFormList.length > 0 ? (
//                 activeFormList.map((form, idx) => (
//                   <tr key={form.formId}>
//                     <td>{idx + 1}</td>
//                     <td>{form.organizationName}</td>
//                     <td>{form.formName}</td>
//                     <td>{form.isMainForm ? "Yes" : "No"}</td>
//                     <td>{form.mainFormName || "-"}</td>
//                     <td>{form.description}</td>
//                     <td>
//                       <span>{form.active ? "Active" : "Inactive"}</span>
//                     </td>
//                     <td>
//                       <div className="action-buttons-nowrap">
//                         <button
//                           className="btn-action btn-edit"
//                           onClick={() => handleEditClick(form.formId)}
//                         >
//                           <Edit2 size={16} />
//                         </button>
//                         <button
//                           className="btn-action btn-view"
//                           onClick={() => handleViewClick(form.formId)}
//                         >
//                           <Eye size={16} />
//                         </button>
//                         <button
//                           className="btn-action btn-delete"
//                           onClick={() => handleDeleteClick(form.formId)}
//                         >
//                           <Trash2 size={16} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="8" className="no-data">
//                     No forms available. Please add a form.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FormDataTableContent;

import { useSelector, useDispatch } from "react-redux";
import { formDataAction } from "./store/FormDataStoreSlice";
import { formMenuAction } from "./store/FormMenuStoreSlice";
import { PlusCircle, Edit2, Trash2, Eye, Download, Grid } from "react-feather";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { exportFormsToExcel } from "./store/exportUtils";

const FormDataTableContent = () => {
  const [deleteMessage, setDeleteMessage] = useState("");
  const navigate = useNavigate();
  const { formDataStore } = useSelector((store) => store.formDataStore);
  const dispatch = useDispatch();
  const activeFormList = formDataStore.filter((f) => f.active);

  const handleEditClick = (formId) => {
    const selectedForm = formDataStore.find((f) => f.formId === formId);
    if (selectedForm) {
      navigate("/app/add-form", { state: { formData: selectedForm } });
    }
  };

  const handleDeleteClick = (formId) => {
    dispatch(formDataAction.deleteForm({ formId }));
    dispatch(formMenuAction.deleteFormMenuCategory(formId));
    setDeleteMessage("Form deleted successfully!");
    setTimeout(() => setDeleteMessage(""), 1000);
  };

  const handleViewClick = (formId) => {
    const selectedForm = formDataStore.find((f) => f.formId === formId);
    navigate(`/app/view-form/${formId}`, { state: { formData: selectedForm } });
  };

  return (
    <div className="flex-grow-1 p-4" style={{ backgroundColor: "#f5f6fa" }}>
      <div
        className="bg-white rounded-4 shadow-sm"
        style={{
          border: "1px solid #e9ecef",
          overflow: "hidden",
        }}
      >
        {/* Header Section */}
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
              <Grid size={24} color="white" />
            </div>
            <div>
              <h2
                className="mb-0 fw-bold"
                style={{ fontSize: "1.5rem", color: "#1e293b" }}
              >
                Form Configuration Table
              </h2>
              <p className="mb-0 text-muted" style={{ fontSize: "0.875rem" }}>
                Manage all your dynamic forms
              </p>
            </div>
          </div>

          <div className="d-flex gap-2 flex-wrap">
            <button
              type="button"
              className="btn d-flex align-items-center gap-2 px-4 py-2 rounded-3"
              onClick={() => navigate("/app/add-form")}
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
              Add Form
            </button>

            <button
              type="button"
              className="btn d-flex align-items-center gap-2 px-4 py-2 rounded-3"
              onClick={() => exportFormsToExcel(activeFormList)}
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

        {/* Success Message */}
        {deleteMessage && (
          <div
            className="alert alert-success mx-4 mt-4 rounded-3 d-flex align-items-center gap-2"
            style={{
              backgroundColor: "#d1fae5",
              color: "#065f46",
              border: "1px solid #a7f3d0",
              fontWeight: "500",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>✓</span>
            {deleteMessage}
          </div>
        )}

        {/* Table Section */}
        <div className="p-4" style={{ overflowX: "auto" }}>
          <table
            className="table table-hover mb-0"
            style={{ minWidth: "1000px" }}
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
                  Organization Name
                </th>
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
                  Form Name
                </th>
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
                  Is Main Form
                </th>
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
                  Main Form Name
                </th>
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
                  Description
                </th>
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
                  Status
                </th>
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
              {activeFormList.length > 0 ? (
                activeFormList.map((form, idx) => (
                  <tr
                    key={form.formId}
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
                    <td
                      className="py-3 px-3"
                      style={{ color: "#1e293b", fontWeight: "500" }}
                    >
                      {form.organizationName}
                    </td>
                    <td
                      className="py-3 px-3"
                      style={{ color: "#1e293b", fontWeight: "500" }}
                    >
                      {form.formName}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className="badge rounded-pill px-3 py-2"
                        style={{
                          backgroundColor: form.isMainForm
                            ? "#dbeafe"
                            : "#f3f4f6",
                          color: form.isMainForm ? "#1e40af" : "#6b7280",
                          fontWeight: "500",
                          fontSize: "0.75rem",
                        }}
                      >
                        {form.isMainForm ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="py-3 px-3" style={{ color: "#64748b" }}>
                      {form.mainFormName || "-"}
                    </td>
                    <td
                      className="py-3 px-3"
                      style={{ color: "#64748b", maxWidth: "250px" }}
                    >
                      {form.description}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className="badge rounded-pill px-3 py-2"
                        style={{
                          backgroundColor: form.active ? "#d1fae5" : "#fee2e2",
                          color: form.active ? "#065f46" : "#991b1b",
                          fontWeight: "500",
                          fontSize: "0.75rem",
                        }}
                      >
                        {form.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="d-flex gap-2 justify-content-center">
                        <button
                          className="btn btn-sm d-flex align-items-center justify-content-center rounded-3"
                          onClick={() => handleEditClick(form.formId)}
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
                          title="Edit Form"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn btn-sm d-flex align-items-center justify-content-center rounded-3"
                          onClick={() => handleViewClick(form.formId)}
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
                          title="View Form"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="btn btn-sm d-flex align-items-center justify-content-center rounded-3"
                          onClick={() => handleDeleteClick(form.formId)}
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
                          title="Delete Form"
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
                    colSpan="8"
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
                        <Grid size={40} color="#cbd5e1" />
                      </div>
                      <div>
                        <h5 className="mb-1" style={{ color: "#64748b" }}>
                          No forms available
                        </h5>
                        <p
                          className="mb-0 text-muted"
                          style={{ fontSize: "0.875rem" }}
                        >
                          Get started by creating your first form
                        </p>
                      </div>
                      <button
                        type="button"
                        className="btn d-flex align-items-center gap-2 px-4 py-2 rounded-3 mt-2"
                        onClick={() => navigate("/app/add-form")}
                        style={{
                          background:
                            "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                          color: "white",
                          border: "none",
                          fontWeight: "500",
                        }}
                      >
                        <PlusCircle size={18} />
                        Add Your First Form
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

export default FormDataTableContent;
