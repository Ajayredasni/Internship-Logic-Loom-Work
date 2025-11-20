// // src/components/Login.jsx
// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);

//   const handleLogin = (e) => {
//     e.preventDefault();

//     const users = JSON.parse(localStorage.getItem("users")) || [];
//     const user = users.find(
//       (user) => user.email === email && user.password === password
//     );

//     if (user) {
//       localStorage.setItem("currentUser", JSON.stringify(user));
//       navigate("/app");
//     } else {
//       setError("Invalid email or password ❌");
//       setTimeout(() => setError(""), 2000);
//     }
//   };

//   return (
//     <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
//       <div
//         className="card p-4 shadow-lg rounded-4 border-0"
//         style={{ maxWidth: "400px", width: "100%" }}
//       >
//         <h3 className="text-center mb-4 fw-bold text-primary">🔐 Login</h3>

//         {error && (
//           <div className="alert alert-danger text-center py-2 rounded-3">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleLogin}>
//           {/* Email */}
//           <div className="mb-3">
//             <label className="form-label fw-semibold">Email Address</label>
//             <input
//               type="email"
//               className="form-control rounded-3 shadow-sm"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           {/* Password */}
//           <div className="mb-3">
//             <label className="form-label fw-semibold">Password</label>
//             <div className="input-group">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 className="form-control rounded-start-3 shadow-sm"
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//               <span
//                 className="input-group-text bg-white rounded-end-3"
//                 onClick={() => setShowPassword(!showPassword)}
//                 style={{ cursor: "pointer" }}
//               >
//                 <i
//                   className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
//                 ></i>
//               </span>
//             </div>
//           </div>

//           {/* Button */}
//           <button
//             type="submit"
//             className="btn btn-primary w-100 py-2 mt-2 rounded-3 shadow-sm fw-semibold"
//           >
//             Login
//           </button>
//         </form>

//         {/* Links */}
//         <div className="text-center mt-4">
//           <p className="mb-1">
//             Don’t have an account?{" "}
//             <Link to="/register" className="text-decoration-none fw-semibold">
//               Register
//             </Link>
//           </p>
//           <p>
//             <Link
//               to="/forgot-password"
//               className="text-decoration-none text-secondary"
//             >
//               Forgot Password?
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;

// src/components/Login.jsx
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

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //  Get state from Redux
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  //  Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/app");
    }
  }, [isAuthenticated, navigate]);

  //  Clear error on component mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  //  Handle Login with Redux
  const handleLogin = (e) => {
    e.preventDefault();

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
        //  Dispatch login success
        dispatch(
          loginSuccess({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            loginTime: new Date().toISOString(),
          })
        );

        // Navigate to app (useEffect will handle this)
      } else {
        //  Dispatch login failure
        dispatch(loginFailure("Invalid email or password ❌"));

        // Auto-clear error after 3 seconds
        setTimeout(() => {
          dispatch(clearError());
        }, 3000);
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
        <h3 className="text-center mb-4 fw-bold text-primary">🔐 Login</h3>

        {/*  Error Alert from Redux */}
        {error && (
          <div className="alert alert-danger text-center py-2 rounded-3">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Email Address</label>
            <input
              type="email"
              className="form-control rounded-3 shadow-sm"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control rounded-start-3 shadow-sm"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <span
                className="input-group-text bg-white rounded-end-3"
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: loading ? "not-allowed" : "pointer" }}
              >
                <i
                  className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                ></i>
              </span>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="btn btn-primary w-100 py-2 mt-2 rounded-3 shadow-sm fw-semibold"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
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
