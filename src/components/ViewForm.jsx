// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// const ViewForm = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const formData = location.state?.formData;

//   if (!formData) {
//     return (
//       <div style={{ padding: "20px" }}>
//         <h3>No form data found.</h3>
//         <button onClick={() => navigate(-1)}>Back</button>
//       </div>
//     );
//   }

//   // PDF Export Function
//   const handleExportPDF = () => {
//     const doc = new jsPDF();
//     let yOffset = 20;

//     doc.setFontSize(16);
//     doc.text(
//       formData.formName ? `${formData.formName} Form` : "Form Data",
//       14,
//       yOffset
//     );
//     yOffset += 10;

//     const leftData = [
//       ["Organization Name", formData.organizationName],
//       ["Form Id", formData.formId],
//       ["Form Name", formData.formName],
//       ["Is Main Form", formData.isMainForm ? "Yes" : "No"],
//       ["Description", formData.description],
//     ];

//     autoTable(doc, {
//       startY: yOffset,
//       head: [["Label", "Value"]],
//       body: leftData,
//       theme: "grid",
//       headStyles: { fillColor: [22, 160, 133] },
//       styles: { fontSize: 10 },
//       margin: { left: 14, right: 14 },
//     });

//     yOffset = doc.lastAutoTable.finalY + 10;

//     const rightData = [
//       ["Main Form Name", formData.mainFormName || "-"],
//       ["Status", formData.active ? "Active" : "Inactive"],
//       ["Created At", formData.createdAt || "-"],
//       ["Updated At", formData.updatedAt || "-"],
//     ];

//     autoTable(doc, {
//       startY: yOffset,
//       head: [["Label", "Value"]],
//       body: rightData,
//       theme: "grid",
//       headStyles: { fillColor: [22, 160, 133] },
//       styles: { fontSize: 10 },
//       margin: { left: 14, right: 14 },
//     });

//     yOffset = doc.lastAutoTable.finalY + 10;

//     const fieldData =
//       formData.form
//         ?.filter((f) => f.is_show_to_view)
//         .map((field) => [
//           field.field_name,
//           field.field_type,
//           field.placeholder,
//           field.label,
//         ]) || [];

//     if (fieldData.length > 0) {
//       autoTable(doc, {
//         startY: yOffset,
//         head: [["Field Name", "Field Type", "Placeholder", "Label"]],
//         body: fieldData,
//         theme: "grid",
//         headStyles: { fillColor: [22, 160, 133] },
//         styles: { fontSize: 10 },
//         margin: { left: 14, right: 14 },
//       });
//     }

//     doc.save(`${formData.formName || "Form"}_View.pdf`);
//   };

//   return (
//     <div style={{ padding: "30px" }}>
//       {/* Header Section */}
//       <div
//         style={{
//           marginBottom: "17px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//         }}
//       >
//         <div>
//           <span
//             style={{ color: "#6e6b6bff", fontSize: "18px", fontWeight: 700 }}
//           >
//             View State
//           </span>{" "}
//           |{" "}
//           <span
//             style={{ color: "#6e6b6bff", fontSize: "18px", fontWeight: 700 }}
//           >
//             Home >> {formData.formName} Form
//           </span>
//           <button
//             onClick={handleExportPDF}
//             style={{
//               padding: "6px 14px",
//               backgroundColor: "#2e86de",
//               color: "#fff",
//               border: "none",
//               borderRadius: "4px",
//               cursor: "pointer",
//               marginLeft: "20px",
//             }}
//           >
//             Export PDF
//           </button>
//         </div>

//         <div>
//           <button
//             onClick={() => navigate(-1)}
//             style={{
//               padding: "8px 16px",
//               backgroundColor: "#555",
//               color: "#fff",
//               border: "none",
//               borderRadius: "4px",
//               cursor: "pointer",
//             }}
//           >
//             Back
//           </button>
//         </div>
//       </div>

