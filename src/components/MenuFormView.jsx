// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { ChevronDown, ChevronUp, FileText } from "react-feather";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// const MenuFormView = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const formData = location.state?.formData;
//   const entryData = location.state?.entryData;
//   const allForms = location.state?.allForms || [];
//   console.log(entryData);
//   const [expandedSections, setExpandedSections] = useState({});

//   if (!formData || !entryData) {
//     return (
//       <div style={{ padding: "20px" }}>
//         <h3>Data not found.</h3>
//         <button onClick={() => navigate(-1)}>Back</button>
//       </div>
//     );
//   }

//   const visibleFields = formData.form.filter((f) => f.is_show_to_view);
//   const relatedSubForms = allForms.filter(
//     (f) => f.mainFormName === formData.formId && !f.isMainForm
//   );

//   const toggleSection = (sectionId) => {
//     setExpandedSections((prev) => ({
//       ...prev,
//       [sectionId]: !prev[sectionId],
//     }));
//   };

//   const getDisplayValue = (value, fieldType) => {
//     if (!value) return "-";
//     if (fieldType === "file" && typeof value === "object" && value.name) {
//       return value.name;
//     }
//     if (typeof value === "object") {
//       return JSON.stringify(value);
//     }
//     return String(value);
//   };

//   const handleExportPDF = () => {
//     const doc = new jsPDF();
//     const pageWidth = doc.internal.pageSize.width;
//     const pageHeight = doc.internal.pageSize.height;
//     let yOffset = 30;

//     doc.setFontSize(20);
//     doc.setFont("helvetica", "bold");
//     doc.setTextColor(41, 128, 185);
//     doc.text("FORM DATA REPORT", pageWidth / 2, yOffset, { align: "center" });

//     yOffset += 8;
//     doc.setFontSize(12);
//     doc.setFont("helvetica", "normal");
//     doc.setTextColor(100, 100, 100);
//     doc.text(
//       `Generated on: ${new Date().toLocaleDateString(
//         "en-IN"
//       )} at ${new Date().toLocaleTimeString("en-IN")}`,
//       pageWidth / 2,
//       yOffset,
//       { align: "center" }
//     );

//     yOffset += 10;
//     doc.setDrawColor(41, 128, 185);
//     doc.setLineWidth(0.8);
//     doc.line(20, yOffset, pageWidth - 20, yOffset);
//     yOffset += 15;

//     doc.setFontSize(16);
//     doc.setFont("helvetica", "bold");
//     doc.setTextColor(0, 0, 0);
//     doc.text(
//       `${formData.formName || "Main Form"} - Complete Data`,
//       20,
//       yOffset
//     );
//     yOffset += 15;

//     const addTable = (
//       title,
//       fields,
//       data,
//       extraInfo = {},
//       isSubForm = false
//     ) => {
//       if (yOffset > pageHeight - 80) {
//         doc.addPage();
//         yOffset = 30;
//       }

//       doc.setFontSize(14);
//       doc.setFont("helvetica", "bold");
//       doc.setTextColor(
//         isSubForm ? 155 : 52,
//         isSubForm ? 89 : 73,
//         isSubForm ? 182 : 94
//       );
//       doc.text(title.toUpperCase(), 20, yOffset);
//       yOffset += 5;

//       const tableData = [];

//       Object.entries(extraInfo).forEach(([key, value]) => {
//         tableData.push([String(key), String(value || "Not Available")]);
//       });

//       if (Object.keys(extraInfo).length > 0 && fields.length > 0) {
//         tableData.push(["--- FORM FIELDS ---", "--- VALUES ---"]);
//       }

//       fields.forEach((field) => {
//         const fieldName = String(
//           field.label || field.field_name || "Unnamed Field"
//         );
//         const fieldValue = getDisplayValue(
//           data[field.field_name],
//           field.field_type
//         );
//         tableData.push([fieldName, fieldValue]);
//       });

//       autoTable(doc, {
//         startY: yOffset,
//         head: [["Field Description", "Value"]],
//         body: tableData,
//         theme: "striped",
//         headStyles: {
//           fillColor: isSubForm ? [155, 89, 182] : [52, 73, 94],
//           textColor: 255,
//           fontSize: 11,
//           fontStyle: "bold",
//           halign: "center",
//         },
//         bodyStyles: {
//           fontSize: 10,
//           textColor: [33, 37, 41],
//         },
//         columnStyles: {
//           0: {
//             cellWidth: 70,
//             fontStyle: "bold",
//             fillColor: [248, 249, 250],
//             textColor: [52, 73, 94],
//           },
//           1: {
//             cellWidth: 110,
//           },
//         },
//         margin: { left: 20, right: 20 },
//         tableLineColor: [189, 195, 199],
//         tableLineWidth: 0.1,
//         alternateRowStyles: { fillColor: [252, 252, 252] },
//       });

//       yOffset = doc.lastAutoTable.finalY + 15;
//     };

//     const mainExtraInfo = {
//       ORGANIZATION: entryData.organizationName || "N/A",
//       "FORM ID": entryData.formId || "N/A",
//       "FORM TYPE": entryData.FormType || "-",
//       STATUS: formData.status || "Active",
//       "CREATED DATE": entryData.createdAt
//         ? new Date(entryData.createdAt).toLocaleDateString("en-IN")
//         : "Not Available",
//       "LAST UPDATED": entryData.updatedAt
//         ? new Date(entryData.updatedAt).toLocaleDateString("en-IN")
//         : "Not Available",
//     };

//     addTable(
//       formData.formName + " - Main Form Data",
//       visibleFields,
//       entryData,
//       mainExtraInfo,
//       false
//     );

//     if (relatedSubForms.length > 0) {
//       if (yOffset > pageHeight - 60) {
//         doc.addPage();
//         yOffset = 30;
//       }

