import { useNavigate } from 'react-router-dom';

export default function ClassementButton() {
    const navigate = useNavigate();

    return (
        <button type="button" onClick={() => navigate('/classement')}>
            Voir le classement
        </button>
    );
}
