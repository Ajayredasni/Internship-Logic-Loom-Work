// src/components/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; //  NEW: Import auth reducer
import formDataStoreSlice from "./formDataStoreSlice";
import formMenuStoreSlice from "./formMenuStoreSlice";

const Store = configureStore({
  reducer: {
    auth: authReducer, //  NEW: Add auth reducer
    formDataStore: formDataStoreSlice,
    formMenuStore: formMenuStoreSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these actions for localStorage compatibility
        ignoredActions: ["auth/loginSuccess", "auth/updateUser"],
        ignoredPaths: ["auth.user"],
      },
    }),
});

export default Store;
