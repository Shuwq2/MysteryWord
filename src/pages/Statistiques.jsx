import { useNavigate } from 'react-router-dom';
import Statistiques from '../components/Statistiques.jsx';
import './Statistiques.css';

export default function PageStatistiques() {
    const navigate = useNavigate();

    return (
        <main className="page-statistiques">
            <Statistiques />
            <button type="button" onClick={() => navigate('/')}>
                Retour à l'accueil
            </button>
        </main>
    );
}
