// const FormData = [
//   {
//     organizationName: "ABC Pvt Ltd",
//     formName: "Employee Registration",
//     formType: "Main Form",
//     isMainForm: true,
//     mainFormName: null,
//     description: "Form for registering new employees",
//     active: true,
//     form: [
//       {
//         field_name: "Text_Field",
//         field_type: "text_box",
//         label: "text_field",
//         placeholder: "Enter Text Field",
//         Validation: true,
//         is_show_to_listing: true,
//         is_show_to_form: true,
//         is_active: true,
//         is_hidden: false,
//         is_show_to_view: true,
//         is_searchable: false,
//         validationRules: [
//           {
//             type: "pattern",
//             value: "^[A-Za-z ]+$",
//             errorMsg: "Text field must contain only letters and spaces",
//           },
//           {
//             type: "pattern",
//             value: "^.{3,}$",
//             errorMsg: "Text field must have at least 3 characters",
//           },
//         ],
//       },
//       {
//         field_name: "email",
//         field_type: "email",
//         label: "Email",
//         placeholder: "Enter Email",
//         Validation: true,
//         is_show_to_listing: true,
//         is_show_to_form: true,
//         is_active: true,
//         is_hidden: false,
//         is_show_to_view: true,
//         validationRules: [
//           {
//             type: "pattern",
//             value: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[A-Za-z]{2,}$",
//             errorMsg: "Invalid email format",
//           },
//           {
//             type: "pattern",
//             value: "^.{6,}$",
//             errorMsg: "Email must be at least 6 characters long",
//           },
//         ],
//       },
//       {
//         field_name: "password",
//         field_type: "password",
//         label: "Password",
//         placeholder: "Enter a strong password",
//         Validation: true,
//         is_show_to_listing: true,
//         is_show_to_form: true,
//         is_active: true,
//         is_hidden: false,
//         is_show_to_view: true,
//         validationRules: [
//           {
//             type: "pattern",
//             value: "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*?&]).+$",
//             errorMsg:
//               "Password must contain letters, numbers, and a special character",
//           },
//           {
//             type: "pattern",
//             value: "^.{6,15}$",
//             errorMsg: "Password must be between 6 and 15 characters",
//           },
//         ],
//       },
//       {
//         field_name: "address",
//         field_type: "textarea",
//         label: "Address",
//         placeholder: "Enter your full address",
//         Validation: true,
//         is_show_to_listing: true,
//         is_show_to_form: true,
//         is_active: true,
//         is_hidden: false,
//         is_show_to_view: true,
//         validationRules: [
//           {
//             type: "pattern",
//             value: "^.{10,}$",
//             errorMsg: "Address must be at least 10 characters long",
//           },
//         ],
//       },
//       {
//         field_name: "phone",
//         field_type: "number",
//         label: "Mobile Number",
//         placeholder: "Enter your phone number",
//         Validation: true,
//         is_show_to_listing: true,
//         is_show_to_form: true,
//         is_active: true,
//         is_hidden: false,
//         is_show_to_view: true,
//         validationRules: [
//           {
//             type: "pattern",
//             value: "^[6-9]\\d{9}$",
//             errorMsg: "Enter valid 10-digit Indian mobile number",
//           },
//           {
//             type: "pattern",
//             value: "^\\d+$",
//             errorMsg: "Phone number should contain only digits",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     organizationName: "XYZ Solutions",
//     formName: "Project Feedback",
//     formType: "Sub Form",
//     isMainForm: false,
//     mainFormName: "Employee Registration",
//     description: "Form to collect project feedback from employees",
//     active: true,
//     form: [
//       {
//         field_name: "Full Name",
//         field_type: "text_box",
//         label: "Full Name",
//         placeholder: "Enter Full Name",
//         is_show_to_listing: true,
//         is_show_to_form: true,
//         is_active: true,
//         is_hidden: false,
//         is_show_to_view: true,
//         validationRules: [
//           {
//             type: "pattern",
//             value: "^[A-Za-z ]+$",
//             errorMsg: "Full Name must contain only letters and spaces",
//           },
//           {
//             type: "pattern",
//             value: "^.{3,}$",
//             errorMsg: "Full Name must have at least 3 characters",
//           },
//         ],
//       },
//       {
//         field_name: "gender",
//         field_type: "radio",
//         label: "Gender",
//         options: [
//           { value: "Male", label: "Male" },
//           { value: "Female", label: "Female" },
//         ],
//         dataSourceType: "static",
//         placeholder: "Select Gender",
//         Validation: true,
//         is_show_to_listing: true,
//         is_show_to_form: true,
//         is_active: true,
//         is_hidden: false,
//         is_show_to_view: true,
//         validationRules: [
//           {
//             type: "pattern",
//             value: "^(Male|Female)$",
//             errorMsg: "Please select Male or Female",
//           },
//         ],
//       },
//       {
//         field_name: "Project Name",
//         field_type: "text_box",
//         label: "Project Name",
//         placeholder: "Enter Project Name",
//         Validation: true,
//         is_show_to_listing: true,
//         is_show_to_form: true,
//         is_active: true,
//         is_hidden: false,
//         is_show_to_view: true,
//         validationRules: [
//           {
//             type: "pattern",
//             value: "^[A-Za-z ]+$",
//             errorMsg: "Project Name must contain only letters and spaces",
//           },
//           {
//             type: "pattern",
//             value: "^.{3,}$",
//             errorMsg: "Project Name must have at least 3 characters",
//           },
//         ],
//       },
//       {
//         field_name: "Project Feadback",
//         field_type: "textarea",
//         label: "Project Feadback",
//         placeholder: "Enter Project Feadback",
//         Validation: true,
//         is_show_to_listing: true,
//         is_show_to_form: true,
//         is_active: true,
//         is_hidden: false,
//         is_show_to_view: true,
//         validationRules: [
//           {
//             type: "pattern",
//             value: "^.{10,}$",
//             errorMsg: "Project Feadback must be at least 10 characters long",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     organizationName: "TechSoft",
//     formName: "Client Onboarding",
//     formType: "Main Form",
//     isMainForm: true,
//     mainFormName: null,
//     description: "Form to onboard new clients",
//     active: false,
//     form: [
//       {
//         field_name: "Client Name",
//         field_type: "text_box",
//         label: "Client Full Name",
//         placeholder: "Enter Client Full Name",
//         Validation: true,
//         is_show_to_listing: true,
//         is_show_to_form: true,
//         is_active: true,
//         is_hidden: false,
//         is_show_to_view: true,
//         validationRules: [
//           {
//             type: "pattern",
//             value: "^[A-Za-z ]+$",
//             errorMsg: "Client Full Name must contain only letters and spaces",
//           },
//           {
//             type: "pattern",
//             value: "^.{3,}$",
//             errorMsg: "Client Full Name must have at least 3 characters",
//           },
//         ],
//       },
//       {
//         field_name: "email",
//         field_type: "email",
//         label: "Email",
//         placeholder: "Enter Email",
//         is_show_to_listing: true,
//         is_show_to_form: true,
//         is_active: true,
//         is_hidden: false,
//         is_show_to_view: true,
//         validationRules: [
//           {
//             type: "pattern",
//             value: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[A-Za-z]{2,}$",
//             errorMsg: "Invalid email format",
//           },
//           {
//             type: "pattern",
//             value: "^.{6,}$",
//             errorMsg: "Email must be at least 6 characters long",
//           },
//         ],
//       },
//       {
//         field_name: "password",
//         field_type: "password",
//         label: "Password",
//         placeholder: "Enter a strong password",
//         Validation: true,
//         is_show_to_listing: true,
//         is_show_to_form: true,
//         is_active: true,
//         is_hidden: false,
//         is_show_to_view: true,
//         validationRules: [
//           {
//             type: "pattern",
//             value: "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*?&]).+$",
//             errorMsg:
//               "Password must contain letters, numbers, and a special character",
//           },
//           {
//             type: "pattern",
//             value: "^.{6,15}$",
//             errorMsg: "Password must be between 6 and 15 characters",
//           },
//         ],
//       },
//       {
//         field_name: "phone",
//         field_type: "number",
//         label: "Mobile Number",
//         placeholder: "Enter your phone number",
//         Validation: true,
//         is_show_to_listing: true,
//         is_show_to_form: true,
//         is_active: true,
//         is_hidden: false,
//         is_show_to_view: true,
//         validationRules: [
//           {
//             type: "pattern",
//             value: "^[6-9]\\d{9}$",
//             errorMsg: "Enter valid 10-digit Indian mobile number",
//           },
//           {
//             type: "pattern",
//             value: "^\\d+$",
//             errorMsg: "Phone number should contain only digits",
//           },
//         ],
//       },
//       {
//         field_name: "country",
//         field_type: "dropdown",
//         label: "Country",
//         options: [
//           { value: "India", label: "India" },
//           { value: "USA", label: "USA" },
//           { value: "UK", label: "UK" },
//         ],
//         dataSourceType: "static",
//         placeholder: "Select Country",
//         Validation: false,
//         validationRules: [],
//         is_show_to_listing: false,
//         is_show_to_form: false,
//         is_active: true,
//         is_hidden: false,
//         is_show_to_view: true,
//       },
//     ],
//   },
// ];

// export default FormData;

// utils/localStorageHelper.js
export const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem("formData");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Error loading from localStorage", err);
    return [];
  }
};

export const saveToLocalStorage = (data) => {
  try {
    localStorage.setItem("formData", JSON.stringify(data));
  } catch (err) {
    console.error("Error saving to localStorage", err);
  }
};

export const loadFromMenuLocalStorage = () => {
  try {
    const data = localStorage.getItem("formMenu");
    return data ? JSON.parse(data) : {}; // ✅ fallback as object
  } catch (err) {
    console.error("Error loading fromMenu localStorage", err);
    return {}; // ✅ fallback as object
  }
};

export const saveToLocalStorageFormMenu = (data) => {
  try {
    localStorage.setItem("formMenu", JSON.stringify(data));
  } catch (err) {
    console.error("Error saving to localStorageFormMenu", err);
  }
};
