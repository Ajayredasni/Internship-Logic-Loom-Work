// src/components/Login.jsx - UPDATED with User Data Loading
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  clearError,
  selectAuthLoading,
  selectAuthError,
  selectIsAuthenticated,
} from "./store/authSlice";
import { formDataAction } from "./store/formDataStoreSlice";
import { formMenuAction } from "./store/formMenuStoreSlice";
import {
  loadFromLocalStorage,
  loadFromMenuLocalStorage,
} from "./store/FormData";
import CustomInput from "./custom_component/CustomInput";
import CustomAlert from "./custom_component/CustomAlert";
import CustomButton from "./custom_component/CustomButton";

function Login() {
  // ==================== STATE ====================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Alert state
  const [alert, setAlert] = useState({
    show: false,
    type: "error",
    message: "",
  });

  // ==================== EFFECTS ====================
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/app");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setAlert({ show: true, type: "error", message: error });
    }
  }, [error]);

  // ==================== VALIDATION ====================
  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // ==================== HANDLE LOGIN ====================
  const handleLogin = (e) => {
    e.preventDefault();

    // Validate first
    if (!validateForm()) return;

    // Start loading
    dispatch(loginStart());

    try {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem("users")) || [];

      // Find matching user
      const user = users.find(
        (user) => user.email === email && user.password === password
      );

      if (user) {
        // ✅ Login success
        dispatch(
          loginSuccess({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            loginTime: new Date().toISOString(),
          })
        );

        //  NEW: Load user-specific form data
        const userFormData = loadFromLocalStorage();
        dispatch(formDataAction.loadUserData(userFormData));

        //  NEW: Load user-specific menu data
        const userMenuData = loadFromMenuLocalStorage();
        dispatch(formMenuAction.loadUserMenuData(userMenuData));
      } else {
        // Login failure
        dispatch(loginFailure("Invalid email or password"));
      }
    } catch (err) {
      dispatch(loginFailure("An error occurred during login"));
      console.error("Login error:", err);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div
        className="card p-4 shadow-lg rounded-4 border-0"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        {/* Header */}
        <h3 className="text-center mb-4 fw-bold text-primary">🔐 Login</h3>

        {/* Custom Alert */}
        <CustomAlert
          type={alert.type}
          message={alert.message}
          show={alert.show}
          onClose={() => {
            setAlert({ ...alert, show: false });
            dispatch(clearError());
          }}
          autoClose={3000}
        />

        {/* Form */}
        <form onSubmit={handleLogin}>
          {/* Email Input */}
          <CustomInput
            type="email"
            name="email"
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({ ...errors, email: "" });
            }}
            error={errors.email}
            required
            disabled={loading}
          />

          {/* Password Input */}
          <CustomInput
            type="password"
            name="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors({ ...errors, password: "" });
            }}
            error={errors.password}
            required
            disabled={loading}
          />

          {/* Submit Button */}
          <CustomButton
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </CustomButton>
        </form>

        {/* Links */}
        <div className="text-center mt-4">
          <p className="mb-1">
            Don't have an account?{" "}
            <Link to="/register" className="text-decoration-none fw-semibold">
              Register
            </Link>
          </p>
          <p>
            <Link
              to="/forgot-password"
              className="text-decoration-none text-secondary"
            >
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
