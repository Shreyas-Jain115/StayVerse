import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ManagerProvider } from "./context/ManagerContext"; // Import ManagerProvider

ReactDOM.createRoot(document.getElementById("root")).render(

    <ManagerProvider>
      <ToastContainer />
      <App />
    </ManagerProvider>
);