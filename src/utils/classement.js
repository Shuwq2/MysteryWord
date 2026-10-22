const CLE_CLASSEMENT = 'mysteryword-classement';

export function recupererClassement() {
    const classementEnregistre = localStorage.getItem(CLE_CLASSEMENT);

    if (!classementEnregistre) {
        return [];
    }

    try {
        const classement = JSON.parse(classementEnregistre);
        return Array.isArray(classement) ? classement : [];
    } catch {
        return [];
    }
}

export function enregistrerScore(pseudo, score) {
    const nouveauScore = {
        pseudo: pseudo.trim() || 'Anonyme',
        score,
    };
    const classement = [...recupererClassement(), nouveauScore]
        .sort((premier, second) => second.score - premier.score);

    localStorage.setItem(CLE_CLASSEMENT, JSON.stringify(classement));
}
