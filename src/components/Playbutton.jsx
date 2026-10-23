import { useNavigate } from 'react-router-dom';

export default function Playbutton({ mode = 'libre', children }) {
  const navigate = useNavigate();

  return (
    <button 
    type="button"
    onClick={() => navigate(`/jeu?mode=${mode}`)}>{children || 'Lancer la partie'}</button>
  )
}