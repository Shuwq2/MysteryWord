import { useNavigate } from 'react-router-dom';

export default function Playbutton() {
  const navigate = useNavigate();

  return (
    <button 
    type="button"
    onClick={() => navigate('/jeu')}>Lancer la partie</button>
  )
}