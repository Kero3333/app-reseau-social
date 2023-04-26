import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

import "../public/style.css";

const root = document.querySelector("#root");
const app = createRoot(root);
const App = () => {
  const [token, setToken] = useState();

  useEffect(() => {
    const tokenStorage = localStorage.getItem("token");
    if (tokenStorage) setToken(tokenStorage);
  }, [token]);

  return (
    <BrowserRouter>
      {token ? (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register setToken={setToken} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </BrowserRouter>
  );
};

app.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
