import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/list/new" />} />
        <Route path="/list/:id" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
