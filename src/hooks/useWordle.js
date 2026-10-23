import { useEffect, useRef, useState } from 'react';
import { normaliserMot, tirerMotSecret, verifierProposition } from '../utils/wordle.js';
import { enregistrerScore } from '../utils/classement.js';

const NOMBRE_DE_LIGNES = 6;
const POINTS_PAR_ESSAI = [600, 500, 400, 300, 200, 100];
const URL_API_WIKTIONNAIRE = 'https://fr.wiktionary.org/w/api.php';
const DELAI_VERIFICATION = 5000;

export default function useWordle(motsSecrets, longueurDuMot) {
    const [motSecret, setMotSecret] = useState(() => tirerMotSecret(motsSecrets));
    const [proposition, setProposition] = useState(() => Array(longueurDuMot).fill(''));
    const [essais, setEssais] = useState([]);
    const [resultatPartie, setResultatPartie] = useState(null);
    const [verificationEnCours, setVerificationEnCours] = useState(false);
    const [propositionRefusee, setPropositionRefusee] = useState(null);
    const [avertissementApi, setAvertissementApi] = useState('');
    const saisieRef = useRef(null);

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
        if (!resultatPartie) {
            return;
        }

        const pseudo = localStorage.getItem('mysteryword-pseudo') || '';
        enregistrerScore(pseudo, resultatPartie.score);
    }, [resultatPartie]);

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
            || essais.length === NOMBRE_DE_LIGNES
            || resultatPartie
            || verificationEnCours
        ) {
            return;
        }

        setVerificationEnCours(true);
        setPropositionRefusee(null);
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
                        score: POINTS_PAR_ESSAI[nouveauxEssais.length - 1],
                    });
                } else if (nouveauxEssais.length === NOMBRE_DE_LIGNES) {
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