//       doc.setFontSize(16);
//       doc.setFont("helvetica", "bold");
//       doc.setTextColor(155, 89, 182);
//       doc.text("MULTI-MODULES", 20, yOffset);
//       yOffset += 10;
//       doc.setDrawColor(155, 89, 182);
//       doc.setLineWidth(0.5);
//       doc.line(20, yOffset, pageWidth - 20, yOffset);
//       yOffset += 15;

//       relatedSubForms.forEach((subForm) => {
//         const subFormDataArray = entryData.subForms?.[subForm.formId];
//         if (!subFormDataArray) return;

//         const dataArray = Array.isArray(subFormDataArray)
//           ? subFormDataArray
//           : [subFormDataArray];

//         const visibleSubFields =
//           subForm.form?.filter((f) => f.is_show_to_view) || [];

//         if (yOffset > pageHeight - 80) {
//           doc.addPage();
//           yOffset = 30;
//         }

//         doc.setFontSize(14);
//         doc.setFont("helvetica", "bold");
//         doc.setTextColor(155, 89, 182);
//         doc.text(subForm.formName.toUpperCase(), 20, yOffset);
//         yOffset += 5;

//         const tableData = [];
//         dataArray.forEach((subFormRow, rowIdx) => {
//           const rowData = [rowIdx + 1];
//           visibleSubFields.forEach((field) => {
//             rowData.push(
//               getDisplayValue(subFormRow[field.field_name], field.field_type)
//             );
//           });
//           tableData.push(rowData);
//         });

//         const headers = ["Row"];
//         visibleSubFields.forEach((field) => {
//           headers.push(field.label || field.field_name);
//         });

//         autoTable(doc, {
//           startY: yOffset,
//           head: [headers],
//           body: tableData,
//           theme: "striped",
//           headStyles: {
//             fillColor: [155, 89, 182],
//             textColor: 255,
//             fontSize: 10,
//             fontStyle: "bold",
//             halign: "center",
//           },
//           bodyStyles: {
//             fontSize: 9,
//             textColor: [33, 37, 41],
//           },
//           columnStyles: {
//             0: {
//               cellWidth: 15,
//               fontStyle: "bold",
//               fillColor: [248, 249, 250],
//               textColor: [52, 73, 94],
//               halign: "center",
//             },
//           },
//           margin: { left: 20, right: 20 },
//           tableLineColor: [189, 195, 199],
//           tableLineWidth: 0.1,
//           alternateRowStyles: { fillColor: [252, 252, 252] },
//         });

//         yOffset = doc.lastAutoTable.finalY + 15;
//       });
//     }

//     const addFooter = () => {
//       const pageCount = doc.internal.getNumberOfPages();
//       for (let i = 1; i <= pageCount; i++) {
//         doc.setPage(i);
//         doc.setDrawColor(189, 195, 199);
//         doc.setLineWidth(0.3);
//         doc.line(20, pageHeight - 25, pageWidth - 20, pageHeight - 25);
//         doc.setFontSize(8);
//         doc.setFont("helvetica", "normal");
//         doc.setTextColor(108, 117, 125);
//         doc.text(`Form Management System`, 20, pageHeight - 15);
//         doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, pageHeight - 15, {
//           align: "right",
//         });
//       }
//     };

//     addFooter();

//     const fileName =
//       (formData.formName
//         ? formData.formName.replace(/[^a-zA-Z0-9]/g, "_")
//         : "FormData") +
//       "_Report_" +
//       new Date().toISOString().split("T")[0] +
//       ".pdf";
//     doc.save(fileName);
//   };

//   return (
//     <div
//       style={{
//         padding: "20px",
//         backgroundColor: "#f5f6fa",
//         minHeight: "85vh",
//       }}
//     >
//       {/* Header */}
//       <div
//         style={{
//           marginBottom: "20px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           flexWrap: "wrap",
//           gap: "15px",
//         }}
//       >
//         <div>
//           <h2
//             style={{
//               color: "#1e293b",
//               fontSize: "24px",
//               fontWeight: "700",
//               margin: 0,
//             }}
//           >
//             View Entry - {formData.formName}
//           </h2>
//           <p
//             style={{ color: "#64748b", fontSize: "14px", margin: "5px 0 0 0" }}
//           >
//             Complete details with multi-module data
//           </p>
//         </div>
//         <div style={{ display: "flex", gap: "10px" }}>
//           <button
//             onClick={handleExportPDF}
//             style={{
//               padding: "10px 20px",
//               backgroundColor: "#2980b9",
//               color: "#fff",
//               border: "none",
//               borderRadius: "8px",
//               cursor: "pointer",
//               fontSize: "14px",
//               fontWeight: "500",
//               boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//             }}
//           >
//             Export PDF
//           </button>
//           <button
//             onClick={() => navigate(-1)}
//             style={{
//               padding: "10px 20px",
//               backgroundColor: "#64748b",
//               color: "#fff",
//               border: "none",
//               borderRadius: "8px",
//               cursor: "pointer",
//               fontSize: "14px",
//               fontWeight: "500",
//             }}
//           >
//             Back
//           </button>
//         </div>
//       </div>

//       {/* Parent Card with Scroll */}
//       <div
//         style={{
//           backgroundColor: "#fff",
//           borderRadius: "12px",
//           padding: "20px",
//           boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//           border: "1px solid #e2e8f0",
//           maxHeight: "73vh",
//           overflowY: "auto",
//         }}
//       >
//         {/* Main Form Section */}
//         <h3
//           style={{
//             fontSize: "18px",
//             fontWeight: "700",
//             color: "#1e293b",
//             marginBottom: "20px",
//             paddingBottom: "12px",
//             borderBottom: "2px solid #e2e8f0",
//           }}
//         >
//           Main Form Details
//         </h3>

