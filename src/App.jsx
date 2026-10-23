import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Jeu from './pages/jeu.jsx'
import Accueil from './pages/Accueil'
import PageStatistiques from './pages/Statistiques.jsx'
import PageClassement from './pages/Classement.jsx'

export default function App() {
  return (
   <BrowserRouter>
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/jeu" element={<Jeu />} />
      <Route path="/statistiques" element={<PageStatistiques />} />
      <Route path="/classement" element={<PageClassement />} />
    </Routes>
   </BrowserRouter>
  )
}