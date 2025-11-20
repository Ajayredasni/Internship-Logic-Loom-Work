// src/components/store/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

//  Helper Functions for LocalStorage
const loadUserFromStorage = () => {
  try {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error loading user from storage:", error);
    return null;
  }
};

const saveUserToStorage = (user) => {
  try {
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("currentUser");
    }
  } catch (error) {
    console.error("Error saving user to storage:", error);
  }
};

//  Initial State
const initialState = {
  user: loadUserFromStorage(), // Load from localStorage on app start
  isAuthenticated: !!loadUserFromStorage(), // !! this meaning convert the true for false
  loading: false,
  error: null,
};

//  Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Login Start
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    //  Login Success
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      saveUserToStorage(action.payload);
    },

    //  Login Failure
    loginFailure: (state, action) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = action.payload;
    },

    //  Logout
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      saveUserToStorage(null);
    },

    // Clear Error
    clearError: (state) => {
      state.error = null;
    },

    //  Update User
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      saveUserToStorage(state.user);
    },
  },
});

//  Export Actions
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  updateUser,
} = authSlice.actions;

//  Selectors (Easy access to state)
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

//  Export Reducer
export default authSlice.reducer;
