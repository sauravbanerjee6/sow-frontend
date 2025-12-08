import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import { Route, Routes, Navigate } from "react-router-dom";
import TermsPage from "./pages/TermsPage";
import PriceListPage from "./pages/PricelistPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/pricelist" element={<PriceListPage />} />
    </Routes>
  );
}

export default App;
