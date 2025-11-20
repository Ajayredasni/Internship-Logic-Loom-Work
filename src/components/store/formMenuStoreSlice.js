import { createSlice } from "@reduxjs/toolkit";
import {
  loadFromMenuLocalStorage,
  saveToLocalStorageFormMenu,
} from "./FormData";

const initialData = loadFromMenuLocalStorage();

const formMenuStoreSlice = createSlice({
  name: "formMenuStore",
  initialState: {
    formMenuStore: initialData || {}, // Object of arrays
  },
  reducers: {
    addFormMenuCategory: (state, action) => {
      const formName = action.payload;

      if (!state.formMenuStore[formName]) {
        state.formMenuStore[formName] = [];
        saveToLocalStorageFormMenu(state.formMenuStore);
      }
    },

    // ✅ Add Data
    addFormDataToMenuStore: (state, action) => {
      const { formId, formData } = action.payload;
      if (!state.formMenuStore[formId]) {
        state.formMenuStore[formId] = [];
      }
      state.formMenuStore[formId].push(formData);
      saveToLocalStorageFormMenu(state.formMenuStore);
    },

    // ✅ Delete Category
    deleteFormMenuCategory: (state, action) => {
      const formId = action.payload;
      if (state.formMenuStore[formId]) {
        delete state.formMenuStore[formId];
        saveToLocalStorageFormMenu(state.formMenuStore);
      }
    },

    // ✅ NEW: Edit Form Data in Array
    editFormDataInMenuStore: (state, action) => {
      const { formId, index, updatedData } = action.payload;
      if (state.formMenuStore[formId] && state.formMenuStore[formId][index]) {
        state.formMenuStore[formId][index] = updatedData;
        saveToLocalStorageFormMenu(state.formMenuStore);
      }
    },
    // ✅ NEW: Delete Form Data from Array
    deleteFormDataFromMenuStore: (state, action) => {
      const { formId, index } = action.payload;
      if (state.formMenuStore[formId] && state.formMenuStore[formId][index]) {
        state.formMenuStore[formId].splice(index, 1);
        saveToLocalStorageFormMenu(state.formMenuStore);
      }
    },
  },
});

export const formMenuAction = formMenuStoreSlice.actions;
export default formMenuStoreSlice.reducer;
