import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
//React Router
import { BrowserRouter } from "react-router-dom";
import { CtxProvider } from "./context/Ctx";
import { CartCtxProvider } from "./context/CartCtx.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartCtxProvider>
        <CtxProvider>
          <App />
        </CtxProvider>
      </CartCtxProvider>
    </BrowserRouter>
  </React.StrictMode>
);
