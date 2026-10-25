export function tirerMotSecret(mots) {
    return mots[Math.floor(Math.random() * mots.length)].toUpperCase();
}

export function obtenirJourUniversel(date = new Date()) {
    return date.toISOString().slice(0, 10);
}

export function tirerMotDuJour(mots, jour = obtenirJourUniversel()) {
    const index = [...jour].reduce((total, caractere) => (
        (total * 31 + caractere.charCodeAt(0)) % mots.length
    ), 0);
    return mots[index].toUpperCase();
}

export function millisecondesAvantMinuit(date = new Date()) {
    const prochainJour = new Date(date);
    prochainJour.setUTCHours(24, 0, 0, 0);
    return Math.max(0, prochainJour.getTime() - date.getTime());
}

export function normaliserMot(mot) {
    return mot.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function verifierProposition(proposition, motSecret) {
    proposition = normaliserMot(proposition);
    motSecret = normaliserMot(motSecret);
    const resultats = Array(motSecret.length).fill('gris');
    const lettresDisponibles = motSecret.split('');

    proposition.split('').forEach((lettre, index) => {
        if (lettre === motSecret[index]) {
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

export function verifierModeDifficile(proposition, essais) {
    const lettresFixes = {};
    const occurrencesRequises = {};

    essais.forEach(({ lettres, resultats }) => {
        const occurrencesDeLaLigne = {};
        resultats.forEach((resultat, index) => {
            const lettre = normaliserMot(lettres[index]).toUpperCase();
            if (resultat === 'vert') {
                lettresFixes[index] = lettre;
            }
            if (resultat === 'jaune' || resultat === 'vert') {
                occurrencesDeLaLigne[lettre] = (occurrencesDeLaLigne[lettre] || 0) + 1;
            }
        });

        Object.entries(occurrencesDeLaLigne).forEach(([lettre, nombre]) => {
            occurrencesRequises[lettre] = Math.max(
                occurrencesRequises[lettre] || 0,
                nombre,
            );
        });
    });

    const propositionNormalisee = normaliserMot(proposition).toUpperCase();
    for (const [position, lettre] of Object.entries(lettresFixes)) {
        if (propositionNormalisee[Number(position)] !== lettre) {
            return `Mode difficile : la lettre ${lettre} révélée en vert doit rester en position ${Number(position) + 1}.`;
        }
    }

    for (const [lettre, nombreRequis] of Object.entries(occurrencesRequises)) {
        const nombrePresent = propositionNormalisee.split('').filter((caractere) => caractere === lettre).length;
        if (nombrePresent < nombreRequis) {
            return `Mode difficile : la lettre ${lettre} révélée en jaune ou en vert doit être réutilisée au moins ${nombreRequis} fois dans votre proposition.`;
        }
    }

    return null;
}
