// src/components/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import RegisterFormData from "./store/RegisterFormData";
import CustomInput from "./custom_component/CustomInput";
import CustomAlert from "./custom_component/CustomAlert";
import CustomButton from "./custom_component/CustomButton";
import CustomSelect from "./custom_component/CustomSelect";

function Register() {
  // ==================== STATE ====================
  const [formData, setFormData] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  // Alert state
  const [alert, setAlert] = useState({
    show: false,
    type: "success",
    title: "",
    message: "",
  });

  // ==================== ALERT HELPERS ====================
  const showAlert = (type, title, message) => {
    setAlert({ show: true, type, title, message });
  };

  const closeAlert = () => {
    setAlert({ ...alert, show: false });
  };

  // ==================== HANDLE CHANGE ====================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ==================== HANDLE CHECKBOX ====================
  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => {
      const prevArray = prev[name] || [];
      if (checked) {
        return { ...prev, [name]: [...prevArray, value] };
      } else {
        return { ...prev, [name]: prevArray.filter((v) => v !== value) };
      }
    });

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ==================== VALIDATE FIELDS ====================
  const validateFields = () => {
    let errors = {};

    RegisterFormData.filter(
      (field) => field.is_show_to_form && field.Validation
    ).forEach((field) => {
      const val = formData[field.field_name] ?? "";

      // Required check
      if (!val || (Array.isArray(val) && val.length === 0)) {
        errors[field.field_name] =
          field.placeholder || "This field is required";
        return;
      }

      // Regex validation
      for (let rule of field.validationRules) {
        let regex;
        if (typeof rule.regex === "string") {
          regex = new RegExp(rule.regex);
        } else if (rule.regex instanceof RegExp) {
          regex = rule.regex;
        }

        if (regex && !regex.test(val)) {
          errors[field.field_name] = rule.errorMsg || "Invalid value";
          break;
        }
      }
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ==================== HANDLE REGISTER ====================
  const handleRegister = (e) => {
    e.preventDefault();

    if (!validateFields()) {
      showAlert(
        "error",
        "Validation Error",
        "Please fix the errors before submitting"
      );
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.some((user) => user.email === formData.email);

    if (userExists) {
      showAlert("error", "Registration Failed", "Email already registered");
      return;
    }

    // Add user
    users.push(formData);
    localStorage.setItem("users", JSON.stringify(users));

    showAlert("success", "Registration Successful!", "Redirecting to login...");
    setTimeout(() => navigate("/"), 2000);
  };

  // ==================== RENDER FIELD ====================
  const renderField = (field) => {
    const { field_name, field_type, label, placeholder, options } = field;
    const value = formData[field_name] || "";
    const error = fieldErrors[field_name];

    if (
      ["text_box", "email", "password", "number", "tel"].includes(field_type)
    ) {
      return (
        <CustomInput
          key={field_name}
          type={field_type === "text_box" ? "text" : field_type}
          name={field_name}
          label={label}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          error={error}
          required={field.Validation}
        />
      );
    }

    if (field_type === "textarea") {
      return (
        <CustomInput
          key={field_name}
          type="textarea"
          name={field_name}
          label={label}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          error={error}
          required={field.Validation}
          rows={2}
        />
      );
    }

    if (field_type === "date") {
      return (
        <CustomInput
          key={field_name}
          type="date"
          name={field_name}
          label={label}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          error={error}
          required={field.Validation}
        />
      );
    }

    if (field_type === "radio") {
      return (
        <div key={field_name} className="mb-3">
          <label className="form-label fw-semibold">{label}</label>
          <div className="d-flex gap-3 flex-wrap">
            {options?.map((opt, i) => (
              <div key={i} className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  name={field_name}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={handleChange}
                />
                <label className="form-check-label">{opt.label}</label>
              </div>
            ))}
          </div>
          {error && <small className="text-danger d-block mt-1">{error}</small>}
        </div>
      );
    }

    // Checkbox
    if (field_type === "checkbox") {
      return (
        <div key={field_name} className="mb-3">
          <label className="form-label fw-semibold">{label}</label>
          <div className="d-flex gap-3 flex-wrap">
            {options?.map((opt, i) => (
              <div key={i} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  value={opt.value}
                  checked={Array.isArray(value) && value.includes(opt.value)}
                  onChange={handleCheckboxChange}
                  name={field_name}
                />
                <label className="form-check-label">{opt.label}</label>
              </div>
            ))}
          </div>
          {error && <small className="text-danger d-block mt-1">{error}</small>}
        </div>
      );
    }
    if (field_type === "dropdown") {
      return (
        <CustomSelect
          key={field_name}
          label={label}
          name={field_name}
          options={options}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          error={error}
          required={field.Validation}
          searchable
          clearable
        />
      );
    }
    return null;
  };
  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div
        className="card p-4 pb-2 pt-2 shadow-lg rounded-4 border-0"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <h3 className="text-center mb-3 fw-bold text-primary">📝 Register</h3>

        {/* Custom Alert */}
        <CustomAlert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          show={alert.show}
          onClose={closeAlert}
          autoClose={alert.type === "success" ? 2000 : 3000}
        />

        <form onSubmit={handleRegister}>
          {RegisterFormData.filter((data) => data.is_show_to_form).map(
            (field) => renderField(field)
          )}

          <CustomButton type="submit" variant="primary" fullWidth>
            Register
          </CustomButton>
        </form>

        <div className="text-center mt-1 mb-0">
          <p>
            Already have an account?{" "}
            <Link to="/" className="text-decoration-none fw-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
