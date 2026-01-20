import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  FileText,
  Trash2,
  PlusCircle,
  XCircle,
  Grid,
} from "react-feather";
import { formMenuAction } from "./store/FormMenuStoreSlice";
import CustomAlert from "./custom_component/CustomAlert";
import Stepper from "./custom_component/Stepper";
import CustomButton from "./custom_component/CustomButton";
import CustomCard from "./custom_component/CustomCard";
import CustomSelect from "./custom_component/CustomSelect";
import CustomFileUpload from "./custom_component/CustomFileUpload";
import CustomFilePreview from "./custom_component/CustomFilePreview";
import CustomBadge from "./custom_component/CustomBadge";
import CustomTooltip from "./custom_component/CustomTooltip";

function AddMenuListData() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { formDataStore } = useSelector((store) => store.formDataStore);
  const { formMenuStore } = useSelector((store) => store.formMenuStore);

  const [formData, setFormData] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [multiModuleData, setMultiModuleData] = useState({});
  const [multiModuleErrors, setMultiModuleErrors] = useState({});
  const [showPassword, setShowPassword] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [alert, setAlert] = useState({
    show: false,
    type: "success",
    title: "",
    message: "",
  });

  const steps = [
    {
      label: "Main Form",
      icon: <FileText size={20} />,
      description: "Fill main form data",
    },
    {
      label: "Multi-Modules",
      icon: <Grid size={20} />,
      description: "Add sub-form data",
    },
    {
      label: "Review & Submit",
      icon: <Eye size={20} />,
      description: "Verify and submit",
    },
  ];

  const selectedForm = formDataStore.find((f) => f.formId === formId);
  const linkedSubForms = formDataStore.filter(
    (f) => f.mainFormName === selectedForm?.formId,
  );
  const queryParams = new URLSearchParams(location.search);
  const editIndex = queryParams.get("editIndex");

  useEffect(() => {
    if (!selectedForm) return;
    let initialData = {};
    selectedForm.form?.forEach((field) => {
      if (field.field_type === "checkbox") initialData[field.field_name] = [];
      else initialData[field.field_name] = "";
    });

    if (editIndex !== null && formMenuStore[formId]?.[editIndex]) {
      const existingEntry = formMenuStore[formId][editIndex];
      initialData = { ...initialData, ...existingEntry };
      if (existingEntry.subForms) {
        const loadedMultiModuleData = {};
        Object.keys(existingEntry.subForms).forEach((subFormId) => {
          const subFormDataValue = existingEntry.subForms[subFormId];
          if (Array.isArray(subFormDataValue)) {
            loadedMultiModuleData[subFormId] = subFormDataValue;
          } else if (
            typeof subFormDataValue === "object" &&
            subFormDataValue !== null
          ) {
            loadedMultiModuleData[subFormId] = [subFormDataValue];
          }
        });
        setMultiModuleData(loadedMultiModuleData);
      }
    }
    setFormData(initialData);
    setFieldErrors({});
  }, [selectedForm, formMenuStore, editIndex, formId]);

  const showAlert = (type, title, message) =>
    setAlert({ show: true, type, title, message });
  const closeAlert = () => setAlert({ ...alert, show: false });

  const liveValidateField = (
    fieldName,
    value,
    setErrors,
    formObj,
    errorKey,
  ) => {
    const field = formObj?.find((f) => f.field_name === fieldName);
    if (!field || !field.validationRules?.length) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey || fieldName];
        return newErrors;
      });
      return;
    }

    const newErrors = {};
    const requireRule = field.validationRules.find(
      (rule) => rule.type === "require" || rule.type === "required",
    );

    if (field.field_type === "file") {
      if (
        (requireRule?.value === true || requireRule?.value === "true") &&
        (!value || (typeof value === "object" && !value.name))
      ) {
        newErrors[errorKey || fieldName] =
          requireRule.errorMsg || "File is required";
      }
    } else {
      if (
        (requireRule?.value === true || requireRule?.value === "true") &&
        (!value || value.toString().trim() === "")
      ) {
        newErrors[errorKey || fieldName] =
          requireRule.errorMsg || "This field is required";
      } else if (value && value.toString().trim() !== "") {
        for (const rule of field.validationRules) {
          if (rule.type === "pattern") {
            const regex = new RegExp(rule.value);
            if (!regex.test(value)) {
              newErrors[errorKey || fieldName] =
                rule.errorMsg || "Invalid value";
              break;
            }
          }
        }
      }
    }

    setErrors((prev) => ({
      ...prev,
      [errorKey || fieldName]: newErrors[errorKey || fieldName] || undefined,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      liveValidateField(name, value, setFieldErrors, selectedForm.form);
      return updated;
    });
  };

  const handleCheckboxChange = (e, fieldName) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const arr = prev[fieldName] || [];
      const updated = {
        ...prev,
        [fieldName]: checked ? [...arr, value] : arr.filter((v) => v !== value),
      };
      liveValidateField(
        fieldName,
        updated[fieldName],
        setFieldErrors,
        selectedForm.form,
      );
      return updated;
    });
  };
  const handleFileUpload = (fieldName, fileData) => {
    setUploadedFiles((prev) => ({ ...prev, [fieldName]: fileData }));
    setFormData((prev) => {
      const updated = { ...prev, [fieldName]: fileData };
      liveValidateField(fieldName, fileData, setFieldErrors, selectedForm.form);
      return updated;
    });
  };

  const addMultiModuleRow = (subFormId) => {
    const subForm = linkedSubForms.find((f) => f.formId === subFormId);
    if (!subForm) return;
    const newRow = {};
    subForm.form?.forEach((field) => {
      if (field.field_type === "checkbox") newRow[field.field_name] = [];
      else newRow[field.field_name] = "";
    });
    setMultiModuleData((prev) => ({
      ...prev,
      [subFormId]: [...(prev[subFormId] || []), newRow],
    }));
  };

  const deleteMultiModuleRow = (subFormId, rowIndex) => {
    setMultiModuleData((prev) => ({
      ...prev,
      [subFormId]: prev[subFormId].filter((_, idx) => idx !== rowIndex),
    }));
    setMultiModuleErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach((key) => {
        if (key.startsWith(`${subFormId}_${rowIndex}_`)) delete newErrors[key];
      });
      return newErrors;
    });
  };

  const handleMultiModuleFieldChange = (
    e,
    subFormId,
    rowIndex,
    fieldName,
    subForm,
  ) => {
    const { value } = e.target;
    setMultiModuleData((prev) => {
      const rows = [...(prev[subFormId] || [])];
      rows[rowIndex] = { ...rows[rowIndex], [fieldName]: value };
      const errorKey = `${subFormId}_${rowIndex}_${fieldName}`;
      liveValidateField(
        fieldName,
        value,
        setMultiModuleErrors,
        subForm.form,
        errorKey,
      );
      return { ...prev, [subFormId]: rows };
    });
  };

  const handleMultiModuleCheckboxChange = (
    e,
    subFormId,
    rowIndex,
    fieldName,
    subForm,
  ) => {
    const { value, checked } = e.target;
    setMultiModuleData((prev) => {
      const rows = [...(prev[subFormId] || [])];
      const arr = rows[rowIndex][fieldName] || [];
      rows[rowIndex] = {
        ...rows[rowIndex],
        [fieldName]: checked ? [...arr, value] : arr.filter((v) => v !== value),
      };
      const errorKey = `${subFormId}_${rowIndex}_${fieldName}`;
      liveValidateField(
        fieldName,
        rows[rowIndex][fieldName],
        setMultiModuleErrors,
        subForm.form,
        errorKey,
      );
      return { ...prev, [subFormId]: rows };
    });
  };
  const handleMultiModuleFileUpload = (
    subFormId,
    rowIndex,
    fieldName,
    fileData,
  ) => {
    const fileKey = `${subFormId}_${rowIndex}_${fieldName}`;
    setUploadedFiles((prev) => ({ ...prev, [fileKey]: fileData }));
    setMultiModuleData((prev) => {
      const rows = [...(prev[subFormId] || [])];
      rows[rowIndex] = { ...rows[rowIndex], [fieldName]: fileData };
      const errorKey = `${subFormId}_${rowIndex}_${fieldName}`;
      liveValidateField(
        fieldName,
        fileData,
        setMultiModuleErrors,
        selectedForm.form,
        errorKey,
      );
      return { ...prev, [subFormId]: rows };
    });
  };

  const validateFields = (fields, data, setErrors, prefix = "") => {
    const errors = {};
    fields?.forEach((field) => {
      if (!field.is_show_to_form) return;
      const val = data[field.field_name] ?? "";
      const errorKey = prefix
        ? `${prefix}_${field.field_name}`
        : field.field_name;
      if (!field.validationRules?.length) return;

      const requireRule = field.validationRules.find(
        (rule) => rule.type === "require" || rule.type === "required",
      );

      if (field.field_type === "file") {
        if (requireRule && (!val || (typeof val === "object" && !val.name))) {
          errors[errorKey] = requireRule.errorMsg || "File is required";
          return;
        }
      } else {
        if (requireRule && (!val || val.toString().trim() === "")) {
          errors[errorKey] = requireRule.errorMsg || "This field is required";
          return;
        }
        if (val && val.toString().trim() !== "") {
          for (const rule of field.validationRules) {
            if (rule.type === "pattern") {
              const regex = new RegExp(rule.value);
              if (!regex.test(val)) {
                errors[errorKey] = rule.errorMsg || "Invalid value";
                break;
              }
            }
          }
        }
      }
    });
    setErrors((prev) => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
  };

  const validateCurrentStep = () => {
    if (currentStep === 0) {
      return validateFields(selectedForm.form, formData, setFieldErrors);
    } else if (currentStep === 1) {
      let allValid = true;
      linkedSubForms.forEach((subForm) => {
        const rows = multiModuleData[subForm.formId] || [];
        rows.forEach((row, idx) => {
          const prefix = `${subForm.formId}_${idx}`;
          const isRowValid = validateFields(
            subForm.form,
            row,
            setMultiModuleErrors,
            prefix,
          );
          if (!isRowValid) allValid = false;
        });
      });
      return allValid;
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      showAlert(
        "error",
        "Validation Error",
        "Please fill all required fields before proceeding",
      );
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleStepClick = (step) => {
    if (step < currentStep) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    // ✨ CRITICAL FIX: Check if we're on the last step (Review step)
    if (currentStep !== steps.length - 1) {
      showAlert(
        "error",
        "Error",
        "Please complete all steps before submitting",
      );
      return;
    }

    if (!selectedForm) return;

    const isMainValid = validateFields(
      selectedForm.form,
      formData,
      setFieldErrors,
    );
    let allMultiModuleValid = true;

    linkedSubForms.forEach((subForm) => {
      const rows = multiModuleData[subForm.formId] || [];
      rows.forEach((row, idx) => {
        const prefix = `${subForm.formId}_${idx}`;
        const isRowValid = validateFields(
          subForm.form,
          row,
          setMultiModuleErrors,
          prefix,
        );
        if (!isRowValid) allMultiModuleValid = false;
      });
    });

    if (isMainValid && allMultiModuleValid) {
      const timestamp = new Date().toISOString();
      const subFormsData = {};
      Object.keys(multiModuleData).forEach((subFormId) => {
        if (multiModuleData[subFormId].length > 0) {
          subFormsData[subFormId] = multiModuleData[subFormId];
        }
      });

      if (editIndex !== null) {
        const finalData = {
          ...formData,
          subForms: subFormsData,
          updatedAt: timestamp,
        };
        dispatch(
          formMenuAction.editFormDataInMenuStore({
            formId,
            index: Number(editIndex),
            updatedData: finalData,
          }),
        );
        showAlert("success", "Updated!", "Form has been updated successfully!");
      } else {
        const finalData = {
          ...formData,
          organizationName: selectedForm.organizationName,
          formName: selectedForm.formName,
          FormType: selectedForm.formType,
          formId: selectedForm.formId,
          status: selectedForm.active,
          subForms: subFormsData,
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        dispatch(
          formMenuAction.addFormDataToMenuStore({
            formId,
            formData: finalData,
          }),
        );
        showAlert(
          "success",
          "Submitted!",
          "Form has been submitted successfully!",
        );
      }
      setTimeout(() => navigate(`/app/formMenu-Table/${formId}`), 1500);
    } else {
      showAlert(
        "error",
        "Validation Error",
        "Please fill all required fields in Main Form & Multi-Modules.",
      );
    }
  };

  const togglePasswordVisibility = (key) =>
    setShowPassword((prev) => ({ ...prev, [key]: !prev[key] }));

  const renderMainFormFields = () => {
    return selectedForm.form
      .filter((field) => field.is_show_to_form)
      .map((field) => {
        const value = formData[field.field_name] ?? "";
        //  NEW CODE: Replace with CustomFileUpload + CustomFilePreview
        if (field.field_type === "file") {
          const fileData =
            uploadedFiles[field.field_name] || formData[field.field_name];
          return (
            <div key={field.field_name} className="mb-3 col-md-6">
              <div className="d-flex align-items-center gap-2 mb-2">
                <label className="form-label fw-semibold mb-0">
                  {field.label}
                  {field.validationRules?.some(
                    (r) => r.type === "required",
                  ) && <span style={{ color: "#dc2626" }}> *</span>}
                </label>
                <CustomTooltip
                  content="Max size: 2MB. Supported: Images, PDF, Excel"
                  placement="right"
                >
                  <Info
                    size={14}
                    style={{ color: "#94a3b8", cursor: "help" }}
                  />
                </CustomTooltip>
              </div>
              <CustomFileUpload
                name={field.field_name}
                label={field.label}
                value={fileData}
                onChange={handleFileUpload}
                error={fieldErrors[field.field_name]}
                required={field.validationRules?.some(
                  (r) => r.type === "required" || r.type === "require",
                )}
                disabled={field.is_hidden}
              />
              {fileData && (
                <CustomFilePreview
                  fileData={fileData}
                  variant="card"
                  showModal={true}
                  showDownload={true}
                />
              )}
            </div>
          );
        }

        if (field.field_type === "password") {
          return (
            <div key={field.field_name} className="mb-3 col-md-6">
              <label
                className="form-label fw-semibold text-uppercase"
                style={{ fontSize: "0.875rem", color: "#64748b" }}
              >
                {field.label}
              </label>
              <div className="input-group">
                <input
                  type={showPassword[field.field_name] ? "text" : "password"}
                  className={`form-control ${
                    fieldErrors[field.field_name] ? "is-invalid" : ""
                  }`}
                  placeholder={field.placeholder}
                  name={field.field_name}
                  value={value}
                  onChange={handleChange}
                  style={{ padding: "10px", borderRadius: "8px 0 0 8px" }}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => togglePasswordVisibility(field.field_name)}
                  style={{ borderRadius: "0 8px 8px 0" }}
                >
                  {showPassword[field.field_name] ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {fieldErrors[field.field_name] && (
                <small className="text-danger d-block mt-1">
                  {fieldErrors[field.field_name]}
                </small>
              )}
            </div>
          );
        }

        if (["text_box", "email", "number", "tel"].includes(field.field_type)) {
          return (
            <div key={field.field_name} className="mb-3 col-md-6">
              <label
                className="form-label fw-semibold text-uppercase"
                style={{ fontSize: "0.875rem", color: "#64748b" }}
              >
                {field.label}
              </label>
              <input
                type={
                  field.field_type === "text_box" ? "text" : field.field_type
                }
                className={`form-control ${
                  fieldErrors[field.field_name] ? "is-invalid" : ""
                }`}
                placeholder={field.placeholder}
                name={field.field_name}
                value={value}
                onChange={handleChange}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                }}
              />
              {fieldErrors[field.field_name] && (
                <small className="text-danger d-block mt-1">
                  {fieldErrors[field.field_name]}
                </small>
              )}
            </div>
          );
        }

        if (field.field_type === "textarea") {
          return (
            <div key={field.field_name} className="mb-3 col-md-6">
              <label
                className="form-label fw-semibold text-uppercase"
                style={{ fontSize: "0.875rem", color: "#64748b" }}
              >
                {field.label}
              </label>
              <textarea
                className={`form-control ${
                  fieldErrors[field.field_name] ? "is-invalid" : ""
                }`}
                placeholder={field.placeholder}
                name={field.field_name}
                value={value}
                onChange={handleChange}
                rows="2"
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                }}
              />
              {fieldErrors[field.field_name] && (
                <small className="text-danger d-block mt-1">
                  {fieldErrors[field.field_name]}
                </small>
              )}
            </div>
          );
        }

        if (field.field_type === "date") {
          return (
            <div key={field.field_name} className="mb-3 col-md-6">
              <label
                className="form-label fw-semibold text-uppercase"
                style={{ fontSize: "0.875rem", color: "#64748b" }}
              >
                {field.label}
              </label>
              <input
                type="date"
                className={`form-control ${
                  fieldErrors[field.field_name] ? "is-invalid" : ""
                }`}
                name={field.field_name}
                value={value}
                onChange={handleChange}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                }}
              />
              {fieldErrors[field.field_name] && (
                <small className="text-danger d-block mt-1">
                  {fieldErrors[field.field_name]}
                </small>
              )}
            </div>
          );
        }

        if (field.field_type === "radio") {
          return (
            <div key={field.field_name} className="mb-3 col-md-6">
              <label
                className="form-label fw-semibold text-uppercase"
                style={{ fontSize: "0.875rem", color: "#64748b" }}
              >
                {field.label}
              </label>
              <div className="d-flex gap-3 flex-wrap">
                {field.options?.map((opt, i) => (
                  <div key={i} className="form-check">
                    <input
                      type="radio"
                      name={field.field_name}
                      value={opt.value}
                      checked={value === opt.value}
                      onChange={handleChange}
                      className="form-check-input"
                    />
                    <label className="form-check-label">{opt.label}</label>
                  </div>
                ))}
              </div>
              {fieldErrors[field.field_name] && (
                <small className="text-danger d-block mt-1">
                  {fieldErrors[field.field_name]}
                </small>
              )}
            </div>
          );
        }

        if (field.field_type === "checkbox") {
          return (
            <div key={field.field_name} className="mb-3 col-md-6">
              <label
                className="form-label fw-semibold text-uppercase"
                style={{ fontSize: "0.875rem", color: "#64748b" }}
              >
                {field.label}
              </label>
              <div className="d-flex gap-3 flex-wrap">
                {field.options?.map((opt, i) => (
                  <div key={i} className="form-check">
                    <input
                      type="checkbox"
                      value={opt.value}
                      checked={
                        Array.isArray(value) && value.includes(opt.value)
                      }
                      onChange={(e) =>
                        handleCheckboxChange(e, field.field_name)
                      }
                      className="form-check-input"
                    />
                    <label className="form-check-label">{opt.label}</label>
                  </div>
                ))}
              </div>
              {fieldErrors[field.field_name] && (
                <small className="text-danger d-block mt-1">
                  {fieldErrors[field.field_name]}
                </small>
              )}
            </div>
          );
        }
        if (field.field_type === "select") {
          return (
            <div key={field.field_name} className="mb-3 col-md-6">
              <CustomSelect
                label={field.label}
                name={field.field_name}
                options={field.options || []}
                value={value}
                onChange={handleChange}
                placeholder={field.placeholder}
                error={fieldErrors[field.field_name]}
                required={field.validationRules?.some(
                  (r) => r.type === "required" || r.type === "require",
                )}
                searchable
                clearable
              />
            </div>
          );
        }

        return null;
      });
  };
  const renderMultiModuleTable = (subForm) => {
    const rows = multiModuleData[subForm.formId] || [];
    const visibleFields = subForm.form?.filter((f) => f.is_show_to_form) || [];
    const hasFileFields = visibleFields.some((f) => f.field_type === "file");

    return (
      <div key={subForm.formId} className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0" style={{ color: "#1e3a8a" }}>
            {subForm.formName}
          </h5>
          <button
            type="button"
            className="btn btn-sm d-flex align-items-center gap-2 rounded-3"
            onClick={() => addMultiModuleRow(subForm.formId)}
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "white",
              border: "none",
              fontWeight: "500",
              padding: "6px 16px",
            }}
          >
            <PlusCircle size={16} />
            Add Row
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            className="table table-bordered"
            style={{ minWidth: "1000px" }}
          >
            <thead style={{ backgroundColor: "#f8f9fa" }}>
              <tr>
                <th
                  style={{
                    fontSize: "0.75rem",
                    color: "#64748b",
                    padding: "12px",
                    width: "60px",
                  }}
                >
                  SR.NO
                </th>
                {visibleFields.map((field) => (
                  <th
                    key={field.field_name}
                    style={{
                      fontSize: "0.75rem",
                      color: "#64748b",
                      padding: "12px",
                    }}
                  >
                    {field.label}
                  </th>
                ))}
                {hasFileFields && (
                  <th
                    style={{
                      fontSize: "0.75rem",
                      color: "#64748b",
                      padding: "12px",
                      width: "150px",
                      textAlign: "center",
                    }}
                  >
                    FILE PREVIEW
                  </th>
                )}
                <th
                  style={{
                    fontSize: "0.75rem",
                    color: "#64748b",
                    padding: "12px",
                    width: "100px",
                    textAlign: "center",
                  }}
                >
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleFields.length + (hasFileFields ? 3 : 2)}
                    className="text-center py-4"
                    style={{ color: "#94a3b8" }}
                  >
                    No rows added. Click "Add Row" to start.
                  </td>
                </tr>
              ) : (
                rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td
                      style={{
                        padding: "8px",
                        textAlign: "center",
                        fontWeight: "500",
                      }}
                    >
                      {rowIndex + 1}
                    </td>
                    {visibleFields.map((field) => {
                      const errorKey = `${subForm.formId}_${rowIndex}_${field.field_name}`;
                      const value = row[field.field_name] ?? "";
                      const fileKey = `${subForm.formId}_${rowIndex}_${field.field_name}`;
                      const fileData =
                        uploadedFiles[fileKey] || row[field.field_name];
                      //  NEW CODE: Replace with CustomFileUpload (no preview variant)
                      if (field.field_type === "file") {
                        return (
                          <td
                            key={field.field_name}
                            style={{ padding: "8px", minWidth: "250px" }}
                          >
                            <CustomFileUpload
                              name={field.field_name}
                              label=""
                              value={fileData}
                              onChange={(fieldName, data) =>
                                handleMultiModuleFileUpload(
                                  subForm.formId,
                                  rowIndex,
                                  fieldName,
                                  data,
                                )
                              }
                              error={multiModuleErrors[errorKey]}
                              required={field.validationRules?.some(
                                (r) => r.type === "required",
                              )}
                              showPreview={false}
                            />
                          </td>
                        );
                      }

                      if (field.field_type === "password") {
                        const pwKey = `${subForm.formId}_${rowIndex}_${field.field_name}`;
                        return (
                          <td
                            key={field.field_name}
                            style={{ padding: "8px", minWidth: "200px" }}
                          >
                            <div className="input-group input-group-sm">
                              <input
                                type={showPassword[pwKey] ? "text" : "password"}
                                className="form-control"
                                placeholder={field.placeholder}
                                value={value}
                                onChange={(e) =>
                                  handleMultiModuleFieldChange(
                                    e,
                                    subForm.formId,
                                    rowIndex,
                                    field.field_name,
                                    subForm,
                                  )
                                }
                                style={{ fontSize: "0.875rem" }}
                              />
                              <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => togglePasswordVisibility(pwKey)}
                              >
                                {showPassword[pwKey] ? (
                                  <EyeOff size={16} />
                                ) : (
                                  <Eye size={16} />
                                )}
                              </button>
                            </div>
                            {multiModuleErrors[errorKey] && (
                              <small className="text-danger d-block mt-1">
                                {multiModuleErrors[errorKey]}
                              </small>
                            )}
                          </td>
                        );
                      }

                      if (
                        ["text_box", "email", "number", "tel"].includes(
                          field.field_type,
                        )
                      ) {
                        return (
                          <td
                            key={field.field_name}
                            style={{ padding: "8px", minWidth: "180px" }}
                          >
                            <input
                              type={
                                field.field_type === "text_box"
                                  ? "text"
                                  : field.field_type
                              }
                              className="form-control form-control-sm"
                              placeholder={field.placeholder}
                              value={value}
                              onChange={(e) =>
                                handleMultiModuleFieldChange(
                                  e,
                                  subForm.formId,
                                  rowIndex,
                                  field.field_name,
                                  subForm,
                                )
                              }
                              style={{ fontSize: "0.875rem" }}
                            />
                            {multiModuleErrors[errorKey] && (
                              <small className="text-danger d-block mt-1">
                                {multiModuleErrors[errorKey]}
                              </small>
                            )}
                          </td>
                        );
                      }

                      if (field.field_type === "textarea") {
                        return (
                          <td
                            key={field.field_name}
                            style={{ padding: "8px", minWidth: "250px" }}
                          >
                            <textarea
                              className="form-control form-control-sm"
                              placeholder={field.placeholder}
                              value={value}
                              onChange={(e) =>
                                handleMultiModuleFieldChange(
                                  e,
                                  subForm.formId,
                                  rowIndex,
                                  field.field_name,
                                  subForm,
                                )
                              }
                              rows="2"
                              style={{ fontSize: "0.875rem" }}
                            />
                            {multiModuleErrors[errorKey] && (
                              <small className="text-danger d-block mt-1">
                                {multiModuleErrors[errorKey]}
                              </small>
                            )}
                          </td>
                        );
                      }

                      if (field.field_type === "date") {
                        return (
                          <td
                            key={field.field_name}
                            style={{ padding: "8px", minWidth: "180px" }}
                          >
                            <input
                              type="date"
                              className="form-control form-control-sm"
                              value={value}
                              onChange={(e) =>
                                handleMultiModuleFieldChange(
                                  e,
                                  subForm.formId,
                                  rowIndex,
                                  field.field_name,
                                  subForm,
                                )
                              }
                              style={{ fontSize: "0.875rem" }}
                            />
                            {multiModuleErrors[errorKey] && (
                              <small className="text-danger d-block mt-1">
                                {multiModuleErrors[errorKey]}
                              </small>
                            )}
                          </td>
                        );
                      }

                      if (field.field_type === "radio") {
                        return (
                          <td
                            key={field.field_name}
                            style={{ padding: "8px", minWidth: "200px" }}
                          >
                            <div className="d-flex gap-2 flex-wrap">
                              {field.options?.map((opt, i) => (
                                <div
                                  key={i}
                                  className="form-check form-check-inline"
                                >
                                  <input
                                    type="radio"
                                    name={`${subForm.formId}_${rowIndex}_${field.field_name}`}
                                    value={opt.value}
                                    checked={value === opt.value}
                                    onChange={(e) =>
                                      handleMultiModuleFieldChange(
                                        e,
                                        subForm.formId,
                                        rowIndex,
                                        field.field_name,
                                        subForm,
                                      )
                                    }
                                    className="form-check-input"
                                  />
                                  <label
                                    className="form-check-label"
                                    style={{ fontSize: "0.875rem" }}
                                  >
                                    {opt.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                            {multiModuleErrors[errorKey] && (
                              <small className="text-danger d-block mt-1">
                                {multiModuleErrors[errorKey]}
                              </small>
                            )}
                          </td>
                        );
                      }

                      if (field.field_type === "checkbox") {
                        return (
                          <td
                            key={field.field_name}
                            style={{ padding: "8px", minWidth: "200px" }}
                          >
                            <div className="d-flex gap-2 flex-wrap">
                              {field.options?.map((opt, i) => (
                                <div
                                  key={i}
                                  className="form-check form-check-inline"
                                >
                                  <input
                                    type="checkbox"
                                    value={opt.value}
                                    checked={
                                      Array.isArray(value) &&
                                      value.includes(opt.value)
                                    }
                                    onChange={(e) =>
                                      handleMultiModuleCheckboxChange(
                                        e,
                                        subForm.formId,
                                        rowIndex,
                                        field.field_name,
                                        subForm,
                                      )
                                    }
                                    className="form-check-input"
                                  />
                                  <label
                                    className="form-check-label"
                                    style={{ fontSize: "0.875rem" }}
                                  >
                                    {opt.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                            {multiModuleErrors[errorKey] && (
                              <small className="text-danger d-block mt-1">
                                {multiModuleErrors[errorKey]}
                              </small>
                            )}
                          </td>
                        );
                      }
                      if (field.field_type === "select") {
                        return (
                          <td
                            key={field.field_name}
                            style={{ padding: "8px", minWidth: "200px" }}
                          >
                            <CustomSelect
                              name={field.field_name}
                              options={field.options || []}
                              value={value}
                              onChange={(e) =>
                                handleMultiModuleFieldChange(
                                  e,
                                  subForm.formId,
                                  rowIndex,
                                  field.field_name,
                                  subForm,
                                )
                              }
                              placeholder={field.placeholder}
                              error={multiModuleErrors[errorKey]}
                              searchable={false}
                              clearable={false}
                              style={{ marginBottom: "0" }}
                            />
                          </td>
                        );
                      }

                      return (
                        <td key={field.field_name} style={{ padding: "8px" }}>
                          -
                        </td>
                      );
                    })}
                    {/*  ✅ NEW CODE: Replace with CustomFilePreview (thumbnail variant) */}
                    {hasFileFields && (
                      <td
                        style={{
                          padding: "8px",
                          textAlign: "center",
                          verticalAlign: "middle",
                        }}
                      >
                        {(() => {
                          const fileFields = visibleFields.filter(
                            (f) => f.field_type === "file",
                          );
                          const filesInRow = fileFields
                            .map((f) => {
                              const fileKey = `${subForm.formId}_${rowIndex}_${f.field_name}`;
                              return (
                                uploadedFiles[fileKey] || row[f.field_name]
                              );
                            })
                            .filter(Boolean);

                          if (filesInRow.length === 0)
                            return <span className="text-secondary">-</span>;

                          return (
                            <div className="d-flex gap-2 flex-wrap justify-content-center">
                              {filesInRow.map((fileData, idx) => (
                                <CustomFilePreview
                                  key={idx}
                                  fileData={fileData}
                                  variant="thumbnail"
                                  showModal={true}
                                  showDownload={false}
                                />
                              ))}
                            </div>
                          );
                        })()}
                      </td>
                    )}
                    <td style={{ padding: "8px", textAlign: "center" }}>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger d-flex align-items-center justify-content-center mx-auto"
                        onClick={() =>
                          deleteMultiModuleRow(subForm.formId, rowIndex)
                        }
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "6px",
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <div className="row">{renderMainFormFields()}</div>;

      case 1:
        return (
          <div className="mt-4">
            {linkedSubForms.length > 0 ? (
              linkedSubForms.map((subForm) => renderMultiModuleTable(subForm))
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#64748b",
                }}
              >
                <Grid size={48} style={{ marginBottom: "12px" }} />
                <p>No sub-forms configured for this form.</p>
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div className="review-section">
            {/* ✨ NEW: Form Information Card */}
            <div
              style={{
                backgroundColor: "#f8f9fa",
                padding: "20px",
                borderRadius: "12px",
                marginBottom: "20px",
              }}
            >
              <h5 style={{ marginBottom: "16px", color: "#1e293b" }}>
                Form Information
              </h5>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <strong style={{ color: "#64748b", fontSize: "12px" }}>
                    Organization:
                  </strong>
                  <div style={{ color: "#1e293b", marginTop: "4px" }}>
                    {selectedForm.organizationName || "-"}
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <strong style={{ color: "#64748b", fontSize: "12px" }}>
                    Form Name:
                  </strong>
                  <div style={{ color: "#1e293b", marginTop: "4px" }}>
                    {selectedForm.formName || "-"}
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <strong style={{ color: "#64748b", fontSize: "12px" }}>
                    Form Type:
                  </strong>
                  <div style={{ color: "#1e293b", marginTop: "4px" }}>
                    <CustomBadge variant="primary" size="sm">
                      {selectedForm.formType || "-"}
                    </CustomBadge>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <strong style={{ color: "#64748b", fontSize: "12px" }}>
                    Status:
                  </strong>
                  <div style={{ color: "#1e293b", marginTop: "4px" }}>
                    <CustomBadge
                      variant={selectedForm.active ? "success" : "danger"}
                      size="sm"
                    >
                      {selectedForm.active ? "Active" : "Inactive"}
                    </CustomBadge>
                  </div>
                </div>
              </div>
            </div>

            {/* Existing Main Form Data */}
            <div
              style={{
                backgroundColor: "#f8f9fa",
                padding: "20px",
                borderRadius: "12px",
                marginBottom: "20px",
              }}
            >
              <h5 style={{ marginBottom: "16px", color: "#1e293b" }}>
                Main Form Data
              </h5>
              <div className="row">
                {selectedForm.form
                  .filter((f) => f.is_show_to_form)
                  .map((field) => (
                    <div key={field.field_name} className="col-md-6 mb-3">
                      <div>
                        <strong style={{ color: "#64748b", fontSize: "12px" }}>
                          {field.label}:
                        </strong>
                        <div style={{ color: "#1e293b", marginTop: "4px" }}>
                          {formData[field.field_name] || "-"}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Multi-Modules Data */}
            {linkedSubForms.length > 0 && (
              <div>
                <h5 style={{ marginBottom: "16px", color: "#1e293b" }}>
                  Multi-Modules Data
                </h5>
                {linkedSubForms.map((subForm) => {
                  const rows = multiModuleData[subForm.formId] || [];
                  return (
                    <div
                      key={subForm.formId}
                      style={{
                        backgroundColor: "#f8f9fa",
                        padding: "20px",
                        borderRadius: "12px",
                        marginBottom: "16px",
                      }}
                    >
                      {/* ✨ UPDATED: Badge in subform header */}
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <h6 style={{ marginBottom: 0, color: "#4b5563" }}>
                          {subForm.formName}
                        </h6>
                        <CustomBadge variant="info" size="sm" pill>
                          {rows.length} {rows.length === 1 ? "row" : "rows"}
                        </CustomBadge>
                      </div>

                      {rows.length === 0 ? (
                        <p style={{ color: "#94a3b8", margin: 0 }}>
                          No data added
                        </p>
                      ) : (
                        <div style={{ fontSize: "14px", color: "#64748b" }}>
                          ✓ {rows.length} row(s) added successfully
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (!selectedForm)
    return <div className="text-center mt-5">Form not found</div>;

  return (
    <div className="flex-grow-1 p-3" style={{ backgroundColor: "#f5f6fa" }}>
      <div className="flex-grow-1 p-2" style={{ backgroundColor: "#f5f6fa" }}>
        <CustomCard
          variant="elevated"
          padding="none"
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            maxHeight: "calc(98vh - 100px)",
            overflowY: "auto",
          }}
          header={
            // ✨ Header as prop
            <div
              className="p-3"
              style={{
                backgroundColor: "#f8f9fa",
                borderBottom: "1px solid #e9ecef",
              }}
            >
              <div className="d-flex align-items-center gap-3 mb-2">
                <div
                  className="d-flex align-items-center justify-content-center rounded-3"
                  style={{
                    width: "48px",
                    height: "48px",
                    background:
                      "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
                  }}
                >
                  <FileText size={24} color="white" />
                </div>
                <div>
                  <h3
                    className="mb-0 fw-bold"
                    style={{ fontSize: "1.5rem", color: "#1e293b" }}
                  >
                    {editIndex !== null ? "Edit" : "Add"}{" "}
                    {selectedForm.formName}
                  </h3>
                  <p
                    className="mb-0 text-muted"
                    style={{ fontSize: "0.875rem" }}
                  >
                    {selectedForm.description}
                  </p>
                </div>
              </div>
            </div>
          }
        >
          {/* Form content - keep as is */}
          <div className="p-4">
            <CustomAlert
              type={alert.type}
              title={alert.title}
              message={alert.message}
              show={alert.show}
              onClose={closeAlert}
              autoClose={3000}
            />

            <Stepper
              steps={steps}
              currentStep={currentStep}
              onStepClick={handleStepClick}
              clickable={true}
              orientation="horizontal"
            />

            <div>
              {renderStepContent()}
              <div className="d-flex justify-content-center gap-3 mt-4">
                {currentStep > 0 && (
                  <CustomButton
                    variant="secondary"
                    icon={<ArrowLeft size={18} />}
                    onClick={handlePrevious}
                  >
                    Previous
                  </CustomButton>
                )}

                {currentStep < steps.length - 1 ? (
                  <CustomButton
                    variant="primary"
                    icon={<ArrowRight size={18} />}
                    iconPosition="right"
                    onClick={handleNext}
                  >
                    Next
                  </CustomButton>
                ) : (
                  <CustomButton
                    variant="success"
                    icon={<CheckCircle size={18} />}
                    onClick={handleSubmit}
                  >
                    {editIndex !== null ? "Update" : "Submit"}
                  </CustomButton>
                )}

                <CustomButton
                  variant="secondary"
                  icon={<XCircle size={18} />}
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </CustomButton>
              </div>
            </div>
          </div>
        </CustomCard>
      </div>
    </div>
  );
}

export default AddMenuListData;
