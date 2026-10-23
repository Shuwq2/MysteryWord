import logo from '../assets/logoMW.gif'
import Playbutton from '../components/Playbutton'
import Pseudoform from '../components/Pseudoform'
import Classement from '../components/Classement'
import { useNavigate } from 'react-router-dom'

export default function Accueil() {
  const navigate = useNavigate()

  return (
    <>
      <img src={logo} alt="Logo Mystery Word" />
      <h1>Ce jeu consiste à trouver un mot mystère français en 5 tentatives</h1>
      <Pseudoform />
      <Playbutton />
      <button
        className="bouton-regles-accueil"
        type="button"
        onClick={() => navigate('/regles')}
      >
        Voir les règles
      </button>
      <Classement />
    </>
  );
}