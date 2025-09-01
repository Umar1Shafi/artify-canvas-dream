// I set up the top-level routes for my app.
// I only need a few simple paths: the home page, the stylize page, and a fallback.

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Stylize from "@/pages/Stylize";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home route → Index page */}
        <Route path="/" element={<Index />} />

        {/* Main feature route → Stylize page */}
        <Route path="/stylize" element={<Stylize />} />

        {/* Fallback for unknown paths */}
        <Route
          path="*"
          element={<div style={{ padding: 16 }}>Not found</div>}
        />
      </Routes>
    </BrowserRouter>
  );
}
