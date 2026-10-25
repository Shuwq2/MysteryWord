import { useNavigate } from 'react-router-dom';
import { lireReglages } from '../utils/difficultes.js';

export default function Playbutton({ mode = 'libre', children }) {
  const navigate = useNavigate();

  return (
    <button 
    type="button"
    onClick={() => {
      const reglages = lireReglages();
      navigate(`/jeu/${reglages.longueur}?mode=${reglages.mode}`);
    }}>Lancer la partie</button>
  )
}