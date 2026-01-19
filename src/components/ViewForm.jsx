import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import CustomButton from "./custom_component/CustomButton";
import CustomCard from "./custom_component/CustomCard"; // ✨ NEW IMPORT
import CustomBadge from "./custom_component/CustomBadge";


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

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let yOffset = 30;

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(41, 128, 185);
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

    yOffset += 10;
    doc.setDrawColor(41, 128, 185);
    doc.setLineWidth(0.8);
    doc.line(20, yOffset, pageWidth - 20, yOffset);
    yOffset += 15;

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(`${formData.formName || "Untitled Form"} - Details`, 20, yOffset);
    yOffset += 15;

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

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(52, 73, 94);
    doc.text("STATUS & METADATA", 20, yOffset);
    yOffset += 5;
    const metadataData = [
      ["Main Form Name", formData.mainFormName || "Not applicable"],
      ["Current Status", formData.active ? "Active" : "Inactive"],
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
    yOffset = doc.lastAutoTable.finalY + 20;
    if (yOffset > pageHeight - 60) {
      doc.addPage();
      yOffset = 30;
    }
    const visibleFields = formData.form?.filter((f) => f.is_show_to_view) || [];
    if (visibleFields.length > 0) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(52, 73, 94);
      doc.text("FORM STRUCTURE & FIELDS", 20, yOffset);
      yOffset += 5;

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
        doc.text(`Generated by Form Management System`, 20, pageHeight - 15);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, pageHeight - 15, {
          align: "right",
        });
      }
    };
    addFooter();
    const fileName = `${
      formData.formName?.replace(/[^a-zA-Z0-9]/g, "_") || "Form"
    }_Report_${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(fileName);
  };
  return (
    <div style={{ padding: "30px", backgroundColor: "#f5f6fa" }}>
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
          <CustomButton
            variant="info"
            onClick={handleExportPDF}
            style={{ marginLeft: "20px" }}
          >
            📄 Export PDF Report
          </CustomButton>
        </div>

        <div>
          <CustomButton variant="secondary" onClick={() => navigate(-1)}>
            Back
          </CustomButton>
        </div>
      </div>
      {/* ✨ UPDATED: Parent Card with CustomCard */}
      <CustomCard
        variant="elevated"
        padding="md"
        style={{
          maxHeight: "75vh",
          overflowY: "auto",
        }}
      >
        {/* ✨ UPDATED: Card 1 with CustomCard */}
        <CustomCard
          variant="bordered"
          padding="lg"
          style={{ marginBottom: "20px" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
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
                  <td style={tdStyle}>
                     <CustomBadge variant={formData.isMainForm ? "info" : "secondary"} size="sm">
                       {formData.isMainForm ? "Yes" : "No"}
                     </CustomBadge>
                  </td>
                </tr>
                <tr>
                  <th style={thStyle}>Description</th>
                  <td style={tdStyle}>{formData.description}</td>
                </tr>
              </tbody>
            </table>
            <table style={{ width: "48%", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <th style={thStyle}>Main Form Name</th>
                  <td style={tdStyle}>{formData.mainFormName || "-"}</td>
                </tr>
                <tr>
                  <th style={thStyle}>Status</th>
                  <td style={tdStyle}>
                    {/* use CustomBadge */}
                    <CustomBadge variant={formData.active ? "success" : "danger"} size="sm">
                      {formData.active ? "Active" : "Inactive"}
                    </CustomBadge>
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
        </CustomCard>
        {/* ✨ UPDATED: Card 2 with CustomCard */}
        {formData.form && formData.form.length > 0 && (
          <CustomCard title="Form Fields" variant="bordered" padding="lg">
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
          </CustomCard>
        )}
      </CustomCard>
    </div>
  );
};

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
