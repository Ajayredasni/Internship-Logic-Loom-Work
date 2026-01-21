// src/components/AddForm.jsx - Complete with Stepper
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formDataAction } from "./store/FormDataStoreSlice";
import FormFieldData from "./store/FormFieldData";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useLocation } from "react-router-dom";
import Stepper from "./custom_component/Stepper"; //
import CustomAlert from "./custom_component/CustomAlert";
import CustomButton from "./custom_component/CustomButton";
import CustomSelect from "./custom_component/CustomSelect";
import CustomModal from "./custom_component/CustomModal";
import CustomBadge from "./custom_component/CustomBadge";
import CustomTooltip from "./custom_component/CustomTooltip";
import CustomToggleSwitch from "./custom_component/CustomToggleSwitch";
import "./AddForm.css";

import {
  XCircle,
  PlusCircle,
  Trash2,
  X,
  Edit,
  Check,
  ArrowLeft,
  ArrowRight,
  Info,
} from "react-feather";

// Import icons for the basic components
import {
  Type,
  Key,
  Hash,
  FileText,
  List,
  Circle,
  CheckSquare,
  Calendar,
  Clock,
  Watch,
  File,
  Grid,
  Eye,
} from "react-feather";

const AddForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { formDataStore } = useSelector((store) => store.formDataStore);

  const [formDetails, setFormDetails] = useState({
    organizationName: "",
    formName: "",
    formType: "",
    description: "",
    isMainForm: true,
    mainFormName: null,
    active: true,
    form: [],
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [fieldConfig, setFieldConfig] = useState({
    is_show_to_listing: true,
    is_show_to_form: true,
    is_active: true,
    is_hidden: false,
    is_show_to_view: true,
    is_searchable: false,
    Validation: false,
    validationRules: [],
    options: [],
  });

  const [editingOptionIndex, setEditingOptionIndex] = useState(-1);
  const [tempOption, setTempOption] = useState({ value: "", label: "" });
  const [newOption, setNewOption] = useState({ value: "", label: "" });

  const [activeTab, setActiveTab] = React.useState("display");
  const [tempRule, setTempRule] = useState({
    type: "",
    value: "",
    errorMsg: "",
  });
  const [editingRuleIndex, setEditingRuleIndex] = useState(-1);
  const [editRuleTemp, setEditRuleTemp] = useState({ value: "", errorMsg: "" });
  const [editingFieldIndex, setEditingFieldIndex] = useState(-1);
  const [errors, setErrors] = useState({});
  const [ruleErrors, setRuleErrors] = useState({});
  const [organizations] = useState([
    "My Organization",
    "ABC Pvt Ltd",
    "Logic Loom IT Solution",
    "Jain Brother",
    "Tech pvt Ltd",
  ]);
  const [formTypes] = useState(["Main Form", "Sub Form", "Row Form"]);

  const [alert, setAlert] = useState({
    show: false,
    type: "success",
    title: "",
    message: "",
  });

  // ✨ STEPPER STATE
  const [currentStep, setCurrentStep] = useState(0);

  // ✨ STEPPER STEPS DEFINITION
  const steps = [
    {
      label: "Form Details",
      icon: <FileText size={20} />,
      description: "Basic information",
    },
    {
      label: "Add Fields",
      icon: <Grid size={20} />,
      description: "Configure form fields",
    },
    {
      label: "Review",
      icon: <Eye size={20} />,
      description: "Preview & save",
    },
  ];

  const showAlert = (type, title, message) => {
    setAlert({ show: true, type, title, message });
  };

  const closeAlert = () => {
    setAlert({ ...alert, show: false });
  };

  const mainFormsNameList = formDataStore.filter(
    (f) => f.formType === "Main Form",
  );

  // Map field types to icons
  const getFieldIcon = (fieldType) => {
    switch (fieldType) {
      case "text_box":
        return <Type size={18} />;
      case "password":
        return <Key size={18} />;
      case "number":
        return <Hash size={18} />;
      case "textarea":
        return <FileText size={18} />;
      case "dropdown":
        return <List size={18} />;
      case "radio":
        return <Circle size={18} />;
      case "checkbox":
        return <CheckSquare size={18} />;
      case "date":
        return <Calendar size={18} />;
      case "time":
        return <Clock size={18} />;
      case "custom_time":
        return <Watch size={18} />;
      case "file":
        return <File size={18} />;
      case "editor":
        return <Edit size={18} />;
      case "list":
        return <Grid size={18} />;
      default:
        return <Type size={18} />;
    }
  };

  const getFieldTypeName = (fieldType) => {
    switch (fieldType) {
      case "text_box":
        return "Text";
      case "password":
        return "Password";
      case "number":
        return "Number";
      case "textarea":
        return "Textarea";
      case "dropdown":
        return "Select";
      case "radio":
        return "Radio";
      case "checkbox":
        return "Checkbox";
      case "date":
        return "Date";
      case "time":
        return "Time";
      case "custom_time":
        return "Custom Time";
      case "file":
        return "File";
      case "editor":
        return "Editor";
      case "list":
        return "List";
      default:
        return "Text";
    }
  };

  useEffect(() => {
    if (location.state?.formData) {
      setFormDetails({ ...location.state.formData });
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update form state
    setFormDetails((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error message if input is now valid
    if (value.trim() !== "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "", // Clear only the current field's error
      }));
    }
  };
  const handleFieldConfigChange = (key, value) => {
    setFieldConfig((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Clear error for the changed key, if any
    if (errors[key]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  // Data tab option code
  const deleteOption = (idx) => {
    const updatedOptions = [...fieldConfig.options];
    updatedOptions.splice(idx, 1);
    setFieldConfig({ ...fieldConfig, options: updatedOptions });
  };

  const addNewOption = () => {
    const newErrors = {};
    if (!newOption.value.trim()) {
      newErrors.newOption_value = "Value is required";
    }
    if (!newOption.label.trim()) {
      newErrors.newOption_label = "Label is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return;
    }

    setFieldConfig((prev) => ({
      ...prev,
      options: [...prev.options, { ...newOption }],
    }));
    setNewOption({ value: "", label: "" });
    setErrors((prev) => {
      const ne = { ...prev };
      delete ne.newOption_value;
      delete ne.newOption_label;
      return ne;
    });
  };

  const handleBasicClick = (field) => {
    if (!field) return;
    setSelectedField(field);
    setFieldConfig({
      ...field,
      field_name: field.field_name || "",
      label: field.label || "",
      placeholder: field.placeholder || "",
      defaultValue: field.defaultValue || "",
      description: field.description || "",
      Validation: field.Validation ?? false,
      validationRules: field.validationRules ? [...field.validationRules] : [],
      options: field.options ? [...field.options] : [],
      is_show_to_listing: field.is_show_to_listing ?? true,
      is_show_to_form: field.is_show_to_form ?? true,
      is_active: field.is_active ?? true,
      is_hidden: field.is_hidden ?? false,
      is_show_to_view: field.is_show_to_view ?? true,
      is_searchable: field.is_searchable ?? false,
      field_type: field.field_type || "text_box",
    });
    setTempRule({ type: "", value: "", errorMsg: "" });
    setEditingFieldIndex(-1);
    setErrors({});
    setRuleErrors({});
    setShowModal(true);
  };

  const editField = (field, index) => {
    setSelectedField(field);
    setFieldConfig({
      ...field,
    });
    setEditingFieldIndex(index);
    setTempRule({ type: "", value: "", errorMsg: "" });
    setErrors({});
    setRuleErrors({});
    setShowModal(true);
  };
  // drop zone delete button
  const deleteField = (index) => {
    const updatedForm = formDetails.form.filter((_, i) => i !== index);
    setFormDetails({
      ...formDetails,
      form: updatedForm,
    });
  };

  const validateFieldConfig = () => {
    let newErrors = {};

    // 🔹 Basic field validations
    if (!fieldConfig.field_name) {
      newErrors.field_name = "Field name is required";
    }
    if (!fieldConfig.label) {
      newErrors.label = "Label is required";
    }
    if (!fieldConfig.placeholder) {
      newErrors.placeholder = "Placeholder is required";
    }

    // 🔹 Check unfinished tempRule (important!)
    if (tempRule.type || tempRule.value || tempRule.errorMsg) {
      if (!tempRule.type) {
        newErrors.tempRule_type = "Validation type is required";
      }

      if (!tempRule.value) {
        newErrors.tempRule_value = "Value is required";
      } else if (
        tempRule.type === "required" &&
        tempRule.value !== "true" &&
        tempRule.value !== "false"
      ) {
        newErrors.tempRule_value =
          "Value must be true or false for required type";
      } else if (tempRule.type === "pattern") {
        try {
          new RegExp(tempRule.value);
        } catch (e) {
          newErrors.tempRule_value = "Invalid regex pattern";
        }
      }

      if (!tempRule.errorMsg?.trim()) {
        newErrors.tempRule_errorMsg = "Error message is required";
      }
    }

    // 🔹 Validation rules check
    if (fieldConfig.Validation) {
      if (
        !fieldConfig.validationRules ||
        fieldConfig.validationRules.length === 0
      ) {
        newErrors.validationRules = "At least one validation rule is required";
      } else {
        fieldConfig.validationRules.forEach((rule, idx) => {
          if (!rule.type) {
            newErrors[`validationRules_${idx}_type`] = "Type is required";
          }

          if (!rule.value) {
            newErrors[`validationRules_${idx}_value`] = "Value is required";
          } else if (
            rule.type === "required" &&
            rule.value !== "true" &&
            rule.value !== "false"
          ) {
            newErrors[`validationRules_${idx}_value`] =
              "Value must be true or false";
          } else if (rule.type === "pattern") {
            try {
              new RegExp(rule.value);
            } catch (e) {
              newErrors[`validationRules_${idx}_value`] =
                "Invalid regex pattern";
            }
          }

          if (!rule.errorMsg?.trim()) {
            newErrors[`validationRules_${idx}_errorMsg`] =
              "Error message is required";
          }
        });
      }
    }

    // 🔹 Options validation for Static Data Source
    if (fieldConfig.dataSourceType === "static") {
      if (
        !fieldConfig.options ||
        fieldConfig.options.length === 0 ||
        fieldConfig.options.some((opt) => !opt.value || !opt.label)
      ) {
        newErrors.options = "All options must have both value and label.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldSave = () => {
    // 1. Check unfinished tempRule, add if valid
    if (tempRule.type || tempRule.value || tempRule.errorMsg) {
      const addedSuccessfully = addValidationRule();
      if (!addedSuccessfully) {
        return; // Don't proceed if tempRule invalid
      }
    }

    // 2. Validate full fieldConfig (basic validation)
    if (!validateFieldConfig()) return;

    // 3. Extra validation for option fields on both add/edit
    if (["radio", "select", "checkbox"].includes(fieldConfig.field_type)) {
      const optionErrors = {};
      if (!fieldConfig.options || fieldConfig.options.length === 0) {
        optionErrors.options = "At least one option is required.";
      } else {
        for (let opt of fieldConfig.options) {
          if (!opt.value || !opt.label) {
            optionErrors.options = "Each option must have a value and a label.";
            break;
          }
        }
      }
      if (Object.keys(optionErrors).length > 0) {
        setErrors((prev) => ({ ...prev, ...optionErrors }));
        return; // block saving on errors
      }
    }

    // 4. Save logic same for add/edit
    if (editingFieldIndex >= 0) {
      // Editing existing field — keep the same id
      const updatedForm = [...formDetails.form];
      updatedForm[editingFieldIndex] = fieldConfig;
      setFormDetails({
        ...formDetails,
        form: updatedForm,
      });
      showAlert(
        "success",
        "Field Updated!",
        "Field has been updated successfully!",
      );
    } else {
      // Adding new field — give it a unique id
      const newField = {
        ...fieldConfig,
        fieldId: uuidv4(), // 👈 unique id add here
      };
      setFormDetails((prev) => ({
        ...prev,
        form: [...prev.form, newField],
      }));
      showAlert(
        "success",
        "Field Added!",
        "Field has been added successfully!",
      );
    }

    // 5. Reset modal state & errors
    setShowModal(false);
    setTempRule({ type: "", value: "", errorMsg: "" });
    setEditingFieldIndex(-1);
    setErrors({}); // Clear all errors on success
  };

  const deleteValidationRule = (idx) => {
    const updated = fieldConfig.validationRules.filter((_, i) => i !== idx);
    setFieldConfig((prev) => ({
      ...prev,
      validationRules: updated,
    }));
  };

  const addValidationRule = () => {
    let newErrors = {};

    // Type required
    if (!tempRule.type) {
      newErrors.type = "Type is required";
    }

    // Value validation
    if (tempRule.type === "required") {
      if (tempRule.value !== "true" && tempRule.value !== "false") {
        newErrors.value = "Value must be 'true' or 'false'";
      }
    } else if (tempRule.type === "pattern") {
      if (!tempRule.value || tempRule.value.trim() === "") {
        newErrors.value = "Pattern is required";
      } else {
        try {
          new RegExp(tempRule.value);
        } catch {
          newErrors.value = "Invalid regex pattern";
        }
      }
    } else {
      if (!tempRule.value || tempRule.value.trim() === "") {
        newErrors.value = "Value is required";
      }
    }

    // errorMsg validation
    if (!tempRule.errorMsg || tempRule.errorMsg.trim() === "") {
      newErrors.errorMsg = "Error message is required";
    }

    // Prevent duplicate require
    if (
      tempRule.type === "required" &&
      fieldConfig.validationRules.some((r) => r.type === "required")
    ) {
      newErrors.type = "Require rule already added";
    }

    if (Object.keys(newErrors).length > 0) {
      setRuleErrors(newErrors);
      return false;
    }

    // If valid, add
    setFieldConfig((prev) => ({
      ...prev,
      validationRules: [
        ...(prev.validationRules || []),
        {
          type: tempRule.type,
          value: tempRule.value,
          errorMsg: tempRule.errorMsg,
        },
      ],
    }));

    // Clear temp and errors
    setTempRule({ type: "", value: "", errorMsg: "" });
    setRuleErrors({});
    return true;
  };

  // ✨ STEP VALIDATION
  const validateStep = (step) => {
    let newErrors = {};

    if (step === 0) {
      // Step 0: Form Details validation
      if (!formDetails.organizationName)
        newErrors.organizationName = "Organization name is required";
      if (!formDetails.formName) newErrors.formName = "Form name is required";
      if (!formDetails.formType) newErrors.formType = "Form type is required";
      if (!formDetails.description)
        newErrors.description = "Description is required";

      if (formDetails.formType === "Sub Form" && formDetails.isMainForm) {
        newErrors.isMainForm =
          "Sub Form must have 'Main Form No' selected (not a main form)";
      } else if (
        formDetails.formType === "Main Form" &&
        !formDetails.isMainForm
      ) {
        newErrors.isMainForm = "Main Form must be marked as Main Form";
      }

      if (!formDetails.isMainForm && !formDetails.mainFormName) {
        newErrors.mainFormName = "Main Form Name is required";
      }
    } else if (step === 1) {
      // Step 1: Fields validation
      if (formDetails.form.length === 0) {
        newErrors.form = "At least one field must be added";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✨ HANDLE NEXT STEP
  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      showAlert("error", "Validation Error", "Please fill all required fields");
    }
  };

  // ✨ HANDLE PREVIOUS STEP
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ✨ HANDLE STEP CLICK
  const handleStepClick = (step) => {
    if (step < currentStep) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFormSave = () => {
    // Validate all steps
    if (!validateStep(0) || !validateStep(1)) {
      showAlert("error", "Validation Error", "Please complete all steps");
      return;
    }

    if (location.state?.formData) {
      const updatedForm = {
        ...formDetails,
        updatedAt: new Date().toISOString(),
      };
      dispatch(formDataAction.updateForm(updatedForm));
      showAlert("success", "Updated!", "Form has been updated successfully!");
    } else {
      const newForm = {
        ...formDetails,
        formId: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch(formDataAction.addForm(newForm));
      showAlert("success", "Created!", "Form has been created successfully!");
    }

    console.log(formDetails);
    setTimeout(() => navigate("/app"), 1500);
  };

  // ✨ RENDER STEP CONTENT
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        // Step 0: Form Details
        return (
          <div className="addform-section">
            <div className="form-grid">
              <div className="form-group">
                <CustomSelect
                  label="Organization Name"
                  name="organizationName"
                  options={organizations.map((org) => ({
                    value: org,
                    label: org,
                  }))}
                  value={formDetails.organizationName}
                  onChange={(e) => {
                    setFormDetails({
                      ...formDetails,
                      organizationName: e.target.value,
                    });
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      organizationName: "",
                    }));
                  }}
                  placeholder="Select Organization"
                  error={errors.organizationName}
                  required
                  searchable
                  clearable
                />
              </div>

              <div className="form-group">
                <label>
                  Form Name <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  type="text"
                  name="formName"
                  className="form-input"
                  value={formDetails.formName}
                  onChange={handleInputChange}
                  placeholder="Enter Form Name"
                />
                {errors.formName && (
                  <small className="error-text">{errors.formName}</small>
                )}
              </div>
              <div className="form-group">
                <CustomSelect
                  label="Form Type"
                  name="formType"
                  options={formTypes.map((type) => ({
                    value: type,
                    label: type,
                  }))}
                  value={formDetails.formType}
                  onChange={(e) => {
                    setFormDetails({
                      ...formDetails,
                      formType: e.target.value,
                    });
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      formType: "",
                    }));
                  }}
                  placeholder="Select Form Type"
                  error={errors.formType}
                  required
                  searchable
                  clearable
                />
              </div>

              <div className="form-group ">
                <label>
                  Description <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <textarea
                  className="form-textarea"
                  value={formDetails.description}
                  name="description"
                  onChange={handleInputChange}
                  placeholder="Enter Description"
                />
                {errors.description && (
                  <small className="error-text">{errors.description}</small>
                )}
              </div>

              <div className="form-group">
                <label>Main Form?</label>
                <select
                  className="form-select"
                  value={formDetails.isMainForm ? "true" : "false"}
                  onChange={(e) => {
                    const newIsMainForm = e.target.value === "true";
                    setFormDetails((prev) => ({
                      ...prev,
                      isMainForm: newIsMainForm,
                    }));
                    if (
                      (formDetails.formType === "Sub Form" && !newIsMainForm) ||
                      (formDetails.formType === "Main Form" && newIsMainForm)
                    ) {
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        isMainForm: "",
                      }));
                    }
                  }}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {errors.isMainForm && (
                  <small className="error-text">{errors.isMainForm}</small>
                )}
              </div>
              {!formDetails.isMainForm && (
                <div className="form-group">
                  <CustomSelect
                    label="Main Form Name"
                    name="mainFormName"
                    options={mainFormsNameList.map((item) => ({
                      value: item.formId,
                      label: item.formName,
                    }))}
                    value={formDetails.mainFormName || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormDetails({
                        ...formDetails,
                        mainFormName: value,
                      });
                      if (value) {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          mainFormName: "",
                        }));
                      }
                    }}
                    placeholder="-- Select Main Form Name --"
                    error={errors.mainFormName}
                    required
                    searchable
                    clearable
                  />
                </div>
              )}
              <div className="form-group full-width">
                <CustomToggleSwitch
                  checked={formDetails.active}
                  onChange={(checked) =>
                    setFormDetails({
                      ...formDetails,
                      active: checked,
                    })
                  }
                  label="Status"
                  labelPosition="left"
                  size="md"
                  onColor="success"
                />
              </div>
            </div>
          </div>
        );

      case 1:
        // Step 1: Add Fields
        return (
          <div className="two-column-layout">
            <div className="column sidebar">
              <h4 className="section-title">BASIC COMPONENTS</h4>
              <div className="components-list">
                {FormFieldData.map((field) => (
                  <div
                    key={field.field_name}
                    className="component-item"
                    onClick={() => handleBasicClick(field)}
                  >
                    <span className="component-icon">
                      {getFieldIcon(field.field_type)}
                    </span>
                    <span className="component-name">{field.field_name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="column">
              <h4 className="section-title">
                DROP ZONE
                {formDetails.form.length > 0 && (
                  <CustomBadge
                    variant="info"
                    size="sm"
                    pill
                    style={{ marginLeft: "12px" }}
                  >
                    {formDetails.form.length}
                  </CustomBadge>
                )}
              </h4>
              <div className="drop-zone">
                {formDetails.form.length === 0 ? (
                  <p className="dropzone-placeholder">
                    Drag components here or click on components to add
                  </p>
                ) : (
                  <div className="dropped-components-grid">
                    {formDetails.form.map((f, idx) => (
                      <div key={idx} className="dropped-item-grid">
                        {/* <div className="field-type-pill">
                          {getFieldTypeName(f.field_type)}
                        </div> */}
                        <CustomBadge variant="primary" size="sm">
                          {getFieldTypeName(f.field_type)}
                        </CustomBadge>
                        <span className="field-badge">{idx + 1}</span>
                        <span className="dropped-item-text">{f.label}</span>
                        <div className="dropped-item-actions">
                          <CustomButton
                            variant="warning"
                            outline
                            size="sm"
                            icon={<Edit size={14} />}
                            onClick={() => editField(f, idx)}
                            title="Edit field"
                            style={{
                              width: "32px",
                              height: "32px",
                              padding: "0",
                            }}
                          />
                          <CustomButton
                            variant="danger"
                            outline
                            size="sm"
                            icon={<Trash2 size={14} />}
                            onClick={() => deleteField(idx)}
                            title="Delete field"
                            style={{
                              width: "32px",
                              height: "32px",
                              padding: "0",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {errors.form && (
                  <small className="error-text">{errors.form}</small>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        // Step 2: Review
        return (
          <div className="addform-section">
            <h4 className="section-title">Review Form Details</h4>
            <div
              style={{
                backgroundColor: "#f8f9fa",
                padding: "20px",
                borderRadius: "12px",
                marginBottom: "20px",
              }}
            >
              <div style={{ marginBottom: "12px" }}>
                <strong>Organization:</strong> {formDetails.organizationName}
              </div>
              <div style={{ marginBottom: "12px" }}>
                <strong>Form Name:</strong> {formDetails.formName}
              </div>
              <div style={{ marginBottom: "12px" }}>
                <strong>Form Type:</strong> {formDetails.formType}
              </div>
              <div style={{ marginBottom: "12px" }}>
                <strong>Description:</strong> {formDetails.description}
              </div>
              <div style={{ marginBottom: "12px" }}>
                <strong>Status:</strong>{" "}
                {formDetails.active ? "Active" : "Inactive"}
              </div>
              <div>
                <strong>Total Fields:</strong> {formDetails.form.length}
              </div>
            </div>

            {formDetails.form.length > 0 && (
              <>
                <h4 className="section-title">Form Fields</h4>
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      backgroundColor: "#fff",
                    }}
                  >
                    <thead>
                      <tr style={{ backgroundColor: "#f1f5f9" }}>
                        <th
                          style={{
                            padding: "12px",
                            textAlign: "left",
                            borderBottom: "2px solid #e2e8f0",
                          }}
                        >
                          #
                        </th>
                        <th
                          style={{
                            padding: "12px",
                            textAlign: "left",
                            borderBottom: "2px solid #e2e8f0",
                          }}
                        >
                          Field Name
                        </th>
                        <th
                          style={{
                            padding: "12px",
                            textAlign: "left",
                            borderBottom: "2px solid #e2e8f0",
                          }}
                        >
                          Type
                        </th>
                        <th
                          style={{
                            padding: "12px",
                            textAlign: "left",
                            borderBottom: "2px solid #e2e8f0",
                          }}
                        >
                          Label
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {formDetails.form.map((field, idx) => (
                        <tr key={idx}>
                          <td
                            style={{
                              padding: "12px",
                              borderBottom: "1px solid #f1f5f9",
                            }}
                          >
                            {idx + 1}
                          </td>
                          <td
                            style={{
                              padding: "12px",
                              borderBottom: "1px solid #f1f5f9",
                            }}
                          >
                            {field.field_name}
                          </td>
                          <td
                            style={{
                              padding: "12px",
                              borderBottom: "1px solid #f1f5f9",
                            }}
                          >
                            {getFieldTypeName(field.field_type)}
                          </td>
                          <td
                            style={{
                              padding: "12px",
                              borderBottom: "1px solid #f1f5f9",
                            }}
                          >
                            {field.label}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="addform-container">
        <div className="addform-card">
          <h3 className="addform-title">Create Form</h3>

          <CustomAlert
            type={alert.type}
            title={alert.title}
            message={alert.message}
            show={alert.show}
            onClose={closeAlert}
            autoClose={1500}
          />

          {/* ✨ STEPPER COMPONENT */}
          <Stepper
            steps={steps}
            currentStep={currentStep}
            onStepClick={handleStepClick}
            clickable={true}
            orientation="horizontal"
          />

          {/* ✨ RENDER CURRENT STEP CONTENT */}
          {renderStepContent()}

          {/* ✨ NAVIGATION BUTTONS */}
          <div className="form-actions-fixed">
            {currentStep > 0 && (
              <CustomButton
                variant="secondary"
                icon={<ArrowLeft size={16} />}
                onClick={handlePrevious}
              >
                Previous
              </CustomButton>
            )}

            {currentStep < steps.length - 1 ? (
              <CustomButton
                variant="primary"
                icon={<ArrowRight size={16} />}
                iconPosition="right"
                onClick={handleNext}
              >
                Next
              </CustomButton>
            ) : (
              <CustomButton variant="success" onClick={handleFormSave}>
                Save Form
              </CustomButton>
            )}

            <CustomButton
              variant="secondary"
              icon={<XCircle size={16} />}
              onClick={() => navigate("/app")}
            >
              Cancel
            </CustomButton>
          </div>
        </div>
      </div>
      <CustomModal
        show={showModal && selectedField && fieldConfig}
        onClose={() => setShowModal(false)}
        title={`${editingFieldIndex >= 0 ? "EDIT FIELD" : "ADD FIELD"} - ${
          selectedField?.field_name || ""
        }`}
        size="lg"
        footer={
          <>
            <CustomButton variant="primary" onClick={handleFieldSave}>
              {editingFieldIndex >= 0 ? "Update Field" : "Save Field"}
            </CustomButton>
            <CustomButton variant="light" onClick={() => setShowModal(false)}>
              Cancel
            </CustomButton>
          </>
        }
      >
        {/* Tabs */}
        <div className="tab-header">
          <div
            className={`tab-item ${activeTab === "display" ? "active" : ""}`}
            onClick={() => setActiveTab("display")}
          >
            Display
          </div>
          <div
            className={`tab-item ${activeTab === "constraint" ? "active" : ""}`}
            onClick={() => setActiveTab("constraint")}
          >
            Constraint
          </div>
          {["radio", "select", "checkbox"].includes(
            selectedField?.field_type,
          ) && (
            <div
              className={`tab-item ${activeTab === "data" ? "active" : ""}`}
              onClick={() => setActiveTab("data")}
            >
              Data
            </div>
          )}
        </div>

        <div className="modal-body">
          {/* Display Tab Content */}
          {activeTab === "display" && (
            <>
              <div className="modal-section">
                <div className="form-grid-two-columns">
                  <div className="form-group">
                    <label>Label Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={fieldConfig.label}
                      name="label"
                      onChange={(e) =>
                        handleFieldConfigChange("label", e.target.value)
                      }
                      placeholder="Text Field"
                    />
                    {errors.label && (
                      <small className="error-text">{errors.label}</small>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Field Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={fieldConfig.field_name}
                      name="field_name"
                      onChange={(e) =>
                        handleFieldConfigChange("field_name", e.target.value)
                      }
                      placeholder="text_field"
                    />
                    {errors.field_name && (
                      <small className="error-text">{errors.field_name}</small>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Default Value</label>
                    <input
                      type="text"
                      className="form-input"
                      value={fieldConfig.defaultValue}
                      onChange={(e) =>
                        setFieldConfig({
                          ...fieldConfig,
                          defaultValue: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Placeholder *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={fieldConfig.placeholder}
                      name="placeholder"
                      onChange={(e) =>
                        handleFieldConfigChange("placeholder", e.target.value)
                      }
                      placeholder="Enter Text Field"
                    />
                    {errors.placeholder && (
                      <small className="error-text">{errors.placeholder}</small>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Tooltip</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter tooltip"
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <input
                      type="text"
                      className="form-input"
                      value={fieldConfig.description}
                      onChange={(e) =>
                        setFieldConfig({
                          ...fieldConfig,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter Description"
                    />
                  </div>
                </div>
              </div>

              <div className="cards-container">
                <div className="card">
                  <div className="card-content">
                    <div className="d-flex align-items-center gap-2">
                      <CustomToggleSwitch
                        checked={fieldConfig.is_show_to_listing}
                        onChange={(checked) =>
                          setFieldConfig({
                            ...fieldConfig,
                            is_show_to_listing: checked,
                          })
                        }
                        label="Show in Listing"
                        size="md"
                        onColor="primary"
                      />
                      <CustomTooltip
                        content="Display this field as a column in data tables"
                        placement="right"
                      >
                        <Info
                          size={14}
                          style={{ color: "#94a3b8", cursor: "help" }}
                        />
                      </CustomTooltip>
                    </div>
                    <div className="form-group">
                      <label>Listing Value Path</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g., data.value"
                      />
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-content">
                    <div className="d-flex align-items-center gap-2">
                      <CustomToggleSwitch
                        checked={fieldConfig.is_show_to_form}
                        onChange={(checked) =>
                          setFieldConfig({
                            ...fieldConfig,
                            is_show_to_form: checked,
                          })
                        }
                        label="Show in Form"
                        size="md"
                        onColor="primary"
                      />
                      <CustomTooltip
                        content="Show this field in forms"
                        placement="right"
                      >
                        <Info size={14} style={{ color: "#94a3b8" }} />
                      </CustomTooltip>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <CustomToggleSwitch
                        checked={fieldConfig.is_active}
                        onChange={(checked) =>
                          setFieldConfig({
                            ...fieldConfig,
                            is_active: checked,
                          })
                        }
                        label="Active"
                        size="md"
                        onColor="success"
                      />
                      <CustomTooltip
                        content="Enable or disable this field globally"
                        placement="right"
                      >
                        <Info size={14} style={{ color: "#94a3b8" }} />
                      </CustomTooltip>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <CustomToggleSwitch
                        checked={fieldConfig.is_hidden}
                        onChange={(checked) =>
                          setFieldConfig({
                            ...fieldConfig,
                            is_hidden: checked,
                          })
                        }
                        label="Hidden"
                        size="md"
                        onColor="warning"
                      />
                      <CustomTooltip
                        content="Hide field but still store its value"
                        placement="right"
                      >
                        <Info size={14} style={{ color: "#94a3b8" }} />
                      </CustomTooltip>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-content">
                    <div className="d-flex align-items-center gap-2">
                      <CustomToggleSwitch
                        checked={fieldConfig.is_show_to_view}
                        onChange={(checked) =>
                          setFieldConfig({
                            ...fieldConfig,
                            is_show_to_view: checked,
                          })
                        }
                        label="Show in View"
                        size="md"
                        onColor="primary"
                      />
                      <CustomTooltip
                        content="Display this field in view/details page"
                        placement="right"
                      >
                        <Info size={14} style={{ color: "#94a3b8" }} />
                      </CustomTooltip>
                    </div>
                    <div className="form-group">
                      <label>View Value Path</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g., data.value"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Constraint Tab Content */}
          {activeTab === "constraint" && (
            <div className="modal-section">
              <h5 className="section-title">Validation</h5>
              <div style={{ marginBottom: "20px" }}>
                <CustomToggleSwitch
                  checked={fieldConfig.Validation}
                  onChange={(checked) =>
                    setFieldConfig({
                      ...fieldConfig,
                      Validation: checked,
                    })
                  }
                  label="Enable Validation"
                  labelPosition="left"
                  size="md"
                  onColor="success"
                />
              </div>

              {fieldConfig.Validation && (
                <div className="validation-section">
                  {errors.validationRules && (
                    <small className="error-text">
                      {errors.validationRules}
                    </small>
                  )}

                  {/* Header row */}
                  <div
                    className="validation-rule header-row"
                    style={{
                      display: "flex",
                      fontWeight: "bold",
                      padding: "8px 0",
                      gap: "8px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    <div style={{ width: "20%" }}>Constraint Type</div>
                    <div style={{ width: "30%" }}>Value</div>
                    <div style={{ width: "35%" }}>Error Message</div>
                    <div style={{ width: "15%", textAlign: "center" }}>
                      Action
                    </div>
                  </div>

                  {/* Existing rules */}
                  {fieldConfig.validationRules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="validation-rule rule-row"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "4px 0",
                      }}
                    >
                      {/* Type */}
                      <div style={{ width: "20%" }}>
                        <CustomSelect
                          name="validationRuleTypeEdit"
                          options={[
                            { value: "required", label: "Required" },
                            { value: "pattern", label: "Pattern" },
                          ]}
                          value={rule.type}
                          onChange={() => {}}
                          disabled
                          searchable={false}
                          clearable={false}
                          style={{ marginBottom: "0" }}
                        />
                      </div>

                      {/* Value */}
                      <div style={{ width: "30%" }}>
                        <input
                          className="form-input"
                          type="text"
                          placeholder={
                            rule.type === "required"
                              ? "true / false"
                              : "Regex pattern"
                          }
                          value={
                            editingRuleIndex === idx
                              ? editRuleTemp.value
                              : rule.value
                          }
                          disabled={editingRuleIndex !== idx}
                          onChange={(e) => {
                            if (editingRuleIndex === idx) {
                              const newVal = e.target.value;
                              setEditRuleTemp((prev) => ({
                                ...prev,
                                value: newVal,
                              }));
                              let error = "";
                              if (!newVal) {
                                error = "Value is required";
                              } else if (
                                rule.type === "required" &&
                                newVal !== "true" &&
                                newVal !== "false"
                              ) {
                                error = "Value must be true or false";
                              } else if (rule.type === "pattern") {
                                try {
                                  new RegExp(newVal);
                                } catch {
                                  error = "Invalid regex pattern";
                                }
                              }
                              setErrors((prev) => {
                                const ne = { ...prev };
                                if (error)
                                  ne[`validationRules_${idx}_value`] = error;
                                else delete ne[`validationRules_${idx}_value`];
                                return ne;
                              });
                            }
                          }}
                        />
                        {errors[`validationRules_${idx}_value`] && (
                          <small className="error-text">
                            {errors[`validationRules_${idx}_value`]}
                          </small>
                        )}
                      </div>

                      {/* Error Message */}
                      <div style={{ width: "35%" }}>
                        <input
                          className="form-input"
                          type="text"
                          placeholder="Error message"
                          value={
                            editingRuleIndex === idx
                              ? editRuleTemp.errorMsg
                              : rule.errorMsg
                          }
                          disabled={editingRuleIndex !== idx}
                          onChange={(e) => {
                            if (editingRuleIndex === idx) {
                              const newErrMsg = e.target.value;
                              setEditRuleTemp((prev) => ({
                                ...prev,
                                errorMsg: newErrMsg,
                              }));
                              const error = !newErrMsg.trim()
                                ? "Error message is required"
                                : "";
                              setErrors((prev) => {
                                const ne = { ...prev };
                                if (error)
                                  ne[`validationRules_${idx}_errorMsg`] = error;
                                else
                                  delete ne[`validationRules_${idx}_errorMsg`];
                                return ne;
                              });
                            }
                          }}
                        />
                        {errors[`validationRules_${idx}_errorMsg`] && (
                          <small className="error-text">
                            {errors[`validationRules_${idx}_errorMsg`]}
                          </small>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div
                        style={{
                          width: "15%",
                          display: "flex",
                          justifyContent: "center",
                          gap: "6px",
                        }}
                      >
                        {editingRuleIndex === idx ? (
                          <>
                            <CustomButton
                              variant="success"
                              outline
                              size="sm"
                              icon={<Check size={14} />}
                              onClick={() => {
                                if (
                                  errors[`validationRules_${idx}_value`] ||
                                  errors[`validationRules_${idx}_errorMsg`]
                                ) {
                                  return;
                                }
                                const updated = [
                                  ...fieldConfig.validationRules,
                                ];
                                updated[idx] = {
                                  ...updated[idx],
                                  value: editRuleTemp.value,
                                  errorMsg: editRuleTemp.errorMsg,
                                };
                                setFieldConfig({
                                  ...fieldConfig,
                                  validationRules: updated,
                                });
                                setEditingRuleIndex(-1);
                                setErrors((prev) => {
                                  const ne = { ...prev };
                                  delete ne[`validationRules_${idx}_value`];
                                  delete ne[`validationRules_${idx}_errorMsg`];
                                  return ne;
                                });
                              }}
                              style={{
                                width: "32px",
                                height: "32px",
                                padding: "0",
                              }}
                            />
                            <CustomButton
                              variant="danger"
                              outline
                              size="sm"
                              icon={<X size={14} />}
                              onClick={() => {
                                setEditingRuleIndex(-1);
                                setErrors((prev) => {
                                  const ne = { ...prev };
                                  delete ne[`validationRules_${idx}_value`];
                                  delete ne[`validationRules_${idx}_errorMsg`];
                                  return ne;
                                });
                              }}
                              style={{
                                width: "32px",
                                height: "32px",
                                padding: "0",
                              }}
                            />
                          </>
                        ) : (
                          <>
                            <CustomButton
                              variant="warning"
                              outline
                              size="sm"
                              icon={<Edit size={14} />}
                              onClick={() => {
                                setEditingRuleIndex(idx);
                                setEditRuleTemp({
                                  value: rule.value,
                                  errorMsg: rule.errorMsg,
                                });
                              }}
                              style={{
                                width: "32px",
                                height: "32px",
                                padding: "0",
                              }}
                            />
                            <CustomButton
                              variant="danger"
                              outline
                              size="sm"
                              icon={<Trash2 size={14} />}
                              onClick={() => {
                                deleteValidationRule(idx);
                                if (editingRuleIndex === idx)
                                  setEditingRuleIndex(-1);
                              }}
                              style={{
                                width: "32px",
                                height: "32px",
                                padding: "0",
                              }}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Add new rule row */}
                  <div
                    className="validation-rule rule-row"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "10px",
                      paddingTop: "8px",
                      borderTop: "1px solid #ccc",
                    }}
                  >
                    <div style={{ width: "20%" }}>
                      <CustomSelect
                        name="validationRuleType"
                        options={[
                          ...(!fieldConfig.validationRules.some(
                            (r) => r.type === "required",
                          )
                            ? [{ value: "required", label: "Required" }]
                            : []),
                          { value: "pattern", label: "Pattern" },
                        ]}
                        value={tempRule.type || ""}
                        onChange={(e) => {
                          setTempRule({
                            ...tempRule,
                            type: e.target.value,
                            value: "",
                            errorMsg: "",
                          });
                          setRuleErrors((prev) => {
                            const ne = { ...prev };
                            delete ne.type;
                            delete ne.value;
                            delete ne.errorMsg;
                            return ne;
                          });
                        }}
                        placeholder="Select type"
                        error={ruleErrors.type}
                        searchable={false}
                        clearable={false}
                        style={{ marginBottom: "0" }}
                      />
                    </div>

                    <div style={{ width: "30%" }}>
                      <input
                        className="form-input"
                        type="text"
                        placeholder={
                          tempRule.type === "required"
                            ? "true or false"
                            : tempRule.type === "pattern"
                              ? "Regex pattern"
                              : "Value"
                        }
                        value={tempRule.value}
                        onChange={(e) => {
                          setTempRule({
                            ...tempRule,
                            value: e.target.value,
                          });
                          setRuleErrors((prev) => {
                            const ne = { ...prev };
                            delete ne.value;
                            return ne;
                          });
                        }}
                      />
                      {ruleErrors.value && (
                        <small className="error-text">{ruleErrors.value}</small>
                      )}
                    </div>

                    <div style={{ width: "35%" }}>
                      <input
                        className="form-input"
                        type="text"
                        placeholder="Error message"
                        value={tempRule.errorMsg}
                        onChange={(e) => {
                          setTempRule({
                            ...tempRule,
                            errorMsg: e.target.value,
                          });
                          setRuleErrors((prev) => {
                            const ne = { ...prev };
                            delete ne.errorMsg;
                            return ne;
                          });
                        }}
                      />
                      {ruleErrors.errorMsg && (
                        <small className="error-text">
                          {ruleErrors.errorMsg}
                        </small>
                      )}
                    </div>

                    <div
                      style={{
                        width: "15%",
                        display: "flex",
                        justifyContent: "center",
                        gap: "4px",
                      }}
                    >
                      <CustomButton
                        variant="success"
                        outline
                        size="sm"
                        icon={<PlusCircle size={16} />}
                        onClick={addValidationRule}
                        style={{ width: "32px", height: "32px", padding: "0" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Data Tab Content */}
          {activeTab === "data" && (
            <div className="modal-section">
              <div className="form-group">
                <CustomSelect
                  label="Data Source Type"
                  name="dataSourceType"
                  options={[
                    { value: "static", label: "Static" },
                    { value: "API", label: "API" },
                    { value: "Dyanamic", label: "Dynamic" },
                  ]}
                  value={fieldConfig.dataSourceType}
                  onChange={(e) =>
                    setFieldConfig({
                      ...fieldConfig,
                      dataSourceType: e.target.value,
                    })
                  }
                  placeholder="Select Data Source Type"
                  required
                  searchable={false}
                  clearable={false}
                />
              </div>

              {fieldConfig.dataSourceType === "static" && (
                <div className="validation-section">
                  {errors.options && (
                    <small className="error-text">{errors.options}</small>
                  )}

                  <div
                    className="validation-rule header-row"
                    style={{
                      display: "flex",
                      fontWeight: "bold",
                      padding: "8px 0",
                      gap: "8px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    <div style={{ width: "40%" }}>Value *</div>
                    <div style={{ width: "40%" }}>Label *</div>
                    <div style={{ width: "20%", textAlign: "center" }}>
                      Action
                    </div>
                  </div>

                  {/* Existing Options */}
                  {fieldConfig.options.map((opt, idx) => (
                    <div
                      key={idx}
                      className="validation-rule rule-row"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "4px 0",
                      }}
                    >
                      <div style={{ width: "40%" }}>
                        <input
                          className="form-input"
                          type="text"
                          value={
                            editingOptionIndex === idx
                              ? tempOption.value
                              : opt.value
                          }
                          onChange={(e) => {
                            if (editingOptionIndex === idx) {
                              setTempOption((prev) => ({
                                ...prev,
                                value: e.target.value,
                              }));
                              if (errors[`options_${idx}_value`]) {
                                setErrors((prev) => {
                                  const ne = { ...prev };
                                  delete ne[`options_${idx}_value`];
                                  return ne;
                                });
                              }
                            }
                          }}
                          disabled={editingOptionIndex !== idx}
                        />
                        {errors[`options_${idx}_value`] && (
                          <small className="error-text">
                            {errors[`options_${idx}_value`]}
                          </small>
                        )}
                      </div>

                      <div style={{ width: "40%" }}>
                        <input
                          className="form-input"
                          type="text"
                          value={
                            editingOptionIndex === idx
                              ? tempOption.label
                              : opt.label
                          }
                          onChange={(e) => {
                            if (editingOptionIndex === idx) {
                              setTempOption((prev) => ({
                                ...prev,
                                label: e.target.value,
                              }));
                              if (errors[`options_${idx}_label`]) {
                                setErrors((prev) => {
                                  const ne = { ...prev };
                                  delete ne[`options_${idx}_label`];
                                  return ne;
                                });
                              }
                            }
                          }}
                          disabled={editingOptionIndex !== idx}
                        />
                        {errors[`options_${idx}_label`] && (
                          <small className="error-text">
                            {errors[`options_${idx}_label`]}
                          </small>
                        )}
                      </div>

                      <div
                        style={{
                          width: "20%",
                          display: "flex",
                          justifyContent: "center",
                          gap: "6px",
                        }}
                      >
                        {editingOptionIndex === idx ? (
                          <>
                            <CustomButton
                              variant="success"
                              outline
                              size="sm"
                              icon={<Check size={14} />}
                              onClick={() => {
                                let hasError = false;
                                const errorsToSet = {};

                                if (!tempOption.value.trim()) {
                                  errorsToSet[`options_${idx}_value`] =
                                    "Value is required";
                                  hasError = true;
                                }
                                if (!tempOption.label.trim()) {
                                  errorsToSet[`options_${idx}_label`] =
                                    "Label is required";
                                  hasError = true;
                                }

                                if (hasError) {
                                  setErrors((prev) => ({
                                    ...prev,
                                    ...errorsToSet,
                                  }));
                                  return;
                                }

                                const updated = [...fieldConfig.options];
                                updated[idx] = {
                                  value: tempOption.value.trim(),
                                  label: tempOption.label.trim(),
                                };
                                setFieldConfig({
                                  ...fieldConfig,
                                  options: updated,
                                });
                                setEditingOptionIndex(-1);
                                setTempOption({ value: "", label: "" });

                                setErrors((prev) => {
                                  const ne = { ...prev };
                                  delete ne[`options_${idx}_value`];
                                  delete ne[`options_${idx}_label`];
                                  return ne;
                                });
                              }}
                              style={{
                                width: "32px",
                                height: "32px",
                                padding: "0",
                              }}
                            />
                            <CustomButton
                              variant="danger"
                              outline
                              size="sm"
                              icon={<X size={14} />}
                              onClick={() => {
                                setEditingOptionIndex(-1);
                                setTempOption({ value: "", label: "" });
                                setErrors((prev) => {
                                  const ne = { ...prev };
                                  delete ne[`options_${idx}_value`];
                                  delete ne[`options_${idx}_label`];
                                  return ne;
                                });
                              }}
                              style={{
                                width: "32px",
                                height: "32px",
                                padding: "0",
                              }}
                            />
                          </>
                        ) : (
                          <>
                            <CustomButton
                              variant="warning"
                              outline
                              size="sm"
                              icon={<Edit size={14} />}
                              onClick={() => {
                                setEditingOptionIndex(idx);
                                setTempOption({
                                  value: opt.value,
                                  label: opt.label,
                                });
                              }}
                              style={{
                                width: "32px",
                                height: "32px",
                                padding: "0",
                              }}
                            />
                            <CustomButton
                              variant="danger"
                              outline
                              size="sm"
                              icon={<Trash2 size={14} />}
                              onClick={() => deleteOption(idx)}
                              style={{
                                width: "32px",
                                height: "32px",
                                padding: "0",
                              }}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Add New Option Row */}
                  <div
                    className="validation-rule rule-row"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "10px",
                      paddingTop: "8px",
                      borderTop: "1px solid #ccc",
                    }}
                  >
                    <div style={{ width: "40%" }}>
                      <input
                        className="form-input"
                        type="text"
                        placeholder="Value"
                        value={newOption.value}
                        onChange={(e) => {
                          setNewOption({ ...newOption, value: e.target.value });
                          if (errors.newOption_value) {
                            setErrors((prev) => {
                              const ne = { ...prev };
                              delete ne.newOption_value;
                              return ne;
                            });
                          }
                        }}
                      />
                      {errors.newOption_value && (
                        <small className="error-text">
                          {errors.newOption_value}
                        </small>
                      )}
                    </div>

                    <div style={{ width: "40%" }}>
                      <input
                        className="form-input"
                        type="text"
                        placeholder="Label"
                        value={newOption.label}
                        onChange={(e) => {
                          setNewOption({
                            ...newOption,
                            label: e.target.label || e.target.value,
                          });
                          if (errors.newOption_label) {
                            setErrors((prev) => {
                              const ne = { ...prev };
                              delete ne.newOption_label;
                              return ne;
                            });
                          }
                        }}
                      />
                      {errors.newOption_label && (
                        <small className="error-text">
                          {errors.newOption_label}
                        </small>
                      )}
                    </div>

                    <div
                      style={{
                        width: "20%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <CustomButton
                        variant="success"
                        outline
                        size="sm"
                        icon={<PlusCircle size={16} />}
                        onClick={addNewOption}
                        style={{ width: "32px", height: "32px", padding: "0" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CustomModal>
    </>
  );
};

export default AddForm;
