import logo from '../assets/LogoMW.gif'
import DifficulteForm from '../components/DifficulteForm'
import Pseudoform from '../components/Pseudoform'
import ClassementButton from '../components/ClassementButton'
import StatistiquesButton from '../components/StatistiquesButton'
import { useNavigate } from 'react-router-dom'

export default function Accueil() {
  const navigate = useNavigate()

  return (
    <>
      <img src={logo} alt="Logo Mystery Word" />
      <h1>Retrouvez le mot mystère français en six essais maximum</h1>
      <Pseudoform />
      <DifficulteForm />
      <div className="liens-statistiques">
        <ClassementButton />
        <StatistiquesButton />
      </div>
      <button
        className="bouton-regles-accueil"
        type="button"
        onClick={() => navigate('/regles')}
      >
        Voir les règles
      </button>
    </>
  );
}