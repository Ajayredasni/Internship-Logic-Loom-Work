// ==================== GET CURRENT USER EMAIL ====================
const getCurrentUserEmail = () => {
  try {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      const user = JSON.parse(currentUser);
      return user.email || null;
    }
    return null;
  } catch (err) {
    console.error("Error getting current user email:", err);
    return null;
  }
};

// ==================== FORM DATA (Main Forms) ====================

//  Load Form Data - User Specific
export const loadFromLocalStorage = () => {
  try {
    const userEmail = getCurrentUserEmail();
    if (!userEmail) {
      console.log("No user logged in");
      return [];
    }

    const storageKey = `formData_${userEmail}`;
    const data = localStorage.getItem(storageKey);

    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Error loading from localStorage", err);
    return [];
  }
};

//  Save Form Data - User Specific
export const saveToLocalStorage = (data) => {
  try {
    const userEmail = getCurrentUserEmail();
    if (!userEmail) {
      console.error("Cannot save: No user logged in");
      return;
    }

    const storageKey = `formData_${userEmail}`;
    localStorage.setItem(storageKey, JSON.stringify(data));
    console.log(`Saved form data for user: ${userEmail}`);
  } catch (err) {
    console.error("Error saving to localStorage", err);
  }
};

// ==================== FORM MENU DATA (Form Entries) ====================

//  Load Form Menu - User Specific
export const loadFromMenuLocalStorage = () => {
  try {
    const userEmail = getCurrentUserEmail();
    if (!userEmail) {
      console.log("No user logged in");
      return {};
    }

    const storageKey = `formMenu_${userEmail}`;
    const data = localStorage.getItem(storageKey);

    return data ? JSON.parse(data) : {};
  } catch (err) {
    console.error("Error loading form menu from localStorage", err);
    return {};
  }
};

//  Save Form Menu - User Specific
export const saveToLocalStorageFormMenu = (data) => {
  try {
    const userEmail = getCurrentUserEmail();
    if (!userEmail) {
      console.error("Cannot save: No user logged in");
      return;
    }

    const storageKey = `formMenu_${userEmail}`;
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch (err) {
    console.error("Error saving form menu to localStorage", err);
  }
};

// ==================== CLEAR USER DATA (On Logout) ====================

//  NEW: Clear specific user's data
export const clearUserData = (userEmail) => {
  try {
    if (!userEmail) return;

    localStorage.removeItem(`formData_${userEmail}`);
    localStorage.removeItem(`formMenu_${userEmail}`);
  } catch (err) {
    console.error("Error clearing user data:", err);
  }
};

//  NEW: Get all user storage keys (for debugging)
export const getAllUserStorageKeys = () => {
  const keys = Object.keys(localStorage);
  return {
    formDataKeys: keys.filter((k) => k.startsWith("formData_")),
    formMenuKeys: keys.filter((k) => k.startsWith("formMenu_")),
  };
};
