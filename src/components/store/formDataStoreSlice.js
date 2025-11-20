// store/formDataStoreSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { loadFromLocalStorage, saveToLocalStorage } from "./FormData";

// regex को हमेशा string में normalize करना
const normalizeRules = (rules = []) =>
  rules.map((rule) => ({
    ...rule,
    regex:
      rule.regex instanceof RegExp ? rule.regex.source : String(rule.regex),
  }));

const initialData = loadFromLocalStorage();

const formDataStoreSlice = createSlice({
  name: "formDataStore",
  initialState: {
    formDataStore: initialData,
  },
  reducers: {
    addForm: (state, action) => {
      const newForm = {
        ...action.payload,
        form: action.payload.form.map((f) => ({
          ...f,
          validationRules: normalizeRules(f.validationRules),
        })),
      };
      state.formDataStore.push(newForm);
      saveToLocalStorage(state.formDataStore); // localStorage update
    },

    deleteForm: (state, action) => {
      state.formDataStore = state.formDataStore.filter(
        (form) => form.formId !== action.payload.formId
      );
      saveToLocalStorage(state.formDataStore); // localStorage update
    },

    updateForm: (state, action) => {
      const updatedForm = action.payload;
      const index = state.formDataStore.findIndex(
        (f) => f.formId === updatedForm.formId
      );
      if (index !== -1) {
        state.formDataStore[index] = updatedForm;
        saveToLocalStorage(state.formDataStore); // localStorage update
      }
    },
  },
});

export const formDataAction = formDataStoreSlice.actions;
export default formDataStoreSlice.reducer;
