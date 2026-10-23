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
