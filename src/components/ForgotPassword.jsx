// // Normal Forgot Password Code
// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";

// function ForgotPassword() {
//   const [email, setEmail] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const navigate = useNavigate();

//   const handleReset = (e) => {
//     e.preventDefault();

//     let users = JSON.parse(localStorage.getItem("users")) || [];
//     const userIndex = users.findIndex((user) => user.email === email);

//     if (userIndex === -1) {
//       setError("Email not found");
//       return;
//     }

//     users[userIndex].password = newPassword;
//     localStorage.setItem("users", JSON.stringify(users));

//     setMessage("Password updated successfully! Redirecting to login...");
//     setTimeout(() => navigate("/"), 2000);
//   };

//   return (
//     <div className="container d-flex align-items-center justify-content-center vh-100">
//       <div
//         className="card p-4 shadow"
//         style={{ maxWidth: "400px", width: "100%" }}
//       >
//         <h3 className="text-center mb-4">Reset Password</h3>

//         {error && <div className="alert alert-danger">{error}</div>}
//         {message && <div className="alert alert-success">{message}</div>}

//         <form onSubmit={handleReset}>
//           <div className="mb-3">
//             <label className="form-label">Registered Email</label>
//             <input
//               type="email"
//               className="form-control"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div className="mb-3">
//             <label className="form-label">New Password</label>
//             <div className="input-group">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 className="form-control"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 required
//               />
//               <span
//                 className="input-group-text"
//                 onClick={() => setShowPassword(!showPassword)}
//                 style={{ cursor: "pointer" }}
//               >
//                 <i
//                   className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
//                 ></i>
//               </span>
//             </div>
//           </div>

//           <button type="submit" className="btn btn-warning w-100">
//             Reset Password
//           </button>
//         </form>

//         <div className="text-center mt-3">
//           Remembered your password? <Link to="/">Login</Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ForgotPassword;

// Dyanamic Forgot Password code
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
function ForgotPassword() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({}); // per-field errors
  const [formData, setFormData] = useState({});
  const { formDataStore } = useSelector((store) => store.formDataStore);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" })); // clear error on change
  };

  const validateFields = () => {
    let errors = {};

    formDataStore
      .filter((field) => field.is_show_to_form && field.Validation)
      .forEach((field) => {
        if (field.field_type === "email" || field.field_type === "password") {
          const val = formData[field.field_name] ?? "";

          // Required check
          if (!val || (Array.isArray(val) && val.length === 0)) {
            errors[field.field_name] =
              field.placeholder || "This field is required";
            return; // Stop here if required is missing
          }

          // Regex checks
          for (let rule of field.validationRules) {
            if (rule.regex && !rule.regex.test(val)) {
              errors[field.field_name] = rule.errorMsg || "Invalid value";
              break; // Stop after first failing rule
            }
          }
        }
      });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0; // count the error array total key lenght.
  };

  const handleReset = (e) => {
    e.preventDefault();

    if (!validateFields()) {
      setError("Please fix the errors before submitting");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex((user) => user.email === formData.email);

    if (userIndex === -1) {
      setError("Email not found");
      return;
    }

    users[userIndex].password = formData.password;
    localStorage.setItem("users", JSON.stringify(users));

    setMessage("Password updated successfully! Redirecting to login...");
    setTimeout(() => navigate("/"), 2000);
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div
        className="card p-4 shadow"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h3 className="text-center mb-4">Reset Password</h3>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={handleReset}>
          {formDataStore
            .filter((data) => data.is_show_to_form)
            .map((field, idx) => (
              <div key={idx} className="mb-3">
                {field.field_type === "email" && (
                  <>
                    <label className="form-label">{field.label}</label>
                    <input
                      type="email"
                      className={`form-control ${
                        fieldErrors[field.field_name] ? "is-invalid" : ""
                      } `}
                      name={field.field_name}
                      value={formData[field.field_name] || ""}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                    />
                    {fieldErrors[field.field_name] && (
                      <small className="text-danger">
                        {fieldErrors[field.field_name]}
                      </small>
                    )}
                  </>
                )}
                {field.field_type === "password" && (
                  <>
                    <label className="form-label">New {field.label}</label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`form-control ${
                          fieldErrors[field.field_name] ? "is-invalid" : ""
                        } `}
                        name={field.field_name}
                        value={formData[field.field_name] || ""}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                      />
                      <span
                        className="input-group-text"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: "pointer" }}
                      >
                        <i
                          className={`bi ${
                            showPassword ? "bi-eye-slash" : "bi-eye"
                          }`}
                        ></i>
                      </span>
                    </div>
                    {fieldErrors[field.field_name] && (
                      <small className="text-danger">
                        {fieldErrors[field.field_name]}
                      </small>
                    )}
                  </>
                )}
              </div>
            ))}

          <button type="submit" className="btn btn-warning w-100">
            Reset Password
          </button>
        </form>

        <div className="text-center mt-3">
          Remembered your password? <Link to="/">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
