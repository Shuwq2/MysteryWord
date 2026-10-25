import { useNavigate } from 'react-router-dom';
import { lireReglages } from '../utils/difficultes.js';

export default function Playbutton({ mode = 'libre', children }) {
    const navigate = useNavigate();

    function lancerPartie() {
        if (mode === 'quotidienne') {
            navigate('/jeu/5?mode=quotidienne');
            return;
        }
        const reglages = lireReglages();
        navigate(`/jeu/${reglages.longueur}?mode=${reglages.mode}`);
    }

    return (
        <button type="button" onClick={lancerPartie}>
            {children || 'Lancer une partie'}
        </button>
    );
}