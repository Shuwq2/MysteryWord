import { useNavigate } from 'react-router-dom';
import Classement from '../components/Classement.jsx';

export default function PageClassement() {
    const navigate = useNavigate();

    return (
        <main className="page-classement">
            <Classement />
            <button type="button" onClick={() => navigate('/')}>
                Retour à l'accueil
            </button>
        </main>
    );
}