//         {/* Two Tables Side by Side */}
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(2, 1fr)",
//             gap: "20px",
//             marginBottom: "20px",
//           }}
//         >
//           {/* Left Table */}
//           <div
//             style={{
//               backgroundColor: "#fff",
//               borderRadius: "12px",
//               border: "1px solid #e2e8f0",
//               overflow: "hidden",
//               boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//             }}
//           >
//             <table style={{ width: "100%", borderCollapse: "collapse" }}>
//               <tbody>
//                 <tr>
//                   <td style={tableFieldLabel}>Organization Name</td>
//                   <td style={tableFieldValue}>
//                     {entryData.organizationName || "-"}
//                   </td>
//                 </tr>
//                 <tr>
//                   <td style={tableFieldLabel}>Form Id</td>
//                   <td style={tableFieldValue}>{entryData.formId || "-"}</td>
//                 </tr>
//                 <tr>
//                   <td style={tableFieldLabel}>Form Name</td>
//                   <td style={tableFieldValue}>{entryData.formName || "-"}</td>
//                 </tr>
//                 <tr>
//                   <td style={tableFieldLabel}>Is Main Form</td>
//                   <td style={tableFieldValue}>Yes</td>
//                 </tr>
//                 <tr>
//                   <td style={{ ...tableFieldLabel, borderBottom: "none" }}>
//                     Description
//                   </td>
//                   <td style={{ ...tableFieldValue, borderBottom: "none" }}>
//                     {formData.description || "-"}
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>

//           {/* Right Table */}
//           <div
//             style={{
//               backgroundColor: "#fff",
//               borderRadius: "12px",
//               border: "1px solid #e2e8f0",
//               overflow: "hidden",
//               boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//             }}
//           >
//             <table style={{ width: "100%", borderCollapse: "collapse" }}>
//               <tbody>
//                 <tr>
//                   <td style={tableFieldLabel}>Main Form Name</td>
//                   <td style={tableFieldValue}>-</td>
//                 </tr>
//                 <tr>
//                   <td style={tableFieldLabel}>Status</td>
//                   <td style={tableFieldValue}>{formData.status || "Active"}</td>
//                 </tr>
//                 <tr>
//                   <td style={tableFieldLabel}>Created At</td>
//                   <td style={tableFieldValue}>{entryData.createdAt || "-"}</td>
//                 </tr>
//                 <tr>
//                   <td style={{ ...tableFieldLabel, borderBottom: "none" }}>
//                     Updated At
//                   </td>
//                   <td style={{ ...tableFieldValue, borderBottom: "none" }}>
//                     {entryData.updatedAt || "-"}
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Form Fields in Full Width Table */}
//         {visibleFields.length > 0 && (
//           <div
//             style={{
//               backgroundColor: "#fff",
//               borderRadius: "12px",
//               border: "1px solid #e2e8f0",
//               overflow: "hidden",
//               marginBottom: "20px",
//               boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//             }}
//           >
//             <table style={{ width: "100%", borderCollapse: "collapse" }}>
//               <tbody>
//                 {visibleFields.map((field, idx) => (
//                   <tr key={idx}>
//                     <td
//                       style={
//                         idx === visibleFields.length - 1
//                           ? { ...tableFieldLabel, borderBottom: "none" }
//                           : tableFieldLabel
//                       }
//                     >
//                       {field.label || field.field_name}
//                     </td>
//                     <td
//                       style={
//                         idx === visibleFields.length - 1
//                           ? { ...tableFieldValue, borderBottom: "none" }
//                           : tableFieldValue
//                       }
//                     >
//                       {getDisplayValue(
//                         entryData[field.field_name],
//                         field.field_type
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Multi-Module Sections */}
//         {relatedSubForms.length > 0 && (
//           <div>
//             <h3
//               style={{
//                 fontSize: "20px",
//                 fontWeight: "700",
//                 color: "#1e293b",
//                 marginBottom: "16px",
//               }}
//             >
//               Multi-Modules
//             </h3>
//             {relatedSubForms.map((subFormConfig, idx) => {
//               const subFormDataArray =
//                 entryData.subForms?.[subFormConfig.formId];
//               if (!subFormDataArray) return null;

//               const dataArray = Array.isArray(subFormDataArray)
//                 ? subFormDataArray
//                 : [subFormDataArray];

//               const visibleSubFields =
//                 subFormConfig.form?.filter((f) => f.is_show_to_view) || [];

//               // Check if there are any file fields
//               const hasFileFields = visibleSubFields.some(
//                 (f) => f.field_type === "file"
//               );

//               const sectionId = `subform-${idx}`;
//               const isExpanded = expandedSections[sectionId] !== false;

//               return (
//                 <div
//                   key={idx}
//                   style={{
//                     backgroundColor: "#fff",
//                     borderRadius: "12px",
//                     marginBottom: "16px",
//                     boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//                     border: "1px solid #e2e8f0",
//                     overflow: "hidden",
//                   }}
//                 >
//                   {/* Accordion Header */}
//                   <div
//                     onClick={() => toggleSection(sectionId)}
//                     style={{
//                       padding: "16px 24px",
//                       backgroundColor: "#f8f9fa",
//                       cursor: "pointer",
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       borderBottom: isExpanded ? "1px solid #e2e8f0" : "none",
//                     }}
//                   >
//                     <div>
//                       <h4
//                         style={{
//                           fontSize: "16px",
//                           fontWeight: "600",
//                           color: "#9b59b6",
//                           margin: 0,
//                         }}
//                       >
//                         {subFormConfig.formName}
//                       </h4>
//                       <p
//                         style={{
//                           fontSize: "13px",
//                           color: "#64748b",
//                           margin: "4px 0 0 0",
//                         }}
//                       >
//                         {dataArray.length}{" "}
//                         {dataArray.length === 1 ? "row" : "rows"}
//                       </p>
//                     </div>
//                     {isExpanded ? (
//                       <ChevronUp size={20} color="#64748b" />
//                     ) : (
//                       <ChevronDown size={20} color="#64748b" />
//                     )}
//                   </div>

