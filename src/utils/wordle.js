export function tirerMotSecret(mots) {
    return mots[Math.floor(Math.random() * mots.length)].toUpperCase();
}

export function verifierProposition(proposition, motSecret) {
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
