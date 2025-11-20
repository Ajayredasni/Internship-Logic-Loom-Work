// exportUtils.js
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportFormsToExcel = (formList) => {
  if (!formList || formList.length === 0) {
    alert("No data available to export");
    return;
  }

  // 1. Data ko prepare karo (sirf visible columns)
  const worksheetData = formList.map((form, idx) => ({
    "Sr.No": idx + 1,
    "Organization Name": form.organizationName,
    "Form Name": form.formName,
    "Is Main Form": form.isMainForm ? "Yes" : "No",
    "Main Form Name": form.mainFormName || "-",
    Description: form.description,
    Status: form.active ? "Active" : "Inactive",
  }));

  // 2. Sheet banao
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);

  // 3. Workbook banao
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Forms");

  // 4. File ko download karao
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const dataBlob = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });
  saveAs(dataBlob, "Form_List.xlsx");
};
