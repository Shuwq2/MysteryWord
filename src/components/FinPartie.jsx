import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function FinPartie({ resultatPartie, motSecret, onRejouer, essais, mode, jour }) {
    const navigate = useNavigate();
    const [messagePartage, setMessagePartage] = useState('');

    async function partagerResultat() {
        const lignes = essais.map((essai) => essai.resultats.map((resultat) => (
            { vert: '🟩', jaune: '🟨', gris: '⬜' }[resultat]
        )).join(''));
        const texte = `Mystery Word ${mode === 'quotidienne' ? jour : ''}\n${lignes.join('\n')}`;
        try {
            await navigator.clipboard.writeText(texte);
            setMessagePartage('Résultat copié !');
        } catch {
            setMessagePartage('Impossible de copier le résultat.');
        }
    }

    return (
        <>
            <p className="message-fin" role="status">
                {resultatPartie.statut === 'victoire'
                    ? `Victoire ! Score : ${resultatPartie.score} points.`
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
                <button className="bouton-partager" type="button" onClick={partagerResultat}>
                    Partager
                </button>
                <button className="bouton-rejouer" type="button" onClick={onRejouer} disabled={mode === 'quotidienne'}>
                    {mode === 'quotidienne' ? 'Partie terminée' : 'Rejouer'}
                </button>
                <button
                    className="bouton-menu"
                    type="button"
                    onClick={() => navigate('/')}
                >
                    Retour au menu
                </button>
            </div>
            {messagePartage && <p role="status">{messagePartage}</p>}
        </>
    );
}
