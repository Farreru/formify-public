// App.jsx
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './css/bootstrap.css';
import './css/style.css';
// import './js/bootstrap.js';
// import './js/popper.js';
import CreateForm from "./pages/createForm";
import DetailForm from "./pages/detailForm";
import Forbidden from "./pages/forbidden";
import Login from "./pages/login";
import ManageForms from "./pages/manageForms";
import Forms from "./pages/forms";
import NotFound from "./pages/notFound";
import Responses from "./pages/responses";
import Dashboard from "./pages/dashboard";
import Register from "./pages/register";

function App() {
  return (
    <BrowserRouter>
      <div>
        {/* Your navigation and other static elements go here (if any) */}
        
        <Routes>
          <Route path="/create-form" element={<CreateForm />} />
          <Route path="/manage-forms" element={<ManageForms />}/>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/detail-form/:formSlug" element={<DetailForm />} />
          <Route path="/forms/:formSlug" element={<Forms />} />
          <Route path="/forms/:formSlug/responses" element={<Responses />} />
          <Route path="*" element={<NotFound/>} />
          <Route path="/forbidden" element={<Forbidden />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>

        {/* Your footer and other static elements go here (if any) */}
      </div>
    </BrowserRouter>
  );
}

export default App;
