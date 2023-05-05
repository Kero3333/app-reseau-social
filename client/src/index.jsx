import React, { createContext, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Home } from "./pages/Home";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Profile } from "./pages/Profile";

import "../public/assets/css/style.css";

const root = document.querySelector("#root");
const app = createRoot(root);

export const TokenContext = createContext(null);

const App = () => {
  const [token, setToken] = useState();

  return (
    <BrowserRouter>
      <TokenContext.Provider value={{ token, setToken }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile/:id" element={<Profile />} />
          </Route>
          {/* <Route path="*" element={<Navigate to="/" />} /> */}
        </Routes>
      </TokenContext.Provider>
    </BrowserRouter>
  );
};

app.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
