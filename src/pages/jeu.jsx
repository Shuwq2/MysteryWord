import './jeu.css';
import Grille from '../components/grille.jsx';
import Clavier from '../components/Clavier.jsx';

function Jeu() {
    return (
        <div className="Jeu">
            <Grille />
            <Clavier />
        </div>
    )
}

export default Jeu;