import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ToastContainer, toast } from "react-toastify";

import { ContextProvider } from "./Context/Context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ContextProvider>
    <App />{" "}
    <ToastContainer
      position="top-center"
      autoClose={700}
      limit={1}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  </ContextProvider>
);
