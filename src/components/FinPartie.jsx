import { useNavigate } from 'react-router-dom';

export default function FinPartie({ resultatPartie, motSecret, onRejouer }) {
    const navigate = useNavigate();

    return (
        <>
            <p className="message-fin" role="status">
                {resultatPartie.statut === 'victoire'
                    ? `Victoire ! Score : ${resultatPartie.score} points.`
                    : `Défaite ! Le mot était ${motSecret}. Score : 0 point.`}
            </p>
            <div className="actions-fin">
                <button className="bouton-rejouer" type="button" onClick={onRejouer}>
                    Rejouer
                </button>
                <button
                    className="bouton-menu"
                    type="button"
                    onClick={() => navigate('/')}
                >
                    Retour au menu
                </button>
            </div>
        </>
    );
}