//       {/* Parent Card with Scroll */}
//       <div
//         style={{
//           border: "1px solid #ddd",
//           borderRadius: "8px",
//           padding: "15px",
//           backgroundColor: "#fff",
//           maxHeight: "75vh",
//           overflowY: "auto",
//         }}
//       >
//         {/* Card 1: Two-column Tables */}
//         <div
//           style={{
//             border: "1px solid #ddd",
//             borderRadius: "6px",
//             padding: "20px",
//             marginBottom: "20px",
//             backgroundColor: "#fafafa",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               gap: "20px",
//               flexWrap: "wrap",
//             }}
//           >
//             {/* Left Table */}
//             <table style={{ width: "48%", borderCollapse: "collapse" }}>
//               <tbody>
//                 <tr>
//                   <th style={thStyle}>Organization Name</th>
//                   <td style={tdStyle}>{formData.organizationName}</td>
//                 </tr>
//                 <tr>
//                   <th style={thStyle}>Form Id</th>
//                   <td style={tdStyle}>{formData.formId}</td>
//                 </tr>
//                 <tr>
//                   <th style={thStyle}>Form Name</th>
//                   <td style={tdStyle}>{formData.formName}</td>
//                 </tr>
//                 <tr>
//                   <th style={thStyle}>Is Main Form</th>
//                   <td style={tdStyle}>{formData.isMainForm ? "Yes" : "No"}</td>
//                 </tr>
//                 <tr>
//                   <th style={thStyle}>Description</th>
//                   <td style={tdStyle}>{formData.description}</td>
//                 </tr>
//               </tbody>
//             </table>

//             {/* Right Table */}
//             <table style={{ width: "48%", borderCollapse: "collapse" }}>
//               <tbody>
//                 <tr>
//                   <th style={thStyle}>Main Form Name</th>
//                   <td style={tdStyle}>{formData.mainFormName || "-"}</td>
//                 </tr>
//                 <tr>
//                   <th style={thStyle}>Status</th>
//                   <td style={tdStyle}>
//                     {formData.active ? "Active" : "Inactive"}
//                   </td>
//                 </tr>
//                 <tr>
//                   <th style={thStyle}>Created At</th>
//                   <td style={tdStyle}>{formData.createdAt || "-"}</td>
//                 </tr>
//                 <tr>
//                   <th style={thStyle}>Updated At</th>
//                   <td style={tdStyle}>{formData.updatedAt || "-"}</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Card 2: Form Fields Table */}
//         {formData.form && formData.form.length > 0 && (
//           <div
//             style={{
//               border: "1px solid #ddd",
//               borderRadius: "6px",
//               padding: "20px",
//               backgroundColor: "#fafafa",
//             }}
//           >
//             <span
//               style={{
//                 color: "#6e6b6bff",
//                 fontSize: "20px",
//                 fontWeight: 700,
//               }}
//             >
//               Form Fields
//             </span>
//             <div style={{ overflowX: "auto", marginTop: "10px" }}>
//               <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                 <thead>
//                   <tr>
//                     <th style={thStyle}>Field Name</th>
//                     <th style={thStyle}>Field Type</th>
//                     <th style={thStyle}>Placeholder</th>
//                     <th style={thStyle}>Label</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {formData.form
//                     .filter((f) => f.is_show_to_view)
//                     .map((field, index) => (
//                       <tr key={index}>
//                         <td style={tdStyle}>{field.field_name}</td>
//                         <td style={tdStyle}>{field.field_type}</td>
//                         <td style={tdStyle}>{field.placeholder}</td>
//                         <td style={tdStyle}>{field.label}</td>
//                       </tr>
//                     ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // Styles
// const thStyle = {
//   textAlign: "left",
//   padding: "10px",
//   backgroundColor: "#f8f8f8",
//   border: "1px solid #ddd",
// };

// const tdStyle = {
//   padding: "10px",
//   border: "1px solid #ddd",
// };

