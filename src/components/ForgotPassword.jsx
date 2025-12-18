// src/components/ForgotPassword.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import CustomInput from "./custom_component/CustomInput";
import CustomAlert from "./custom_component/CustomAlert"; // ✨ NEW IMPORT
import CustomButton from "./custom_component/CustomButton";
function ForgotPassword() {
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({});
  const { formDataStore } = useSelector((store) => store.formDataStore);
  const navigate = useNavigate();

  // ✨ Alert state
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateFields = () => {
    let errors = {};
    formDataStore
      .filter((field) => field.is_show_to_form && field.Validation)
      .forEach((field) => {
        if (field.field_type === "email" || field.field_type === "password") {
          const val = formData[field.field_name] ?? "";

          if (!val || (Array.isArray(val) && val.length === 0)) {
            errors[field.field_name] =
              field.placeholder || "This field is required";
            return;
          }

          for (let rule of field.validationRules) {
            if (rule.regex && !rule.regex.test(val)) {
              errors[field.field_name] = rule.errorMsg || "Invalid value";
              break;
            }
          }
        }
      });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleReset = (e) => {
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
    const userIndex = users.findIndex((user) => user.email === formData.email);

    if (userIndex === -1) {
      showAlert("error", "Not Found", "Email not found");
      return;
    }

    users[userIndex].password = formData.password;
    localStorage.setItem("users", JSON.stringify(users));

    showAlert("success", "Password Updated!", "Redirecting to login...");
    setTimeout(() => navigate("/"), 2000);
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div
        className="card p-4 shadow"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h3 className="text-center mb-4">Reset Password</h3>

        {/* ✨ Custom Alert */}
        <CustomAlert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          show={alert.show}
          onClose={closeAlert}
          autoClose={alert.type === "success" ? 2000 : 3000}
        />

        <form onSubmit={handleReset}>
          {formDataStore
            .filter((data) => data.is_show_to_form)
            .map((field, idx) => {
              if (field.field_type === "email") {
                return (
                  <CustomInput
                    key={idx}
                    type="email"
                    name={field.field_name}
                    label={field.label}
                    placeholder={field.placeholder}
                    value={formData[field.field_name] || ""}
                    onChange={handleChange}
                    error={fieldErrors[field.field_name]}
                    required
                  />
                );
              }

              if (field.field_type === "password") {
                return (
                  <CustomInput
                    key={idx}
                    type="password"
                    name={field.field_name}
                    label={`New ${field.label}`}
                    placeholder={field.placeholder}
                    value={formData[field.field_name] || ""}
                    onChange={handleChange}
                    error={fieldErrors[field.field_name]}
                    required
                  />
                );
              }

              return null;
            })}

          <CustomButton type="submit" variant="warning" fullWidth>
            Reset Password
          </CustomButton>
        </form>

        <div className="text-center mt-3">
          Remembered your password? <Link to="/">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
