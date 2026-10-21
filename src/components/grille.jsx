import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NOMBRE_DE_LIGNES = 6;
const LONGUEUR_DU_MOT = 5;
const MOT_SECRET = 'POMME';
const POINTS_PAR_ESSAI = [600, 500, 400, 300, 200, 100];

function verifierProposition(proposition) {
    const resultats = Array(LONGUEUR_DU_MOT).fill('gris');
    const lettresDisponibles = MOT_SECRET.split('');

    proposition.split('').forEach((lettre, index) => {
        if (lettre === MOT_SECRET[index]) {
            resultats[index] = 'vert';
            lettresDisponibles[index] = null;
        }
    });

    proposition.split('').forEach((lettre, index) => {
        if (resultats[index] === 'vert') {
            return;
        }

        const position = lettresDisponibles.indexOf(lettre);
        if (position !== -1) {
            resultats[index] = 'jaune';
            lettresDisponibles[position] = null;
        }
    });

    return resultats;
}

export default function Grille() {
    const [proposition, setProposition] = useState(Array(LONGUEUR_DU_MOT).fill(''));
    const [essais, setEssais] = useState([]);
    const [resultatPartie, setResultatPartie] = useState(null);
    const saisieRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!resultatPartie) {
            saisieRef.current?.focus();
        }
    }, [essais.length, resultatPartie]);

    function validerProposition(event) {
        event.preventDefault();

        const mot = proposition.join('').toUpperCase();
        if (
            mot.length !== LONGUEUR_DU_MOT
            || essais.length === NOMBRE_DE_LIGNES
            || resultatPartie
        ) {
            return;
        }

        const resultats = verifierProposition(mot);
        const nouveauxEssais = [...essais, {
            lettres: mot.split(''),
            resultats,
        }];

        setEssais(nouveauxEssais);
        setProposition(Array(LONGUEUR_DU_MOT).fill(''));

        if (resultats.every((resultat) => resultat === 'vert')) {
            setResultatPartie({
                statut: 'victoire',
                score: POINTS_PAR_ESSAI[nouveauxEssais.length - 1],
            });
        } else if (nouveauxEssais.length === NOMBRE_DE_LIGNES) {
            setResultatPartie({
                statut: 'defaite',
                score: 0,
            });
        }
    }

    function saisirProposition(event) {
        const mot = event.target.value
            .replace(/[^a-z]/gi, '')
            .toUpperCase()
            .slice(0, LONGUEUR_DU_MOT);

        setProposition(mot.split('').concat(Array(LONGUEUR_DU_MOT).fill('')).slice(0, LONGUEUR_DU_MOT));
    }

    function relancerPartie() {
        setProposition(Array(LONGUEUR_DU_MOT).fill(''));
        setEssais([]);
        setResultatPartie(null);
    }

    return (
        <form className="grille-form" onSubmit={validerProposition}>
            <input
                ref={saisieRef}
                className="saisie-grille"
                type="text"
                value={proposition.join('')}
                maxLength={LONGUEUR_DU_MOT}
                onChange={saisirProposition}
                aria-label="Votre proposition de cinq lettres"
                autoComplete="off"
            />
            <div className="grille">
                {Array.from({ length: NOMBRE_DE_LIGNES }, (_, ligne) =>
                    Array.from({ length: LONGUEUR_DU_MOT }, (_, colonne) => {
                        const essai = essais[ligne];
                        const ligneActive = ligne === essais.length;
                        const lettre = essai?.lettres[colonne] ?? '';
                        const resultat = essai?.resultats[colonne] ?? '';

                        if (ligneActive && essais.length < NOMBRE_DE_LIGNES) {
                            return (
                                <div className="case" key={`${ligne}-${colonne}`}>
                                    {proposition[colonne]}
                                </div>
                            );
                        }

                        return (
                            <div className={`case ${resultat}`} key={`${ligne}-${colonne}`}>
                                {lettre}
                            </div>
                        );
                    }),
                )}
            </div>
            {resultatPartie && (
                <p className="message-fin" role="status">
                    {resultatPartie.statut === 'victoire'
                        ? `Victoire ! Score : ${resultatPartie.score} points.`
                        : `Défaite ! Le mot était ${MOT_SECRET}. Score : 0 point.`}
                </p>
            )}
            {resultatPartie && (
                <div className="actions-fin">
                    <button
                        className="bouton-rejouer"
                        type="button"
                        onClick={relancerPartie}
                    >
                        Rejouer
                    </button>
                    <button
                        className="bouton-menu"
                        type="button"
                        onClick={() => navigate('/Accueil')}
                    >
                        Retour au menu
                    </button>
                </div>
            )}
        </form>
    );
}
