import { useNavigate } from 'react-router-dom';
import { lireReglages } from '../utils/difficultes.js';

export default function Playbutton() {
    const navigate = useNavigate();

    function lancerPartie() {
        const reglages = lireReglages();
        navigate(`/jeu/${reglages.longueur}?mode=${reglages.mode}`);
    }

    return (
        <button type="button" onClick={lancerPartie}>
            Lancer une partie
        </button>
    );
}