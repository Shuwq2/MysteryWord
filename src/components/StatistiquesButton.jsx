import { useNavigate } from 'react-router-dom';

export default function StatistiquesButton() {
    const navigate = useNavigate();

    return (
        <button type="button" onClick={() => navigate('/statistiques')}>
            Voir mes statistiques
        </button>
    );
}
