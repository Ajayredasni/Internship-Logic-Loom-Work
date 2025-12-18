// import { createSlice } from "@reduxjs/toolkit";
// import {
//   loadFromMenuLocalStorage,
//   saveToLocalStorageFormMenu,
// } from "./FormData";

// const initialData = loadFromMenuLocalStorage();

// const formMenuStoreSlice = createSlice({
//   name: "formMenuStore",
//   initialState: {
//     formMenuStore: initialData || {}, // Object of arrays
//   },
//   reducers: {
//     addFormMenuCategory: (state, action) => {
//       const formName = action.payload;

//       if (!state.formMenuStore[formName]) {
//         state.formMenuStore[formName] = [];
//         saveToLocalStorageFormMenu(state.formMenuStore);
//       }
//     },

//     // ✅ Add Data
//     addFormDataToMenuStore: (state, action) => {
//       const { formId, formData } = action.payload;
//       if (!state.formMenuStore[formId]) {
//         state.formMenuStore[formId] = [];
//       }
//       state.formMenuStore[formId].push(formData);
//       saveToLocalStorageFormMenu(state.formMenuStore);
//     },

//     // ✅ Delete Category
//     deleteFormMenuCategory: (state, action) => {
//       const formId = action.payload;
//       if (state.formMenuStore[formId]) {
//         delete state.formMenuStore[formId];
//         saveToLocalStorageFormMenu(state.formMenuStore);
//       }
//     },

//     // ✅ NEW: Edit Form Data in Array
//     editFormDataInMenuStore: (state, action) => {
//       const { formId, index, updatedData } = action.payload;
//       if (state.formMenuStore[formId] && state.formMenuStore[formId][index]) {
//         state.formMenuStore[formId][index] = updatedData;
//         saveToLocalStorageFormMenu(state.formMenuStore);
//       }
//     },
//     // ✅ NEW: Delete Form Data from Array
//     deleteFormDataFromMenuStore: (state, action) => {
//       const { formId, index } = action.payload;
//       if (state.formMenuStore[formId] && state.formMenuStore[formId][index]) {
//         state.formMenuStore[formId].splice(index, 1);
//         saveToLocalStorageFormMenu(state.formMenuStore);
//       }
//     },
//   },
// });

// export const formMenuAction = formMenuStoreSlice.actions;
// export default formMenuStoreSlice.reducer;

// src/components/store/formMenuStoreSlice.js - UPDATED
import { createSlice } from "@reduxjs/toolkit";
import {
  loadFromMenuLocalStorage,
  saveToLocalStorageFormMenu,
} from "./FormData";

// ✅ Initial data - user specific
const initialData = loadFromMenuLocalStorage();

const formMenuStoreSlice = createSlice({
  name: "formMenuStore",
  initialState: {
    formMenuStore: initialData || {},
  },
  reducers: {
    // ✅ Add Form Menu Category
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

    // ✅ Edit Form Data
    editFormDataInMenuStore: (state, action) => {
      const { formId, index, updatedData } = action.payload;
      if (state.formMenuStore[formId] && state.formMenuStore[formId][index]) {
        state.formMenuStore[formId][index] = updatedData;
        saveToLocalStorageFormMenu(state.formMenuStore);
      }
    },

    // ✅ Delete Form Data
    deleteFormDataFromMenuStore: (state, action) => {
      const { formId, index } = action.payload;
      if (state.formMenuStore[formId] && state.formMenuStore[formId][index]) {
        state.formMenuStore[formId].splice(index, 1);
        saveToLocalStorageFormMenu(state.formMenuStore);
      }
    },

    // ✅ NEW: Load user-specific menu data (called on login)
    loadUserMenuData: (state, action) => {
      state.formMenuStore = action.payload || {};
    },

    // ✅ NEW: Clear menu data (called on logout)
    clearFormMenuData: (state) => {
      state.formMenuStore = {};
    },
  },
});

export const formMenuAction = formMenuStoreSlice.actions;
export default formMenuStoreSlice.reducer;
