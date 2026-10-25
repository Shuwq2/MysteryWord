const CLE_CLASSEMENT = 'mysteryword-classement';
const CLE_HISTORIQUE = 'mysteryword-historique';
const NOMBRE_MAX_DE_PARTIES = 10;

function lireParties(cle) {
    const contenu = localStorage.getItem(cle);

    if (!contenu) {
        return [];
    }

    try {
        const parties = JSON.parse(contenu);
        return Array.isArray(parties) ? parties : [];
    } catch {
        return [];
    }
}

export function recupererHistorique() {
    const historique = lireParties(CLE_HISTORIQUE);
    return historique.length > 0 ? historique : lireParties(CLE_CLASSEMENT);
}

function normaliserPartie(partie) {
    return {
        pseudo: typeof partie.pseudo === 'string' ? partie.pseudo : 'Anonyme',
        mot: typeof partie.mot === 'string' ? partie.mot : '—',
        essais: Number.isInteger(partie.essais) ? partie.essais : '—',
        score: Number.isFinite(partie.score) ? partie.score : 0,
        date: typeof partie.date === 'string' ? partie.date : null,
        longueur: Number.isInteger(partie.longueur) ? partie.longueur : 5,
        mode: partie.mode === 'difficile' ? 'difficile' : 'libre',
    };
}

export function recupererToutesLesParties() {
    return recupererHistorique()
        .filter((partie) => partie && typeof partie === 'object')
        .map(normaliserPartie)
        .sort((premier, second) => second.score - premier.score);
}

export function recupererClassement() {
    return recupererToutesLesParties().slice(0, NOMBRE_MAX_DE_PARTIES);
}

export function enregistrerPartie(pseudo, mot, essais, score, longueur = mot.length, mode = 'libre') {
    const partie = {
        pseudo: pseudo.trim() || 'Anonyme',
        mot,
        essais,
        score,
        victoire: score > 0,
        longueur,
        mode,
        date: new Date().toISOString(),
    };

    const historique = [...recupererHistorique(), partie];
    const classement = [...historique].sort((premier, second) => second.score - premier.score);
    localStorage.setItem(CLE_HISTORIQUE, JSON.stringify(historique));
    localStorage.setItem(CLE_CLASSEMENT, JSON.stringify(classement.slice(0, NOMBRE_MAX_DE_PARTIES)));
}

export function enregistrerScore(pseudo, mot, essais, score) {
    enregistrerPartie(pseudo, mot, essais, score);
}

export function calculerStatistiques(parties, pseudo) {
    const partiesDuJoueur = parties
        .filter((partie) => partie.pseudo === pseudo)
        .sort((premiere, seconde) => new Date(premiere.date) - new Date(seconde.date));
    const victoires = partiesDuJoueur.filter((partie) => partie.victoire ?? partie.score > 0);
    let serieEnCours = 0;
    let meilleureSerie = 0;
    const repartition = [0, 0, 0, 0, 0, 0];

    partiesDuJoueur.forEach((partie) => {
        const victoire = partie.victoire ?? partie.score > 0;
        if (victoire) {
            serieEnCours += 1;
            meilleureSerie = Math.max(meilleureSerie, serieEnCours);
            if (partie.essais >= 1 && partie.essais <= 6) {
                repartition[partie.essais - 1] += 1;
            }
        } else {
            serieEnCours = 0;
        }
    });

    return {
        partiesJouees: partiesDuJoueur.length,
        pourcentageVictoires: partiesDuJoueur.length
            ? Math.round((victoires.length / partiesDuJoueur.length) * 100)
            : 0,
        serieEnCours,
        meilleureSerie,
        totalPoints: partiesDuJoueur.reduce((total, partie) => total + partie.score, 0),
        repartition,
    };
}
