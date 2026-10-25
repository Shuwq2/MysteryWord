import test from 'node:test';
import assert from 'node:assert/strict';
import {
    millisecondesAvantMinuit,
    normaliserMot,
    obtenirJourUniversel,
    tirerMotDuJour,
    verifierModeDifficile,
    verifierProposition,
} from './wordle.js';

test('normalise les accents sans modifier les autres lettres', () => {
    assert.equal(normaliserMot('Écran'), 'Ecran');
});

test('colore une proposition entièrement correcte en vert', () => {
    assert.deepEqual(verifierProposition('pomme', 'pomme'), [
        'vert', 'vert', 'vert', 'vert', 'vert',
    ]);
});

test('colore correctement une lettre double quand une occurrence est exacte', () => {
    assert.deepEqual(verifierProposition('moumm', 'pomme'), [
        'jaune', 'vert', 'gris', 'vert', 'gris',
    ]);
});

test('ne colore pas deux fois une lettre double quand une seule occurrence est disponible', () => {
    assert.deepEqual(verifierProposition('maman', 'pomme'), [
        'jaune', 'gris', 'vert', 'gris', 'gris',
    ]);
});

test('le mot du jour est déterministe pour une date donnée', () => {
    const mots = ['abord', 'acier', 'aider'];
    assert.equal(tirerMotDuJour(mots, '2026-10-23'), tirerMotDuJour(mots, '2026-10-23'));
    assert.equal(tirerMotDuJour(mots, '2026-10-23').length, 5);
});

test('calcule le jour universel et le temps jusqu’à minuit UTC', () => {
    const date = new Date('2026-10-23T22:30:00.000Z');
    assert.equal(obtenirJourUniversel(date), '2026-10-23');
    assert.equal(millisecondesAvantMinuit(date), 90 * 60 * 1000);
});

test('refuse de déplacer une lettre verte en mode difficile', () => {
    const essais = [{
        lettres: ['P', 'O', 'M', 'M', 'E'],
        resultats: ['vert', 'gris', 'gris', 'gris', 'gris'],
    }];

    assert.match(
        verifierModeDifficile('APPEL', essais),
        /lettre P révélée en vert doit rester en position 1/,
    );
});

test('refuse de supprimer une lettre jaune en mode difficile', () => {
    const essais = [{
        lettres: ['P', 'A', 'R', 'I', 'S'],
        resultats: ['gris', 'jaune', 'gris', 'gris', 'gris'],
    }];

    assert.match(
        verifierModeDifficile('BRUME', essais),
        /lettre A révélée en jaune/,
    );
});

test('conserve le nombre maximal requis pour une lettre double', () => {
    const essais = [{
        lettres: ['P', 'A', 'P', 'A', 'S'],
        resultats: ['gris', 'jaune', 'gris', 'jaune', 'gris'],
    }];

    assert.equal(verifierModeDifficile('AARON', essais), null);
    assert.match(
        verifierModeDifficile('ALOES', essais),
        /au moins 2 fois/,
    );
});
