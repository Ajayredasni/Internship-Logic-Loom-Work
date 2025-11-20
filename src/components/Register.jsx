// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useSelector } from "react-redux";

// function Register() {
//   const [formData, setFormData] = useState({});
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [fieldErrors, setFieldErrors] = useState({});
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);
//   const { formDataStore } = useSelector((store) => store.formDataStore);

//   // handle input
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setFieldErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const handleCheckboxChange = (e) => {
//     const { name, value, checked } = e.target;
//     setFormData((prev) => {
//       const prevArray = prev[name] || [];
//       if (checked) {
//         return { ...prev, [name]: [...prevArray, value] };
//       } else {
//         return { ...prev, [name]: prevArray.filter((v) => v !== value) };
//       }
//     });
//     setFieldErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const validateFields = () => {
//     let errors = {};
//     formDataStore
//       .filter((field) => field.is_show_to_form && field.Validation)
//       .forEach((field) => {
//         const val = formData[field.field_name] ?? "";

//         if (!val || (Array.isArray(val) && val.length === 0)) {
//           errors[field.field_name] =
//             field.placeholder || "This field is required";
//           return;
//         }

//         for (let rule of field.validationRules) {
//           let regex;
//           if (typeof rule.regex === "string") {
//             regex = new RegExp(rule.regex);
//           } else if (rule.regex instanceof RegExp) {
//             regex = rule.regex;
//           }
//           if (regex && !regex.test(val)) {
//             errors[field.field_name] = rule.errorMsg || "Invalid value";
//             break;
//           }
//         }
//       });

//     setFieldErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleRegister = (e) => {
//     e.preventDefault();
//     setError("");
//     if (!validateFields()) {
//       setError("⚠️ Please fix the errors before submitting");
//       return;
//     }

//     let users = JSON.parse(localStorage.getItem("users")) || [];
//     const userExists = users.some((user) => user.email === formData.email);
//     if (userExists) {
//       setError("❌ Email already registered");
//       return;
//     }

//     users.push(formData);
//     localStorage.setItem("users", JSON.stringify(users));
//     setSuccess("✅ Registration successful! Redirecting...");
//     setTimeout(() => navigate("/"), 1000);
//   };

//   return (
//     <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
//       <div
//         className="card p-4 shadow-lg rounded-4 border-0"
//         style={{ maxWidth: "500px", width: "100%" }}
//       >
//         <h3 className="text-center mb-4 fw-bold text-primary">📝 Register</h3>

//         {error && (
//           <div className="alert alert-danger text-center py-2 rounded-3">
//             {error}
//           </div>
//         )}
//         {success && (
//           <div className="alert alert-success text-center py-2 rounded-3">
//             {success}
//           </div>
//         )}

//         <form onSubmit={handleRegister}>
//           {formDataStore
//             .filter((data) => data.is_show_to_form)
//             .map((field, idx) => (
//               <div key={idx} className="mb-3">
//                 {field.field_type === "text_box" && (
//                   <>
//                     <label className="form-label fw-semibold">
//                       {field.label}
//                     </label>
//                     <input
//                       type="text"
//                       className={`form-control rounded-3 shadow-sm ${
//                         fieldErrors[field.field_name] ? "is-invalid" : ""
//                       }`}
//                       name={field.field_name}
//                       value={formData[field.field_name] || ""}
//                       onChange={handleChange}
//                       placeholder={field.placeholder}
//                     />
//                     {fieldErrors[field.field_name] && (
//                       <small className="text-danger">
//                         {fieldErrors[field.field_name]}
//                       </small>
//                     )}
//                   </>
//                 )}

//                 {field.field_type === "email" && (
//                   <>
//                     <label className="form-label fw-semibold">
//                       {field.label}
//                     </label>
//                     <input
//                       type="email"
//                       className={`form-control rounded-3 shadow-sm ${
//                         fieldErrors[field.field_name] ? "is-invalid" : ""
//                       }`}
//                       name={field.field_name}
//                       value={formData[field.field_name] || ""}
//                       onChange={handleChange}
//                       placeholder={field.placeholder}
//                     />
//                     {fieldErrors[field.field_name] && (
//                       <small className="text-danger">
//                         {fieldErrors[field.field_name]}
//                       </small>
//                     )}
//                   </>
//                 )}

//                 {field.field_type === "password" && (
//                   <>
//                     <label className="form-label fw-semibold">
//                       {field.label}
//                     </label>
//                     <div className="input-group">
//                       <input
//                         type={showPassword ? "text" : "password"}
//                         className={`form-control rounded-start-3 shadow-sm ${
//                           fieldErrors[field.field_name] ? "is-invalid" : ""
//                         }`}
//                         name={field.field_name}
//                         value={formData[field.field_name] || ""}
//                         onChange={handleChange}
//                         placeholder={field.placeholder}
//                       />
//                       <span
//                         className="input-group-text bg-white rounded-end-3"
//                         onClick={() => setShowPassword(!showPassword)}
//                         style={{ cursor: "pointer" }}
//                       >
//                         <i
//                           className={`bi ${
//                             showPassword ? "bi-eye-slash" : "bi-eye"
//                           }`}
//                         ></i>
//                       </span>
//                     </div>
//                     {fieldErrors[field.field_name] && (
//                       <small className="text-danger">
//                         {fieldErrors[field.field_name]}
//                       </small>
//                     )}
//                   </>
//                 )}

//                 {field.field_type === "textarea" && (
//                   <>
//                     <label className="form-label fw-semibold">
//                       {field.label}
//                     </label>
//                     <textarea
//                       className={`form-control rounded-3 shadow-sm ${
//                         fieldErrors[field.field_name] ? "is-invalid" : ""
//                       }`}
//                       name={field.field_name}
//                       value={formData[field.field_name] || ""}
//                       onChange={handleChange}
//                       placeholder={field.placeholder}
//                       rows="3"
//                     />
//                     {fieldErrors[field.field_name] && (
//                       <small className="text-danger">
//                         {fieldErrors[field.field_name]}
//                       </small>
//                     )}
//                   </>
//                 )}

//                 {/* aur bhi field types same style me render karenge */}
//               </div>
//             ))}

//           <button
//             type="submit"
//             className="btn btn-primary w-100 py-2 mt-2 rounded-3 shadow-sm fw-semibold"
//           >
//             Register
//           </button>
//         </form>

//         <div className="text-center mt-3">
//           <p className="mb-0">
//             Already have an account?{" "}
//             <Link to="/" className="text-decoration-none fw-semibold">
//               Login
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Register;

// src/components/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import RegisterFormData from "./store/RegisterFormData";

function Register() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle checkbox change
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
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validate fields
  const validateFields = () => {
    let errors = {};
    RegisterFormData.filter(
      (field) => field.is_show_to_form && field.Validation
    ).forEach((field) => {
      const val = formData[field.field_name] ?? "";

      if (!val || (Array.isArray(val) && val.length === 0)) {
        errors[field.field_name] =
          field.placeholder || "This field is required";
        return;
      }

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

  // Handle registration
  const handleRegister = (e) => {
    e.preventDefault();
    setError("");

    if (!validateFields()) {
      setError("⚠️ Please fix the errors before submitting");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.some((user) => user.email === formData.email);

    if (userExists) {
      setError("❌ Email already registered");
      return;
    }

    // Add user to localStorage
    users.push(formData);
    localStorage.setItem("users", JSON.stringify(users));

    setSuccess("✅ Registration successful! Redirecting...");
    setTimeout(() => navigate("/"), 1000);
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div
        className="card p-4 shadow-lg rounded-4 border-0"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <h3 className="text-center mb-4 fw-bold text-primary">📝 Register</h3>

        {error && (
          <div className="alert alert-danger text-center py-2 rounded-3">
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success text-center py-2 rounded-3">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister}>
          {RegisterFormData.filter((data) => data.is_show_to_form).map(
            (field, idx) => (
              <div key={idx} className="mb-3">
                {field.field_type === "text_box" && (
                  <>
                    <label className="form-label fw-semibold">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      className={`form-control rounded-3 shadow-sm ${
                        fieldErrors[field.field_name] ? "is-invalid" : ""
                      }`}
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

                {field.field_type === "email" && (
                  <>
                    <label className="form-label fw-semibold">
                      {field.label}
                    </label>
                    <input
                      type="email"
                      className={`form-control rounded-3 shadow-sm ${
                        fieldErrors[field.field_name] ? "is-invalid" : ""
                      }`}
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
                    <label className="form-label fw-semibold">
                      {field.label}
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`form-control rounded-start-3 shadow-sm ${
                          fieldErrors[field.field_name] ? "is-invalid" : ""
                        }`}
                        name={field.field_name}
                        value={formData[field.field_name] || ""}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                      />
                      <span
                        className="input-group-text bg-white rounded-end-3"
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

                {field.field_type === "textarea" && (
                  <>
                    <label className="form-label fw-semibold">
                      {field.label}
                    </label>
                    <textarea
                      className={`form-control rounded-3 shadow-sm ${
                        fieldErrors[field.field_name] ? "is-invalid" : ""
                      }`}
                      name={field.field_name}
                      value={formData[field.field_name] || ""}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      rows="3"
                    />
                    {fieldErrors[field.field_name] && (
                      <small className="text-danger">
                        {fieldErrors[field.field_name]}
                      </small>
                    )}
                  </>
                )}

                {field.field_type === "number" && (
                  <>
                    <label className="form-label fw-semibold">
                      {field.label}
                    </label>
                    <input
                      type="number"
                      className={`form-control rounded-3 shadow-sm ${
                        fieldErrors[field.field_name] ? "is-invalid" : ""
                      }`}
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

                {field.field_type === "date" && (
                  <>
                    <label className="form-label fw-semibold">
                      {field.label}
                    </label>
                    <input
                      type="date"
                      className={`form-control rounded-3 shadow-sm ${
                        fieldErrors[field.field_name] ? "is-invalid" : ""
                      }`}
                      name={field.field_name}
                      value={formData[field.field_name] || ""}
                      onChange={handleChange}
                    />
                    {fieldErrors[field.field_name] && (
                      <small className="text-danger">
                        {fieldErrors[field.field_name]}
                      </small>
                    )}
                  </>
                )}

                {field.field_type === "radio" && (
                  <>
                    <label className="form-label fw-semibold">
                      {field.label}
                    </label>
                    <div className="d-flex gap-3 flex-wrap">
                      {field.options?.map((opt, i) => (
                        <div key={i} className="form-check">
                          <input
                            type="radio"
                            className="form-check-input"
                            name={field.field_name}
                            value={opt.value}
                            checked={formData[field.field_name] === opt.value}
                            onChange={handleChange}
                          />
                          <label className="form-check-label">
                            {opt.label}
                          </label>
                        </div>
                      ))}
                    </div>
                    {fieldErrors[field.field_name] && (
                      <small className="text-danger">
                        {fieldErrors[field.field_name]}
                      </small>
                    )}
                  </>
                )}

                {field.field_type === "checkbox" && (
                  <>
                    <label className="form-label fw-semibold">
                      {field.label}
                    </label>
                    <div className="d-flex gap-3 flex-wrap">
                      {field.options?.map((opt, i) => (
                        <div key={i} className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            value={opt.value}
                            checked={
                              Array.isArray(formData[field.field_name]) &&
                              formData[field.field_name].includes(opt.value)
                            }
                            onChange={(e) => handleCheckboxChange(e)}
                            name={field.field_name}
                          />
                          <label className="form-check-label">
                            {opt.label}
                          </label>
                        </div>
                      ))}
                    </div>
                    {fieldErrors[field.field_name] && (
                      <small className="text-danger">
                        {fieldErrors[field.field_name]}
                      </small>
                    )}
                  </>
                )}

                {field.field_type === "select" && (
                  <>
                    <label className="form-label fw-semibold">
                      {field.label}
                    </label>
                    <select
                      className={`form-select rounded-3 shadow-sm ${
                        fieldErrors[field.field_name] ? "is-invalid" : ""
                      }`}
                      name={field.field_name}
                      value={formData[field.field_name] || ""}
                      onChange={handleChange}
                    >
                      <option value="">{field.placeholder}</option>
                      {field.options?.map((opt, i) => (
                        <option key={i} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {fieldErrors[field.field_name] && (
                      <small className="text-danger">
                        {fieldErrors[field.field_name]}
                      </small>
                    )}
                  </>
                )}

                {field.field_type === "tel" && (
                  <>
                    <label className="form-label fw-semibold">
                      {field.label}
                    </label>
                    <input
                      type="tel"
                      className={`form-control rounded-3 shadow-sm ${
                        fieldErrors[field.field_name] ? "is-invalid" : ""
                      }`}
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

                {field.field_type === "file" && (
                  <>
                    <label className="form-label fw-semibold">
                      {field.label}
                    </label>
                    <input
                      type="file"
                      className={`form-control rounded-3 shadow-sm ${
                        fieldErrors[field.field_name] ? "is-invalid" : ""
                      }`}
                      name={field.field_name}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setFormData((prev) => ({
                          ...prev,
                          [field.field_name]: file,
                        }));
                        setFieldErrors((prev) => ({
                          ...prev,
                          [field.field_name]: "",
                        }));
                      }}
                    />
                    {fieldErrors[field.field_name] && (
                      <small className="text-danger">
                        {fieldErrors[field.field_name]}
                      </small>
                    )}
                  </>
                )}
              </div>
            )
          )}

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 mt-2 rounded-3 shadow-sm fw-semibold"
          >
            Register
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="mb-0">
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
