import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Jeu from './pages/Jeu.jsx'
import Accueil from './pages/Accueil'

export default function App() {
  return (
   <BrowserRouter>
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/" element={<Jeu />} />
    </Routes>
   </BrowserRouter>
  )
}