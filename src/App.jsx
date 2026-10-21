import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Jeu from './pages/Jeu.jsx'

export default function App() {
  return (
   <BrowserRouter>
    <Routes>
      <Route path="/" element={<Jeu />} />
    </Routes>
   </BrowserRouter>
  )
}