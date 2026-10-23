import logo from '../assets/logoMW.gif'
import Playbutton from '../components/Playbutton'
import Pseudoform from '../components/Pseudoform'
import ClassementButton from '../components/ClassementButton'
import StatistiquesButton from '../components/StatistiquesButton'

export default function Accueil() {
  return (
    <>
      <img src={logo} alt="Logo Mystery Word" />
      <h1>Ce jeu consiste à trouver un mot mystère français en 5 tentatives</h1>
      <Pseudoform />
      <Playbutton />
      <div className="liens-statistiques">
        <ClassementButton />
        <StatistiquesButton />
      </div>
    </>
  );
}