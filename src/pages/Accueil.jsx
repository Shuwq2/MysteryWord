import logo from '../assets/logoMW.gif'
import Playbutton from '../components/Playbutton'
import Pseudoform from '../components/Pseudoform'
import Classement from '../components/Classement'
import { Link } from 'react-router-dom'

export default function Accueil() {
  return (
    <>
      <img src={logo} alt="Logo Mystery Word" />
      <h1>Ce jeu consiste à trouver un mot mystère français en 5 tentatives</h1>
      <Pseudoform />
      <Playbutton />
      <Link className="lien-regles-accueil" to="/regles">Voir les règles</Link>
      <Classement />
    </>
  );
}