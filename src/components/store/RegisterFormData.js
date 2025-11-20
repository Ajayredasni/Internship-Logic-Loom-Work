const RegisterFormData = [
  {
    field_name: "firstName",
    field_type: "text_box",
    label: "First Name",
    placeholder: "Enter First Name",
    Validation: true,
    is_show_to_listing: true,
    is_show_to_form: true,
    validationRules: [
      {
        regex: /^[A-Za-z ]+$/,
        errorMsg: "Full Name must contain only letters and spaces",
      },
      {
        regex: /^.{3,}$/,
        errorMsg: "Full Name must have at least 3 characters",
      },
    ],
  },
  {
    field_name: "lastName",
    field_type: "text_box",
    label: "Last Name",
    placeholder: "Enter First Name",
    Validation: true,
    is_show_to_listing: true,
    is_show_to_form: true,
    validationRules: [
      {
        regex: /^[A-Za-z ]+$/,
        errorMsg: "Full Name must contain only letters and spaces",
      },
      {
        regex: /^.{3,}$/,
        errorMsg: "Full Name must have at least 3 characters",
      },
    ],
  },
  {
    field_name: "email",
    field_type: "email",
    label: "Email",
    placeholder: "Enter Email",
    Validation: true,
    is_show_to_listing: true,
    is_show_to_form: true,
    validationRules: [
      {
        regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/,
        errorMsg: "Invalid email format",
      },
      {
        regex: /^.{6,}$/,
        errorMsg: "Email must be at least 6 characters long",
      },
    ],
  },
  {
    field_name: "password",
    field_type: "password",
    label: "Password",
    placeholder: "Enter a strong password",
    Validation: true,
    is_show_to_listing: true,
    is_show_to_form: true,
    validationRules: [
      {
        regex: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
        errorMsg:
          "Password must contain letters, numbers, and a special character",
      },
      {
        regex: /^.{6,15}$/,
        errorMsg: "Password must be between 6 and 15 characters",
      },
    ],
  },
  {
    field_name: "address",
    field_type: "textarea",
    label: "Address",
    placeholder: "Enter your full address",
    Validation: true,
    is_show_to_listing: true,
    is_show_to_form: true,
    validationRules: [
      {
        regex: /^.{10,}$/,
        errorMsg: "Address must be at least 10 characters long",
      },
    ],
  },
  // {
  //   field_name: "phone",
  //   field_type: "tel",
  //   label: "Mobile Number",
  //   placeholder: "Enter your phone number",
  //   Validation: true,
  //   is_show_to_listing: true,
  //   is_show_to_form: true,
  //   validationRules: [
  //     {
  //       regex: /^[6-9]\d{9}$/,
  //       errorMsg: "Enter valid 10-digit Indian mobile number",
  //     },
  //     {
  //       regex: /^\d+$/,
  //       errorMsg: "Phone number should contain only digits",
  //     },
  //   ],
  // },
  {
    field_name: "dob",
    field_type: "date",
    label: "Date of Birth",
    placeholder: "Select your date of birth",
    Validation: true,
    is_show_to_listing: false,
    is_show_to_form: false,
    validationRules: [
      {
        regex: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
        errorMsg: "Date must be in YYYY-MM-DD format",
      },
    ],
  },
  {
    field_name: "Gender",
    field_type: "radio",
    label: "Genders",
    options: [
      {
        label: "Male",
        value: "Male",
      },
      {
        label: "Female",
        value: "Female",
      },
    ],
    dataSourceType: "static",
    placeholder: "Gender Field",
    Validation: true,
    is_show_to_listing: true,
    is_show_to_form: true,
    is_active: true,
    is_hidden: false,
    is_show_to_view: true,
    is_searchable: false,
    validationRules: [
      {
        type: "pattern",
        value: "^.+$",
        errorMsg: "Please select an option",
      },
    ],
  },
  {
    field_name: "country",
    field_type: "dropdown",
    label: "Country",
    options: ["India", "USA", "UK"],
    placeholder: "Select Country",
    Validation: false,
    validationRules: [],
    is_show_to_listing: false,
    is_show_to_form: false,
  },
  {
    field_name: "terms",
    field_type: "checkbox",
    label: "Accept Terms & Conditions",
    options: ["I agree to the terms and conditions"],
    placeholder: "Please accept terms to continue",
    Validation: false,
    validationRules: [],
    is_show_to_listing: false,
    is_show_to_form: false,
  },
];

export default RegisterFormData;
