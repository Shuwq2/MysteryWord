export const LONGUEURS_DISPONIBLES = [5, 6, 7];
export const LONGUEUR_PAR_DEFAUT = 5;
export const MODE_PAR_DEFAUT = 'libre';
export const CLE_REGLAGES = 'mysteryword-reglages';

export const MOTS_SECRETS = {
    5: [
        'abord', 'acier', 'aider', 'aimer', 'ailes', 'amour', 'ancre', 'angle', 'avant', 'avion',
        'balai', 'balle', 'bande', 'barbe', 'barre', 'bidon', 'blanc', 'blond', 'boire', 'bonne',
        'botte', 'boule', 'brise', 'bruit', 'brume', 'bulle', 'buste', 'cadre', 'cable', 'calme',
        'canal', 'carte', 'casse', 'cause', 'chair', 'champ', 'chant', 'chats', 'chaud', 'chefs',
        'chien', 'choix', 'chose', 'cible', 'civil', 'clair', 'clefs', 'coeur', 'corps', 'cours',
        'crise', 'cycle', 'danse', 'dents', 'doigt', 'doute', 'drame', 'droit', 'durer', 'effet',
        'email', 'ennui', 'entre', 'envie', 'essai', 'exact', 'fable', 'faire', 'faute', 'femme',
        'ferme', 'fiche', 'fleur', 'foire', 'force', 'forme', 'foule', 'frais', 'franc', 'froid',
        'fruit', 'fumer', 'futur', 'gagne', 'galop', 'garde', 'genou', 'genre', 'glace', 'gorge',
        'grand', 'grave', 'grise', 'guide', 'herbe', 'heure', 'hiver', 'homme', 'huile', 'image',
        'jambe', 'jaune', 'jeune', 'jouer', 'jours', 'juste', 'laine', 'lacet', 'lames', 'large',
        'larme', 'lever', 'liens', 'ligne', 'livre', 'local', 'loger', 'lourd', 'loups', 'lueur',
    ],
    6: [
        'accord', 'adulte', 'agence', 'alpage', 'amical', 'amorce', 'animal',
        'arcade', 'armure', 'avenir', 'aviron', 'banane', 'barque', 'beurre', 'bijoux', 'bocage',
        'bougie', 'cabane', 'cabine', 'cactus', 'canard', 'carton', 'cerise', 'chemin', 'cheval',
        'cloche', 'combat', 'corail', 'course', 'crayon', 'danser', 'dehors', 'demain',
        'desert', 'dessin', 'devant', 'dormir', 'douane', 'eglise', 'empire', 'enfant', 'enorme',
        'espoir', 'etoile', 'examen', 'fraise', 'garage', 'gouter', 'grande', 'jardin',
        'legume', 'maison', 'marche', 'marque', 'metier', 'minute', 'moment', 'nuance',
        'oiseau', 'orange', 'papier', 'parfum', 'passer', 'patate', 'paysan', 'plante',
        'poivre', 'police', 'potion', 'poulet', 'prince', 'quatre', 'rester',
        'saison', 'salade', 'savane', 'secret', 'soleil', 'source', 'temple', 'tomate', 'valise',
    ],
    7: [
        'adresse', 'affiche', 'agrafes', 'amandes', 'amicale', 'amusera', 'animaux', 'annonce',
        'araigne', 'ardoise', 'armoire', 'avancer',         'bagages', 'bateaux', 'bavarde',
        'bonjour', 'bonbons', 'cascade', 'cerises', 'chanson',
        'chateau', 'chemins', 'chemise', 'cheveux', 'chiffre', 'ciseaux', 'clavier', 'climate',
        'courage', 'cravate', 'cuisine', 'danseur', 'decider', 'demande', 'dessert',
        'disques', 'ecouter', 'elegant', 'energie', 'environ', 'etoiles', 'exemple', 'famille',
        'fenetre', 'figures', 'flammes', 'fortune', 'fromage', 'galerie',
        'guitare', 'habiter', 'horloge', 'joueurs',
        'langage', 'lecture', 'liberte', 'limaces', 'magique', 'maillot', 'manches', 'mariner',
        'matelas', 'message', 'moteurs', 'musique', 'navires', 'obtenir', 'oiselet', 'paniers',
        'parfois', 'partage', 'passage', 'peindre', 'pendant', 'piments', 'plaisir', 'poisson',
        'pouvoir', 'prendre', 'proches', 'racines', 'recette', 'reponse', 'rougeur', 'semaine',
        'silence', 'sourire',
        'tableau', 'trouver', 'vacance', 'valeurs', 'village', 'voyager',
    ],
};

export function lireReglages() {
    try {
        const reglages = JSON.parse(localStorage.getItem(CLE_REGLAGES) || '{}');
        const longueur = LONGUEURS_DISPONIBLES.includes(Number(reglages.longueur))
            ? Number(reglages.longueur)
            : LONGUEUR_PAR_DEFAUT;
        return { longueur, mode: reglages.mode === 'difficile' ? 'difficile' : MODE_PAR_DEFAUT };
    } catch {
        return { longueur: LONGUEUR_PAR_DEFAUT, mode: MODE_PAR_DEFAUT };
    }
}

export function enregistrerReglages(reglages) {
    localStorage.setItem(CLE_REGLAGES, JSON.stringify(reglages));
}

export function normaliserConfiguration(longueur, mode) {
    const longueurValidee = LONGUEURS_DISPONIBLES.includes(Number(longueur))
        ? Number(longueur)
        : LONGUEUR_PAR_DEFAUT;
    return {
        longueur: longueurValidee,
        mode: mode === 'difficile' ? 'difficile' : MODE_PAR_DEFAUT,
    };
}
