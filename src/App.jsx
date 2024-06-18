import React from "react"
import {BrowserRouter, Routes, Route} from "react-router-dom"
import './App.css'
import ArticlesPage from "./Components/ArticlesPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ArticlesPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
