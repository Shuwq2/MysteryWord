import { useEffect, useRef, useState } from 'react';
import {
    normaliserMot,
    tirerMotSecret,
    verifierModeDifficile,
    verifierProposition,
} from '../utils/wordle.js';
import { enregistrerPartie } from '../utils/classement.js';

const URL_API_WIKTIONNAIRE = 'https://fr.wiktionary.org/w/api.php';
const DELAI_VERIFICATION = 5000;

export default function useWordle(motsSecrets, longueurDuMot, mode = 'libre') {
    const nombreDeLignes = longueurDuMot + 1;
    const pointsParEssai = Array.from(
        { length: nombreDeLignes },
        (_, index) => (nombreDeLignes - index) * 100,
    );
    const multiplicateur = (longueurDuMot === 6 ? 1.5 : longueurDuMot === 7 ? 2 : 1)
        * (mode === 'difficile' ? 1.5 : 1);
    const [motSecret, setMotSecret] = useState(() => tirerMotSecret(motsSecrets));
    const [proposition, setProposition] = useState(() => Array(longueurDuMot).fill(''));
    const [essais, setEssais] = useState([]);
    const [resultatPartie, setResultatPartie] = useState(null);
    const [verificationEnCours, setVerificationEnCours] = useState(false);
    const [propositionRefusee, setPropositionRefusee] = useState(null);
    const [avertissementApi, setAvertissementApi] = useState('');
    const saisieRef = useRef(null);
    const scoreEnregistre = useRef(false);

    useEffect(() => {
        function reprendreSaisie() {
            if (!resultatPartie && !verificationEnCours) {
                saisieRef.current?.focus();
            }
        }

        reprendreSaisie();
        window.addEventListener('focus', reprendreSaisie);
        document.addEventListener('visibilitychange', reprendreSaisie);

        return () => {
            window.removeEventListener('focus', reprendreSaisie);
            document.removeEventListener('visibilitychange', reprendreSaisie);
        };
    }, [essais.length, resultatPartie, verificationEnCours]);

    useEffect(() => {
        if (!resultatPartie || scoreEnregistre.current) {
            return;
        }

        const pseudo = localStorage.getItem('mysteryword-pseudo') || '';
        enregistrerPartie(
            pseudo,
            motSecret,
            essais.length,
            resultatPartie.score,
            longueurDuMot,
            mode,
        );
        scoreEnregistre.current = true;
    }, [essais.length, longueurDuMot, mode, motSecret, resultatPartie]);

    function activerSaisie() {
        if (!resultatPartie && !verificationEnCours) {
            saisieRef.current?.focus();
        }
    }

    function validerProposition(event) {
        event.preventDefault();

        const mot = normaliserMot(proposition.join('').toUpperCase());
        if (
            mot.length !== longueurDuMot
            || essais.length === nombreDeLignes
            || resultatPartie
            || verificationEnCours
        ) {
            return;
        }

        setVerificationEnCours(true);
        setPropositionRefusee(null);
        const messageModeDifficile = mode === 'difficile'
            ? verifierModeDifficile(mot, essais)
            : null;
        if (messageModeDifficile) {
            setPropositionRefusee(messageModeDifficile);
            setVerificationEnCours(false);
            return;
        }
        verifierMot(mot)
            .then((motValide) => {
                if (!motValide) {
                    setPropositionRefusee(mot);
                    setProposition(Array(longueurDuMot).fill(''));
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
                        score: Math.round(pointsParEssai[nouveauxEssais.length - 1] * multiplicateur),
                    });
                } else if (nouveauxEssais.length === nombreDeLignes) {
                    setResultatPartie({
                        statut: 'defaite',
                        score: 0,
                    });
                }
            })
            .finally(() => setVerificationEnCours(false));
    }

    function saisirProposition(event) {
        setPropositionRefusee(null);
        const mot = event.target.value
            .replace(/[^a-z]/gi, '')
            .toUpperCase()
            .slice(0, longueurDuMot);

        setProposition(mot.split('').concat(Array(longueurDuMot).fill('')).slice(0, longueurDuMot));
    }

    function saisirLettre(lettre) {
        if (resultatPartie || verificationEnCours || proposition.every(Boolean)) {
            return;
        }

        setPropositionRefusee(null);
        setProposition((ancienneProposition) => {
            const indexLibre = ancienneProposition.findIndex((caractere) => !caractere);
            if (indexLibre === -1) {
                return ancienneProposition;
            }

            const nouvelleProposition = [...ancienneProposition];
            nouvelleProposition[indexLibre] = lettre;
            return nouvelleProposition;
        });
    }

    function effacerLettre() {
        if (resultatPartie || verificationEnCours) {
            return;
        }

        setProposition((ancienneProposition) => {
            const indexDerniereLettre = ancienneProposition.findLastIndex(Boolean);
            if (indexDerniereLettre === -1) {
                return ancienneProposition;
            }

            const nouvelleProposition = [...ancienneProposition];
            nouvelleProposition[indexDerniereLettre] = '';
            return nouvelleProposition;
        });
    }

    function relancerPartie() {
        setMotSecret(tirerMotSecret(motsSecrets));
        setProposition(Array(longueurDuMot).fill(''));
        setEssais([]);
        setResultatPartie(null);
        setVerificationEnCours(false);
        setPropositionRefusee(null);
        setAvertissementApi('');
        scoreEnregistre.current = false;
    }

    async function verifierMot(mot) {
        const controle = new AbortController();
        const temporisateur = setTimeout(() => controle.abort(), DELAI_VERIFICATION);

        try {
            const parametres = new URLSearchParams({
                action: 'parse',
                page: mot.toLowerCase(),
                prop: 'sections',
                format: 'json',
                origin: '*',
            });
            const reponse = await fetch(`${URL_API_WIKTIONNAIRE}?${parametres}`, {
                signal: controle.signal,
            });
            if (!reponse.ok) {
                throw new Error(`Wiktionnaire HTTP ${reponse.status}`);
            }
            const donnees = await reponse.json();
            if (donnees.error && donnees.error.code !== 'missingtitle') {
                throw new Error(`Wiktionnaire API ${donnees.error.code}`);
            }
            const sections = donnees.parse?.sections;
            if (!Array.isArray(sections)) {
                return false;
            }
            return sections.some((section) => {
                const titre = section.line.replace(/<[^>]*>/g, '').trim();
                return normaliserMot(titre).toLowerCase() === 'francais';
            });
        } catch {
            setAvertissementApi(
                "Le Wiktionnaire ne répond pas. L'essai est accepté exceptionnellement pour ne pas bloquer la partie.",
            );
            return true;
        } finally {
            clearTimeout(temporisateur);
        }
    }

    return {
        essais,
        motSecret,
        proposition,
        resultatPartie,
        verificationEnCours,
        propositionRefusee,
        avertissementApi,
        saisieRef,
        activerSaisie,
        relancerPartie,
        saisirProposition,
        saisirLettre,
        effacerLettre,
        validerProposition,
    };
}