// export default ViewForm;

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ViewForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData;

  if (!formData) {
    return (
      <div style={{ padding: "20px" }}>
        <h3>No form data found.</h3>
        <button onClick={() => navigate(-1)}>Back</button>
      </div>
    );
  }

  // Enhanced PDF Export Function with Industry Standards
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let yOffset = 30;

    // Header Section with Company Branding
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(41, 128, 185); // Professional blue
    doc.text("FORM DOCUMENTATION REPORT", pageWidth / 2, yOffset, {
      align: "center",
    });

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

    // Add a line separator
    yOffset += 10;
    doc.setDrawColor(41, 128, 185);
    doc.setLineWidth(0.8);
    doc.line(20, yOffset, pageWidth - 20, yOffset);
    yOffset += 15;

    // Form Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(`${formData.formName || "Untitled Form"} - Details`, 20, yOffset);
    yOffset += 15;

    // Section 1: Basic Information
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(52, 73, 94);
    doc.text("BASIC INFORMATION", 20, yOffset);
    yOffset += 5;

    const basicInfoData = [
      ["Organization Name", formData.organizationName || "N/A"],
      ["Form ID", formData.formId || "N/A"],
      ["Form Name", formData.formName || "N/A"],
      ["Main Form", formData.isMainForm ? "Yes" : "No"],
      ["Description", formData.description || "No description available"],
    ];

    autoTable(doc, {
      startY: yOffset,
      head: [["Property", "Value"]],
      body: basicInfoData,
      theme: "striped",
      headStyles: {
        fillColor: [52, 73, 94],
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
        0: { cellWidth: 60, fontStyle: "bold", fillColor: [248, 249, 250] },
        1: { cellWidth: 120 },
      },
      margin: { left: 20, right: 20 },
      tableLineColor: [189, 195, 199],
      tableLineWidth: 0.1,
    });

    yOffset = doc.lastAutoTable.finalY + 15;

    // Section 2: Status & Metadata
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(52, 73, 94);
    doc.text("STATUS & METADATA", 20, yOffset);
    yOffset += 5;

    const statusColor = formData.active ? [39, 174, 96] : [231, 76, 60];
    const statusText = formData.active ? "Active" : "Inactive";

    const metadataData = [
      ["Main Form Name", formData.mainFormName || "Not applicable"],
      ["Current Status", statusText],
      [
        "Created Date",
        formData.createdAt
          ? new Date(formData.createdAt).toLocaleDateString("en-IN")
          : "Not available",
      ],
      [
        "Last Updated",
        formData.updatedAt
          ? new Date(formData.updatedAt).toLocaleDateString("en-IN")
          : "Not available",
      ],
    ];

    autoTable(doc, {
      startY: yOffset,
      head: [["Metadata", "Information"]],
      body: metadataData,
      theme: "striped",
      headStyles: {
        fillColor: [52, 73, 94],
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
        0: { cellWidth: 60, fontStyle: "bold", fillColor: [248, 249, 250] },
        1: { cellWidth: 120 },
      },
      margin: { left: 20, right: 20 },
      tableLineColor: [189, 195, 199],
      tableLineWidth: 0.1,
    });

    // Check if we need a new page
    yOffset = doc.lastAutoTable.finalY + 20;
    if (yOffset > pageHeight - 60) {
      doc.addPage();
      yOffset = 30;
    }

    // Section 3: Form Fields (if available)
    const visibleFields = formData.form?.filter((f) => f.is_show_to_view) || [];

    if (visibleFields.length > 0) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(52, 73, 94);
      doc.text("FORM STRUCTURE & FIELDS", 20, yOffset);
      yOffset += 5;

      // Field summary
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Total Fields: ${visibleFields.length} | Visible Fields Only`,
        20,
        yOffset
      );
      yOffset += 5;

      const fieldData = visibleFields.map((field, index) => [
        (index + 1).toString(),
        field.field_name || "Unnamed",
        field.field_type || "Unknown",
        field.label || field.field_name || "No Label",
        field.placeholder || "No placeholder",
      ]);

      autoTable(doc, {
        startY: yOffset,
        head: [["#", "Field Name", "Type", "Label", "Placeholder"]],
        body: fieldData,
        theme: "grid",
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontSize: 10,
          fontStyle: "bold",
          halign: "center",
        },
        bodyStyles: {
          fontSize: 9,
          textColor: [33, 37, 41],
          valign: "middle",
        },
        columnStyles: {
          0: { cellWidth: 15, halign: "center", fontStyle: "bold" },
          1: { cellWidth: 35, fontStyle: "bold" },
          2: { cellWidth: 30, halign: "center" },
          3: { cellWidth: 40 },
          4: { cellWidth: 60, textColor: [108, 117, 125] },
        },
        margin: { left: 20, right: 20 },
        tableLineColor: [189, 195, 199],
        tableLineWidth: 0.1,
        alternateRowStyles: { fillColor: [248, 249, 250] },
      });
    } else {
      doc.setFontSize(12);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(108, 117, 125);
      doc.text(
        "No visible form fields found in this configuration.",
        20,
        yOffset
      );
      yOffset += 10;
    }

    // Footer with page numbering and company info
    const addFooter = () => {
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);

        // Footer line
        doc.setDrawColor(189, 195, 199);
        doc.setLineWidth(0.3);
        doc.line(20, pageHeight - 25, pageWidth - 20, pageHeight - 25);

        // Footer text
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(108, 117, 125);
        doc.text(`Generated by Form Management System`, 20, pageHeight - 15);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, pageHeight - 15, {
          align: "right",
        });

        // Confidential watermark
        doc.setTextColor(220, 220, 220);
        doc.text("CONFIDENTIAL DOCUMENT", pageWidth / 2, pageHeight - 10, {
          align: "center",
        });
      }
    };

    addFooter();

    // Save with professional filename
    const fileName = `${
      formData.formName?.replace(/[^a-zA-Z0-9]/g, "_") || "Form"
    }_Report_${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(fileName);
  };

  return (
    <div style={{ padding: "30px" }}>
      {/* Header Section */}
      <div
        style={{
          marginBottom: "17px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <span
            style={{ color: "#6e6b6bff", fontSize: "18px", fontWeight: 700 }}
          >
            View State
          </span>{" "}
          |{" "}
          <span
            style={{ color: "#6e6b6bff", fontSize: "18px", fontWeight: 700 }}
          >
            Home >> {formData.formName} Form
          </span>
          <button
            onClick={handleExportPDF}
            style={{
              padding: "8px 16px",
              backgroundColor: "#2980b9",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              marginLeft: "20px",
              fontSize: "14px",
              fontWeight: "500",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#3498db")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#2980b9")}
          >
            📄 Export PDF Report
          </button>
        </div>

        <div>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: "8px 16px",
              backgroundColor: "#555",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Back
          </button>
        </div>
      </div>

      {/* Parent Card with Scroll */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "15px",
          backgroundColor: "#fff",
          maxHeight: "75vh",
          overflowY: "auto",
        }}
      >
        {/* Card 1: Two-column Tables */}
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "6px",
            padding: "20px",
            marginBottom: "20px",
            backgroundColor: "#fafafa",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            {/* Left Table */}
            <table style={{ width: "48%", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <th style={thStyle}>Organization Name</th>
                  <td style={tdStyle}>{formData.organizationName}</td>
                </tr>
                <tr>
                  <th style={thStyle}>Form Id</th>
                  <td style={tdStyle}>{formData.formId}</td>
                </tr>
                <tr>
                  <th style={thStyle}>Form Name</th>
                  <td style={tdStyle}>{formData.formName}</td>
                </tr>
                <tr>
                  <th style={thStyle}>Is Main Form</th>
                  <td style={tdStyle}>{formData.isMainForm ? "Yes" : "No"}</td>
                </tr>
                <tr>
                  <th style={thStyle}>Description</th>
                  <td style={tdStyle}>{formData.description}</td>
                </tr>
              </tbody>
            </table>

            {/* Right Table */}
            <table style={{ width: "48%", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <th style={thStyle}>Main Form Name</th>
                  <td style={tdStyle}>{formData.mainFormName || "-"}</td>
                </tr>
                <tr>
                  <th style={thStyle}>Status</th>
                  <td style={tdStyle}>
                    {formData.active ? "Active" : "Inactive"}
                  </td>
                </tr>
                <tr>
                  <th style={thStyle}>Created At</th>
                  <td style={tdStyle}>{formData.createdAt || "-"}</td>
                </tr>
                <tr>
                  <th style={thStyle}>Updated At</th>
                  <td style={tdStyle}>{formData.updatedAt || "-"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Card 2: Form Fields Table */}
        {formData.form && formData.form.length > 0 && (
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "6px",
              padding: "20px",
              backgroundColor: "#fafafa",
            }}
          >
            <span
              style={{
                color: "#6e6b6bff",
                fontSize: "20px",
                fontWeight: 700,
              }}
            >
              Form Fields
            </span>
            <div style={{ overflowX: "auto", marginTop: "10px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Field Name</th>
                    <th style={thStyle}>Field Type</th>
                    <th style={thStyle}>Placeholder</th>
                    <th style={thStyle}>Label</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.form
                    .filter((f) => f.is_show_to_view)
                    .map((field, index) => (
                      <tr key={index}>
                        <td style={tdStyle}>{field.field_name}</td>
                        <td style={tdStyle}>{field.field_type}</td>
                        <td style={tdStyle}>{field.placeholder}</td>
                        <td style={tdStyle}>{field.label}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Styles
const thStyle = {
  textAlign: "left",
  padding: "10px",
  backgroundColor: "#f8f8f8",
  border: "1px solid #ddd",
};

const tdStyle = {
  padding: "10px",
  border: "1px solid #ddd",
};

export default ViewForm;
