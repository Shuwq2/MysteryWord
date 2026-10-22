import { useEffect, useRef, useState } from 'react';
import { tirerMotSecret, verifierProposition } from '../utils/wordle.js';

const NOMBRE_DE_LIGNES = 6;
const POINTS_PAR_ESSAI = [600, 500, 400, 300, 200, 100];

export default function useWordle(motsSecrets, longueurDuMot) {
    const [motSecret, setMotSecret] = useState(() => tirerMotSecret(motsSecrets));
    const [proposition, setProposition] = useState(() => Array(longueurDuMot).fill(''));
    const [essais, setEssais] = useState([]);
    const [resultatPartie, setResultatPartie] = useState(null);
    const saisieRef = useRef(null);

    useEffect(() => {
        if (!resultatPartie) {
            saisieRef.current?.focus();
        }
    }, [essais.length, resultatPartie]);

    function validerProposition(event) {
        event.preventDefault();

        const mot = proposition.join('').toUpperCase();
        if (
            mot.length !== longueurDuMot
            || essais.length === NOMBRE_DE_LIGNES
            || resultatPartie
        ) {
            return;
        }

        const resultats = verifierProposition(mot, motSecret);
        const nouveauxEssais = [...essais, {
            lettres: mot.split(''),
            resultats,
        }];

        setEssais(nouveauxEssais);
        setProposition(Array(longueurDuMot).fill(''));

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
            .slice(0, longueurDuMot);

        setProposition(mot.split('').concat(Array(longueurDuMot).fill('')).slice(0, longueurDuMot));
    }

    function relancerPartie() {
        setMotSecret(tirerMotSecret(motsSecrets));
        setProposition(Array(longueurDuMot).fill(''));
        setEssais([]);
        setResultatPartie(null);
    }

    return {
        essais,
        motSecret,
        proposition,
        resultatPartie,
        saisieRef,
        relancerPartie,
        saisirProposition,
        validerProposition,
    };
}
