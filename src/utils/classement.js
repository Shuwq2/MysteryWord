const CLE_CLASSEMENT = 'mysteryword-classement';
const NOMBRE_MAX_DE_PARTIES = 10;

export function recupererClassement() {
    const classementEnregistre = localStorage.getItem(CLE_CLASSEMENT);

    if (!classementEnregistre) {
        return [];
    }

    try {
        const classement = JSON.parse(classementEnregistre);
        if (!Array.isArray(classement)) {
            return [];
        }

        return classement
            .filter((partie) => partie && typeof partie === 'object')
            .map((partie) => ({
                pseudo: typeof partie.pseudo === 'string' ? partie.pseudo : 'Anonyme',
                mot: typeof partie.mot === 'string' ? partie.mot : '—',
                essais: Number.isInteger(partie.essais) ? partie.essais : '—',
                score: Number.isFinite(partie.score) ? partie.score : 0,
                date: typeof partie.date === 'string' ? partie.date : null,
            }))
            .sort((premier, second) => second.score - premier.score)
            .slice(0, NOMBRE_MAX_DE_PARTIES);
    } catch {
        return [];
    }
}

export function enregistrerScore(pseudo, mot, essais, score) {
    const nouvellePartie = {
        pseudo: pseudo.trim() || 'Anonyme',
        mot,
        essais,
        score,
        date: new Date().toISOString(),
    };
    const classement = [...recupererClassement(), nouvellePartie]
        .sort((premier, second) => second.score - premier.score)
        .slice(0, NOMBRE_MAX_DE_PARTIES);

    localStorage.setItem(CLE_CLASSEMENT, JSON.stringify(classement));
}
