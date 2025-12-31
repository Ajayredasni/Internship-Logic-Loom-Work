import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import Store from "./components/store/index.js";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import ProtectedRoute from "./components/ProtectedRoute"; //  Import

// Components
import FormDataTableContent from "./components/FormDataTableContent.jsx";
import FormMenuTableContent from "./components/FormMenuTableContent.jsx";
import AddForm from "./components/AddForm";
import AddMenuListData from "./components/AddMenuListData";
import ViewForm from "./components/ViewForm";
import MenuFormView from "./components/MenuFormView";
import Register from "./components/Register";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import PushNotificationForm from "./components/PushNotificationForm.jsx";
import VideoSDKMeeting from "./VidioSDKDOC/VideoSDKMeeting.jsx";
import VideoMeetingApp from "./VideoSDKCore/components/VideoMeetingApp.jsx";

const router = createBrowserRouter([
  //  Public Routes (No Authentication Required)
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },

  //  Protected Routes (Authentication Required)
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <FormDataTableContent /> },
      { path: "push-notifications", element: <PushNotificationForm /> },
      { path: "field-config/:formId", element: <FormDataTableContent /> },
      { path: "formMenu-Table/:formId", element: <FormMenuTableContent /> },
      { path: "view-form/:formId", element: <ViewForm /> },
      { path: "add-form", element: <AddForm /> },
      { path: "menuview-form", element: <MenuFormView /> },
      { path: "AddMenuListData/:formId", element: <AddMenuListData /> },
      { path: "meeting", element: <VideoSDKMeeting /> },
      { path: "Newmeeting", element: <VideoMeetingApp /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={Store}>
    <RouterProvider router={router} />
  </Provider>
);
