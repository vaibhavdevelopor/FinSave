import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles/index.css";
import { SearchProvider } from "./context/SearchContext.jsx"; // ✅ import provider

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* ✅ Wrap the entire app inside SearchProvider */}
      <SearchProvider>
        <App />
      </SearchProvider>
    </BrowserRouter>
  </React.StrictMode>
);
