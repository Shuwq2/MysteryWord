import { useEffect, useRef, useState } from 'react';
import {
    millisecondesAvantMinuit,
    normaliserMot,
    obtenirJourUniversel,
    tirerMotDuJour,
    tirerMotSecret,
    verifierProposition,
} from '../utils/wordle.js';
import { enregistrerPartie } from '../utils/classement.js';

const NOMBRE_DE_LIGNES = 6;
const POINTS_PAR_ESSAI = [600, 500, 400, 300, 200, 100];
const URL_API_WIKTIONNAIRE = 'https://fr.wiktionary.org/w/api.php';
const DELAI_VERIFICATION = 5000;

const CLE_PARTIE_QUOTIDIENNE = 'mysteryword-partie-quotidienne';

function lirePartieQuotidienne(jour) {
    try {
        const partie = JSON.parse(localStorage.getItem(CLE_PARTIE_QUOTIDIENNE) || 'null');
        return partie?.jour === jour ? partie : null;
    } catch {
        return null;
    }
}

export default function useWordle(motsSecrets, longueurDuMot, mode = 'libre') {
    const jour = obtenirJourUniversel();
    const partieSauvegardee = mode === 'quotidienne' ? lirePartieQuotidienne(jour) : null;
    const [motSecret, setMotSecret] = useState(() => (
        mode === 'quotidienne' ? tirerMotDuJour(motsSecrets, jour) : tirerMotSecret(motsSecrets)
    ));
    const [proposition, setProposition] = useState(() => Array(longueurDuMot).fill(''));
    const [essais, setEssais] = useState(() => partieSauvegardee?.essais ?? []);
    const [resultatPartie, setResultatPartie] = useState(() => partieSauvegardee?.resultatPartie ?? null);
    const [verificationEnCours, setVerificationEnCours] = useState(false);
    const [propositionRefusee, setPropositionRefusee] = useState(null);
    const [avertissementApi, setAvertissementApi] = useState('');
    const saisieRef = useRef(null);
    const scoreEnregistre = useRef(false);
    const [debutInitial] = useState(() => Date.now());
    const debutPartie = useRef(partieSauvegardee?.debut ?? debutInitial);
    const [tempsEcoule, setTempsEcoule] = useState(() => partieSauvegardee?.tempsEcoule ?? 0);

    useEffect(() => {
        if (mode !== 'quotidienne' || resultatPartie) {
            return undefined;
        }
        const intervalle = window.setInterval(() => {
            setTempsEcoule(Math.floor((Date.now() - debutPartie.current) / 1000));
            if (obtenirJourUniversel() !== jour) {
                window.location.reload();
            }
        }, 1000);
        return () => window.clearInterval(intervalle);
    }, [jour, mode, resultatPartie]);

    useEffect(() => {
        if (mode === 'quotidienne') {
            localStorage.setItem(CLE_PARTIE_QUOTIDIENNE, JSON.stringify({
                jour,
                essais,
                resultatPartie,
                debut: debutPartie.current,
                tempsEcoule,
            }));
        }
    }, [essais, jour, mode, resultatPartie, tempsEcoule]);

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
        enregistrerPartie(pseudo, motSecret, essais.length, resultatPartie.score, {
            mode,
            jour: mode === 'quotidienne' ? jour : null,
            temps: mode === 'quotidienne' ? tempsEcoule : null,
        });
        scoreEnregistre.current = true;
    }, [essais.length, jour, mode, motSecret, resultatPartie, tempsEcoule]);

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
        if (mode === 'quotidienne') {
            return;
        }
        setMotSecret(tirerMotSecret(motsSecrets));
        setProposition(Array(longueurDuMot).fill(''));
        setEssais([]);
        setResultatPartie(null);
        setVerificationEnCours(false);
        setPropositionRefusee(null);
        setAvertissementApi('');
        scoreEnregistre.current = false;
        debutPartie.current = Date.now();
        setTempsEcoule(0);
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
        mode,
        tempsEcoule,
        tempsRestant: millisecondesAvantMinuit(),
    };
}
