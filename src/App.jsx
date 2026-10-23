import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Jeu from './pages/jeu.jsx'
import Accueil from './pages/Accueil'
import Regles from './pages/Regles.jsx'

export default function App() {
  return (
   <BrowserRouter>
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/jeu" element={<Jeu />} />
      <Route path="/regles" element={<Regles />} />
    </Routes>
   </BrowserRouter>
  )
}