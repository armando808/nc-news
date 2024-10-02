import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css'
import ArticlesPage from "./Components/ArticlesPage"
import IndividualArticle from "./Components/IndividualArticle"
import HomePage from "./Components/HomePage"
import NotFound from "./Components/NotFound"
import { UserProvider } from "./context/UserContext"
import { ThemeProvider } from "./context/ThemeContext"

function App() {
  return (
    <UserProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles/:article_id" element={<IndividualArticle />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </UserProvider>
  )
}

export default App
