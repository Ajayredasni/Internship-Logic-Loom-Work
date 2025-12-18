// src/components/store/formDataStoreSlice.js - UPDATED
import { createSlice } from "@reduxjs/toolkit";
import { loadFromLocalStorage, saveToLocalStorage } from "./FormData";

// regex को हमेशा string में normalize करना
const normalizeRules = (rules = []) =>
  rules.map((rule) => ({
    ...rule,
    regex:
      rule.regex instanceof RegExp ? rule.regex.source : String(rule.regex),
  }));

//  Initial data - user specific
const initialData = loadFromLocalStorage();

const formDataStoreSlice = createSlice({
  name: "formDataStore",
  initialState: {
    formDataStore: initialData,
  },
  reducers: {
    //  Add Form
    addForm: (state, action) => {
      const newForm = {
        ...action.payload,
        form: action.payload.form.map((f) => ({
          ...f,
          validationRules: normalizeRules(f.validationRules),
        })),
      };
      state.formDataStore.push(newForm);
      saveToLocalStorage(state.formDataStore);
    },

    //  Delete Form
    deleteForm: (state, action) => {
      state.formDataStore = state.formDataStore.filter(
        (form) => form.formId !== action.payload.formId
      );
      saveToLocalStorage(state.formDataStore);
    },

    //  Update Form
    updateForm: (state, action) => {
      const updatedForm = action.payload;
      const index = state.formDataStore.findIndex(
        (f) => f.formId === updatedForm.formId
      );
      if (index !== -1) {
        state.formDataStore[index] = updatedForm;
        saveToLocalStorage(state.formDataStore);
      }
    },

    //  NEW: Load user-specific data (called on login)
    loadUserData: (state, action) => {
      state.formDataStore = action.payload || [];
    },

    //  NEW: Clear data (called on logout)
    clearFormData: (state) => {
      state.formDataStore = [];
    },
  },
});

export const formDataAction = formDataStoreSlice.actions;
export default formDataStoreSlice.reducer;