//                   {/* Accordion Content */}
//                   {isExpanded && (
//                     <div style={{ padding: "16px" }}>
//                       <div style={{ overflowX: "auto" }}>
//                         <table
//                           style={{
//                             width: "100%",
//                             borderCollapse: "collapse",
//                             minWidth: "600px",
//                           }}
//                         >
//                           <thead>
//                             <tr style={{ backgroundColor: "#f8f9fa" }}>
//                               <th style={tableHeaderStyle}>Row</th>
//                               {visibleSubFields.map((field, fIdx) => (
//                                 <th key={fIdx} style={tableHeaderStyle}>
//                                   {field.label || field.field_name}
//                                 </th>
//                               ))}
//                               {/* File Preview Column Header */}
//                               {hasFileFields && (
//                                 <th
//                                   style={{
//                                     ...tableHeaderStyle,
//                                     textAlign: "center",
//                                     width: "150px",
//                                   }}
//                                 >
//                                   FILE PREVIEW
//                                 </th>
//                               )}
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {dataArray.map((rowData, rowIdx) => (
//                               <tr
//                                 key={rowIdx}
//                                 style={{
//                                   borderBottom: "1px solid #e2e8f0",
//                                   transition: "background-color 0.2s",
//                                 }}
//                                 onMouseEnter={(e) => {
//                                   e.currentTarget.style.backgroundColor =
//                                     "#f8fafc";
//                                 }}
//                                 onMouseLeave={(e) => {
//                                   e.currentTarget.style.backgroundColor =
//                                     "transparent";
//                                 }}
//                               >
//                                 <td style={tableCellStyle}>
//                                   <span
//                                     style={{
//                                       backgroundColor: "#e0e7ff",
//                                       color: "#4338ca",
//                                       padding: "4px 10px",
//                                       borderRadius: "6px",
//                                       fontSize: "12px",
//                                       fontWeight: "600",
//                                     }}
//                                   >
//                                     {rowIdx + 1}
//                                   </span>
//                                 </td>
//                                 {visibleSubFields.map((field, fIdx) => (
//                                   <td key={fIdx} style={tableCellStyle}>
//                                     {getDisplayValue(
//                                       rowData[field.field_name],
//                                       field.field_type
//                                     )}
//                                   </td>
//                                 ))}

//                                 {/* File Preview Column */}
//                                 {hasFileFields && (
//                                   <td
//                                     style={{
//                                       ...tableCellStyle,
//                                       textAlign: "center",
//                                       verticalAlign: "middle",
//                                     }}
//                                   >
//                                     {(() => {
//                                       const fileFields =
//                                         visibleSubFields.filter(
//                                           (f) => f.field_type === "file"
//                                         );
//                                       const filesInRow = fileFields
//                                         .map((f) => rowData[f.field_name])
//                                         .filter(Boolean);

//                                       if (filesInRow.length === 0) {
//                                         return (
//                                           <span style={{ color: "#94a3b8" }}>
//                                             -
//                                           </span>
//                                         );
//                                       }

//                                       return (
//                                         <div
//                                           style={{
//                                             display: "flex",
//                                             gap: "10px",
//                                             flexWrap: "wrap",
//                                             justifyContent: "center",
//                                           }}
//                                         >
//                                           {filesInRow.map(
//                                             (fileData, fileIdx) => (
//                                               <a
//                                                 key={fileIdx}
//                                                 href={fileData.base64}
//                                                 download={fileData.name}
//                                                 style={{
//                                                   textDecoration: "none",
//                                                   cursor: "pointer",
//                                                   display: "inline-block",
//                                                   transition: "transform 0.2s",
//                                                 }}
//                                                 onMouseEnter={(e) => {
//                                                   e.currentTarget.style.transform =
//                                                     "scale(1.05)";
//                                                 }}
//                                                 onMouseLeave={(e) => {
//                                                   e.currentTarget.style.transform =
//                                                     "scale(1)";
//                                                 }}
//                                               >
//                                                 {fileData.type?.startsWith(
//                                                   "image/"
//                                                 ) &&
//                                                   fileData.base64 && (
//                                                     <img
//                                                       src={fileData.base64}
//                                                       alt={fileData.name}
//                                                       title={`Click to download: ${fileData.name}`}
//                                                       style={{
//                                                         width: "80px",
//                                                         height: "80px",
//                                                         objectFit: "cover",
//                                                         borderRadius: "6px",
//                                                         border:
//                                                           "2px solid #e2e8f0",
//                                                         boxShadow:
//                                                           "0 2px 4px rgba(0,0,0,0.1)",
//                                                       }}
//                                                     />
//                                                   )}

//                                                 {fileData.type ===
//                                                   "application/pdf" && (
//                                                   <div
//                                                     title={`Click to download: ${fileData.name}`}
//                                                     style={{
//                                                       width: "80px",
//                                                       height: "80px",
//                                                       display: "flex",
//                                                       flexDirection: "column",
//                                                       alignItems: "center",
//                                                       justifyContent: "center",
//                                                       background:
//                                                         "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
//                                                       borderRadius: "8px",
//                                                       color: "white",
//                                                       boxShadow:
//                                                         "0 2px 4px rgba(220,53,69,0.3)",
//                                                     }}
//                                                   >
//                                                     <FileText size={32} />
//                                                     <span
//                                                       style={{
//                                                         fontSize: "10px",
//                                                         marginTop: "4px",
//                                                       }}
//                                                     >
//                                                       PDF
//                                                     </span>
//                                                   </div>
//                                                 )}

//                                                 {(fileData.type ===
//                                                   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
//                                                   fileData.type ===
//                                                     "application/vnd.ms-excel") && (
//                                                   <div
//                                                     title={`Click to download: ${fileData.name}`}
//                                                     style={{
//                                                       width: "80px",
//                                                       height: "80px",
//                                                       display: "flex",
//                                                       flexDirection: "column",
//                                                       alignItems: "center",
//                                                       justifyContent: "center",
//                                                       background:
//                                                         "linear-gradient(135deg, #28a745 0%, #218838 100%)",
//                                                       borderRadius: "8px",
//                                                       color: "white",
//                                                       fontSize: "32px",
//                                                       boxShadow:
//                                                         "0 2px 4px rgba(40,167,69,0.3)",
//                                                     }}
//                                                   >
//                                                     <span>📊</span>
//                                                     <span
//                                                       style={{
//                                                         fontSize: "10px",
//                                                         marginTop: "4px",
//                                                       }}
//                                                     >
//                                                       EXCEL
//                                                     </span>
//                                                   </div>
//                                                 )}
//                                               </a>
//                                             )
//                                           )}
//                                         </div>
//                                       );
//                                     })()}
//                                   </td>
//                                 )}
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // Styles
// const tableFieldLabel = {
//   padding: "12px",
//   fontWeight: "600",
//   color: "#334155",
//   backgroundColor: "#f8f9fa",
//   fontSize: "13px",
//   width: "40%",
//   verticalAlign: "top",
//   borderBottom: "1px solid #e2e8f0",
//   textAlign: "left",
// };

// const tableFieldValue = {
//   padding: "10px",
//   color: "#1e293b",
//   fontSize: "13px",
//   wordBreak: "break-word",
//   borderBottom: "1px solid #e2e8f0",
//   textAlign: "left",
// };

// const tableHeaderStyle = {
//   padding: "12px",
//   textAlign: "left",
//   fontSize: "13px",
//   fontWeight: "600",
//   color: "#334155",
//   borderBottom: "2px solid #e2e8f0",
//   whiteSpace: "nowrap",
// };

// const tableCellStyle = {
//   padding: "10px",
//   fontSize: "13px",
//   color: "#1e293b",
//   textAlign: "left",
// };

// export default MenuFormView;

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, FileText } from "react-feather";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const MenuFormView = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const formData = location.state?.formData;
  const entryData = location.state?.entryData;
  const allForms = location.state?.allForms || [];

  const [expandedSections, setExpandedSections] = useState({});

  // Image Modal State
  const [imageModal, setImageModal] = useState({
    show: false,
    src: "",
    name: "",
  });

  if (!formData || !entryData) {
    return (
      <div style={{ padding: "20px" }}>
        <h3>Data not found.</h3>
        <button onClick={() => navigate(-1)}>Back</button>
      </div>
    );
  }

  const visibleFields = formData.form.filter((f) => f.is_show_to_view);
  const relatedSubForms = allForms.filter(
    (f) => f.mainFormName === formData.formId && !f.isMainForm
  );

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const getDisplayValue = (value, fieldType) => {
    if (!value) return "-";
    if (fieldType === "file" && typeof value === "object" && value.name) {
      return value.name;
    }
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    return String(value);
  };

  // File Click Handler for Preview
  const handleFileClick = (fileData) => {
    if (!fileData) return;

    if (fileData.type?.startsWith("image/")) {
      // Image ko modal mein dikhao
      setImageModal({ show: true, src: fileData.base64, name: fileData.name });
    } else if (fileData.type === "application/pdf") {
      // PDF ko new tab mein kholo
      const newWindow = window.open();
      newWindow.document.write(`
        <html>
          <head>
            <title>${fileData.name}</title>
          </head>
          <body style="margin: 0;">
            <iframe src="${fileData.base64}" style="width: 100%; height: 100vh; border: none;"></iframe>
          </body>
        </html>
      `);
      newWindow.document.close();
    } else if (
      fileData.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      fileData.type === "application/vnd.ms-excel"
    ) {
      // Excel ko directly download karo
      const link = document.createElement("a");
      link.href = fileData.base64;
      link.download = fileData.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let yOffset = 30;

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(41, 128, 185);
    doc.text("FORM DATA REPORT", pageWidth / 2, yOffset, { align: "center" });

    yOffset += 8;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Generated on: ${new Date().toLocaleDateString(
        "en-IN"
      )} at ${new Date().toLocaleTimeString("en-IN")}`,
      pageWidth / 2,
      yOffset,
      { align: "center" }
    );

    yOffset += 10;
    doc.setDrawColor(41, 128, 185);
    doc.setLineWidth(0.8);
    doc.line(20, yOffset, pageWidth - 20, yOffset);
    yOffset += 15;

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(
      `${formData.formName || "Main Form"} - Complete Data`,
      20,
      yOffset
    );
    yOffset += 15;

    const addTable = (
      title,
      fields,
      data,
      extraInfo = {},
      isSubForm = false
    ) => {
      if (yOffset > pageHeight - 80) {
        doc.addPage();
        yOffset = 30;
      }

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(
        isSubForm ? 155 : 52,
        isSubForm ? 89 : 73,
        isSubForm ? 182 : 94
      );
      doc.text(title.toUpperCase(), 20, yOffset);
      yOffset += 5;

      const tableData = [];

      Object.entries(extraInfo).forEach(([key, value]) => {
        tableData.push([String(key), String(value || "Not Available")]);
      });

      if (Object.keys(extraInfo).length > 0 && fields.length > 0) {
        tableData.push(["--- FORM FIELDS ---", "--- VALUES ---"]);
      }

      fields.forEach((field) => {
        const fieldName = String(
          field.label || field.field_name || "Unnamed Field"
        );
        const fieldValue = getDisplayValue(
          data[field.field_name],
          field.field_type
        );
        tableData.push([fieldName, fieldValue]);
      });

      autoTable(doc, {
        startY: yOffset,
        head: [["Field Description", "Value"]],
        body: tableData,
        theme: "striped",
        headStyles: {
          fillColor: isSubForm ? [155, 89, 182] : [52, 73, 94],
          textColor: 255,
          fontSize: 11,
          fontStyle: "bold",
          halign: "center",
        },
        bodyStyles: {
          fontSize: 10,
          textColor: [33, 37, 41],
        },
        columnStyles: {
          0: {
            cellWidth: 70,
            fontStyle: "bold",
            fillColor: [248, 249, 250],
            textColor: [52, 73, 94],
          },
          1: {
            cellWidth: 110,
          },
        },
        margin: { left: 20, right: 20 },
        tableLineColor: [189, 195, 199],
        tableLineWidth: 0.1,
        alternateRowStyles: { fillColor: [252, 252, 252] },
      });

      yOffset = doc.lastAutoTable.finalY + 15;
    };

    const mainExtraInfo = {
      ORGANIZATION: entryData.organizationName || "N/A",
      "FORM ID": entryData.formId || "N/A",
      "FORM TYPE": entryData.FormType || "-",
      STATUS: formData.status || "Active",
      "CREATED DATE": entryData.createdAt
        ? new Date(entryData.createdAt).toLocaleDateString("en-IN")
        : "Not Available",
      "LAST UPDATED": entryData.updatedAt
        ? new Date(entryData.updatedAt).toLocaleDateString("en-IN")
        : "Not Available",
    };

    addTable(
      formData.formName + " - Main Form Data",
      visibleFields,
      entryData,
      mainExtraInfo,
      false
    );

    if (relatedSubForms.length > 0) {
      if (yOffset > pageHeight - 60) {
        doc.addPage();
        yOffset = 30;
      }

      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(155, 89, 182);
      doc.text("MULTI-MODULES", 20, yOffset);
      yOffset += 10;
      doc.setDrawColor(155, 89, 182);
      doc.setLineWidth(0.5);
      doc.line(20, yOffset, pageWidth - 20, yOffset);
      yOffset += 15;

      relatedSubForms.forEach((subForm) => {
        const subFormDataArray = entryData.subForms?.[subForm.formId];
        if (!subFormDataArray) return;

        const dataArray = Array.isArray(subFormDataArray)
          ? subFormDataArray
          : [subFormDataArray];

        const visibleSubFields =
          subForm.form?.filter((f) => f.is_show_to_view) || [];

        if (yOffset > pageHeight - 80) {
          doc.addPage();
          yOffset = 30;
        }

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(155, 89, 182);
        doc.text(subForm.formName.toUpperCase(), 20, yOffset);
        yOffset += 5;

        const tableData = [];
        dataArray.forEach((subFormRow, rowIdx) => {
          const rowData = [rowIdx + 1];
          visibleSubFields.forEach((field) => {
            rowData.push(
              getDisplayValue(subFormRow[field.field_name], field.field_type)
            );
          });
          tableData.push(rowData);
        });

        const headers = ["Row"];
        visibleSubFields.forEach((field) => {
          headers.push(field.label || field.field_name);
        });

        autoTable(doc, {
          startY: yOffset,
          head: [headers],
          body: tableData,
          theme: "striped",
          headStyles: {
            fillColor: [155, 89, 182],
            textColor: 255,
            fontSize: 10,
            fontStyle: "bold",
            halign: "center",
          },
          bodyStyles: {
            fontSize: 9,
            textColor: [33, 37, 41],
          },
          columnStyles: {
            0: {
              cellWidth: 15,
              fontStyle: "bold",
              fillColor: [248, 249, 250],
              textColor: [52, 73, 94],
              halign: "center",
            },
          },
          margin: { left: 20, right: 20 },
          tableLineColor: [189, 195, 199],
          tableLineWidth: 0.1,
          alternateRowStyles: { fillColor: [252, 252, 252] },
        });

        yOffset = doc.lastAutoTable.finalY + 15;
      });
    }

    const addFooter = () => {
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setDrawColor(189, 195, 199);
        doc.setLineWidth(0.3);
        doc.line(20, pageHeight - 25, pageWidth - 20, pageHeight - 25);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(108, 117, 125);
        doc.text(`Form Management System`, 20, pageHeight - 15);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, pageHeight - 15, {
          align: "right",
        });
      }
    };

    addFooter();

    const fileName =
      (formData.formName
        ? formData.formName.replace(/[^a-zA-Z0-9]/g, "_")
        : "FormData") +
      "_Report_" +
      new Date().toISOString().split("T")[0] +
      ".pdf";
    doc.save(fileName);
  };

  return (
    <div
      style={{ padding: "20px", backgroundColor: "#f5f6fa", minHeight: "85vh" }}
    >
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <div>
          <h2
            style={{
              color: "#1e293b",
              fontSize: "24px",
              fontWeight: "700",
              margin: 0,
            }}
          >
            View Entry - {formData.formName}
          </h2>
          <p
            style={{ color: "#64748b", fontSize: "14px", margin: "5px 0 0 0" }}
          >
            Complete details with multi-module data
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleExportPDF}
            style={{
              padding: "10px 20px",
              backgroundColor: "#2980b9",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            Export PDF
          </button>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#64748b",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Back
          </button>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          border: "1px solid #e2e8f0",
          maxHeight: "73vh",
          overflowY: "auto",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#1e293b",
            marginBottom: "20px",
            paddingBottom: "12px",
            borderBottom: "2px solid #e2e8f0",
          }}
        >
          Main Form Details
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={tableFieldLabel}>Organization Name</td>
                  <td style={tableFieldValue}>
                    {entryData.organizationName || "-"}
                  </td>
                </tr>
                <tr>
                  <td style={tableFieldLabel}>Form Id</td>
                  <td style={tableFieldValue}>{entryData.formId || "-"}</td>
                </tr>
                <tr>
                  <td style={tableFieldLabel}>Form Name</td>
                  <td style={tableFieldValue}>{entryData.formName || "-"}</td>
                </tr>
                <tr>
                  <td style={tableFieldLabel}>Is Main Form</td>
                  <td style={tableFieldValue}>Yes</td>
                </tr>
                <tr>
                  <td style={{ ...tableFieldLabel, borderBottom: "none" }}>
                    Description
                  </td>
                  <td style={{ ...tableFieldValue, borderBottom: "none" }}>
                    {formData.description || "-"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={tableFieldLabel}>Main Form Name</td>
                  <td style={tableFieldValue}>-</td>
                </tr>
                <tr>
                  <td style={tableFieldLabel}>Status</td>
                  <td style={tableFieldValue}>{formData.status || "Active"}</td>
                </tr>
                <tr>
                  <td style={tableFieldLabel}>Created At</td>
                  <td style={tableFieldValue}>{entryData.createdAt || "-"}</td>
                </tr>
                <tr>
                  <td style={{ ...tableFieldLabel, borderBottom: "none" }}>
                    Updated At
                  </td>
                  <td style={{ ...tableFieldValue, borderBottom: "none" }}>
                    {entryData.updatedAt || "-"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {visibleFields.length > 0 && (
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              overflow: "hidden",
              marginBottom: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {visibleFields.map((field, idx) => (
                  <tr key={idx}>
                    <td
                      style={
                        idx === visibleFields.length - 1
                          ? { ...tableFieldLabel, borderBottom: "none" }
                          : tableFieldLabel
                      }
                    >
                      {field.label || field.field_name}
                    </td>
                    <td
                      style={
                        idx === visibleFields.length - 1
                          ? { ...tableFieldValue, borderBottom: "none" }
                          : tableFieldValue
                      }
                    >
                      {getDisplayValue(
                        entryData[field.field_name],
                        field.field_type
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {relatedSubForms.length > 0 && (
          <div>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "#1e293b",
                marginBottom: "16px",
              }}
            >
              Multi-Modules
            </h3>
            {relatedSubForms.map((subFormConfig, idx) => {
              const subFormDataArray =
                entryData.subForms?.[subFormConfig.formId];
              if (!subFormDataArray) return null;

              const dataArray = Array.isArray(subFormDataArray)
                ? subFormDataArray
                : [subFormDataArray];

              const visibleSubFields =
                subFormConfig.form?.filter((f) => f.is_show_to_view) || [];

              const hasFileFields = visibleSubFields.some(
                (f) => f.field_type === "file"
              );

              const sectionId = `subform-${idx}`;
              const isExpanded = expandedSections[sectionId] !== false;

              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    marginBottom: "16px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    border: "1px solid #e2e8f0",
                    overflow: "hidden",
                  }}
                >
                  <div
                    onClick={() => toggleSection(sectionId)}
                    style={{
                      padding: "16px 24px",
                      backgroundColor: "#f8f9fa",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: isExpanded ? "1px solid #e2e8f0" : "none",
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#9b59b6",
                          margin: 0,
                        }}
                      >
                        {subFormConfig.formName}
                      </h4>
                      <p
                        style={{
                          fontSize: "13px",
                          color: "#64748b",
                          margin: "4px 0 0 0",
                        }}
                      >
                        {dataArray.length}{" "}
                        {dataArray.length === 1 ? "row" : "rows"}
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp size={20} color="#64748b" />
                    ) : (
                      <ChevronDown size={20} color="#64748b" />
                    )}
                  </div>

                  {isExpanded && (
                    <div style={{ padding: "16px" }}>
                      <div style={{ overflowX: "auto" }}>
                        <table
                          style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            minWidth: "600px",
                          }}
                        >
                          <thead>
                            <tr style={{ backgroundColor: "#f8f9fa" }}>
                              <th style={tableHeaderStyle}>Row</th>
                              {visibleSubFields.map((field, fIdx) => (
                                <th key={fIdx} style={tableHeaderStyle}>
                                  {field.label || field.field_name}
                                </th>
                              ))}
                              {hasFileFields && (
                                <th
                                  style={{
                                    ...tableHeaderStyle,
                                    textAlign: "center",
                                    width: "150px",
                                  }}
                                >
                                  FILE PREVIEW
                                </th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {dataArray.map((rowData, rowIdx) => (
                              <tr
                                key={rowIdx}
                                style={{
                                  borderBottom: "1px solid #e2e8f0",
                                  transition: "background-color 0.2s",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "#f8fafc";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "transparent";
                                }}
                              >
                                <td style={tableCellStyle}>
                                  <span
                                    style={{
                                      backgroundColor: "#e0e7ff",
                                      color: "#4338ca",
                                      padding: "4px 10px",
                                      borderRadius: "6px",
                                      fontSize: "12px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    {rowIdx + 1}
                                  </span>
                                </td>
                                {visibleSubFields.map((field, fIdx) => (
                                  <td key={fIdx} style={tableCellStyle}>
                                    {getDisplayValue(
                                      rowData[field.field_name],
                                      field.field_type
                                    )}
                                  </td>
                                ))}

                                {hasFileFields && (
                                  <td
                                    style={{
                                      ...tableCellStyle,
                                      textAlign: "center",
                                      verticalAlign: "middle",
                                    }}
                                  >
                                    {(() => {
                                      const fileFields =
                                        visibleSubFields.filter(
                                          (f) => f.field_type === "file"
                                        );
                                      const filesInRow = fileFields
                                        .map((f) => rowData[f.field_name])
                                        .filter(Boolean);

                                      if (filesInRow.length === 0) {
                                        return (
                                          <span style={{ color: "#94a3b8" }}>
                                            -
                                          </span>
                                        );
                                      }

                                      return (
                                        <div
                                          style={{
                                            display: "flex",
                                            gap: "10px",
                                            flexWrap: "wrap",
                                            justifyContent: "center",
                                          }}
                                        >
                                          {filesInRow.map(
                                            (fileData, fileIdx) => (
                                              <div
                                                key={fileIdx}
                                                onClick={() =>
                                                  handleFileClick(fileData)
                                                }
                                                style={{
                                                  textAlign: "center",
                                                  cursor: "pointer",
                                                  textDecoration: "none",
                                                }}
                                              >
                                                {fileData.type?.startsWith(
                                                  "image/"
                                                ) &&
                                                  fileData.base64 && (
                                                    <img
                                                      src={fileData.base64}
                                                      alt="Preview"
                                                      style={{
                                                        width: "80px",
                                                        height: "80px",
                                                        objectFit: "cover",
                                                        borderRadius: "6px",
                                                        border:
                                                          "2px solid #e2e8f0",
                                                        boxShadow:
                                                          "0 2px 4px rgba(0,0,0,0.1)",
                                                        transition:
                                                          "transform 0.2s",
                                                      }}
                                                      onMouseEnter={(e) =>
                                                        (e.target.style.transform =
                                                          "scale(1.05)")
                                                      }
                                                      onMouseLeave={(e) =>
                                                        (e.target.style.transform =
                                                          "scale(1)")
                                                      }
                                                    />
                                                  )}

                                                {fileData.type ===
                                                  "application/pdf" && (
                                                  <div
                                                    style={{
                                                      width: "80px",
                                                      height: "80px",
                                                      display: "flex",
                                                      flexDirection: "column",
                                                      alignItems: "center",
                                                      justifyContent: "center",
                                                      background:
                                                        "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
                                                      borderRadius: "8px",
                                                      color: "white",
                                                      boxShadow:
                                                        "0 2px 4px rgba(220,53,69,0.3)",
                                                      transition:
                                                        "transform 0.2s",
                                                    }}
                                                    onMouseEnter={(e) =>
                                                      (e.currentTarget.style.transform =
                                                        "scale(1.05)")
                                                    }
                                                    onMouseLeave={(e) =>
                                                      (e.currentTarget.style.transform =
                                                        "scale(1)")
                                                    }
                                                  >
                                                    <FileText size={32} />
                                                    <span
                                                      style={{
                                                        fontSize: "10px",
                                                        marginTop: "4px",
                                                      }}
                                                    >
                                                      PDF
                                                    </span>
                                                  </div>
                                                )}

                                                {(fileData.type ===
                                                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                                                  fileData.type ===
                                                    "application/vnd.ms-excel") && (
                                                  <div
                                                    style={{
                                                      width: "80px",
                                                      height: "80px",
                                                      display: "flex",
                                                      flexDirection: "column",
                                                      alignItems: "center",
                                                      justifyContent: "center",
                                                      background:
                                                        "linear-gradient(135deg, #28a745 0%, #218838 100%)",
                                                      borderRadius: "8px",
                                                      color: "white",
                                                      fontSize: "32px",
                                                      boxShadow:
                                                        "0 2px 4px rgba(40,167,69,0.3)",
                                                      transition:
                                                        "transform 0.2s",
                                                    }}
                                                    onMouseEnter={(e) =>
                                                      (e.currentTarget.style.transform =
                                                        "scale(1.05)")
                                                    }
                                                    onMouseLeave={(e) =>
                                                      (e.currentTarget.style.transform =
                                                        "scale(1)")
                                                    }
                                                  >
                                                    <span>📊</span>
                                                    <span
                                                      style={{
                                                        fontSize: "10px",
                                                        marginTop: "4px",
                                                      }}
                                                    >
                                                      EXCEL
                                                    </span>
                                                  </div>
                                                )}
                                              </div>
                                            )
                                          )}
                                        </div>
                                      );
                                    })()}
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {imageModal.show && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
          onClick={() => setImageModal({ show: false, src: "", name: "" })}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "90%",
              maxHeight: "90%",
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 10px 50px rgba(0, 0, 0, 0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                fontSize: "20px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                zIndex: 10,
              }}
              onClick={() => setImageModal({ show: false, src: "", name: "" })}
            >
              ×
            </button>
            <img
              src={imageModal.src}
              alt={imageModal.name}
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
            <p
              style={{
                textAlign: "center",
                marginTop: "15px",
                marginBottom: "0",
                color: "#64748b",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              {imageModal.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const tableFieldLabel = {
  padding: "12px",
  fontWeight: "600",
  color: "#334155",
  backgroundColor: "#f8f9fa",
  fontSize: "13px",
  width: "40%",
  verticalAlign: "top",
  borderBottom: "1px solid #e2e8f0",
  textAlign: "left",
};

const tableFieldValue = {
  padding: "10px",
  color: "#1e293b",
  fontSize: "13px",
  wordBreak: "break-word",
  borderBottom: "1px solid #e2e8f0",
  textAlign: "left",
};

const tableHeaderStyle = {
  padding: "12px",
  textAlign: "left",
  fontSize: "13px",
  fontWeight: "600",
  color: "#334155",
  borderBottom: "2px solid #e2e8f0",
  whiteSpace: "nowrap",
};

const tableCellStyle = {
  padding: "10px",
  fontSize: "13px",
  color: "#1e293b",
  textAlign: "left",
};

export default MenuFormView;
