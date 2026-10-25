import { useNavigate } from 'react-router-dom';

export default function FinPartie({ resultatPartie, motSecret, onRejouer, longueur, mode }) {
    const navigate = useNavigate();

    return (
        <>
            <p className="message-fin" role="status">
                {resultatPartie.statut === 'victoire'
                    ? `Victoire ! Score : ${resultatPartie.score} points (${longueur} lettres, ${mode === 'difficile' ? 'mode difficile' : 'partie libre'}).`
                    : <>Défaite ! Le mot était <strong>{motSecret}</strong>. Score : 0 point.</>}
            </p>
            <a
                className="lien-wiktionnaire"
                href={`https://fr.wiktionary.org/wiki/${encodeURIComponent(motSecret.toLowerCase())}`}
                target="_blank"
                rel="noreferrer"
            >
                Voir « {motSecret} » sur le Wiktionnaire
            </a>
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
