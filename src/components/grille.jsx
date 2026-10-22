import FinPartie from './FinPartie.jsx';
import useWordle from '../hooks/useWordle.js';

const NOMBRE_DE_LIGNES = 6;
const LONGUEUR_DU_MOT = 5;
const MOTS_SECRETS = [
    "abord", "acier", "aider", "aimer", "ailes", "amour", "ancre", "angle", "avant", "avion",
    "balai", "balle", "bande", "barbe", "barre", "bidon", "blanc", "blond", "boire", "bonne",
    "botte", "boule", "brise", "bruit", "brume", "bulle", "buste", "cadre", "câble", "calme",
    "canal", "carte", "casse", "cause", "chair", "champ", "chant", "chats", "chaud", "chefs",
    "chien", "choix", "chose", "cible", "civil", "clair", "clefs", "coeur", "corps", "cours",
    "crise", "cycle", "danse", "dents", "doigt", "doute", "drame", "droit", "durer", "effet",
    "email", "ennui", "entre", "envie", "essai", "exact", "fable", "faire", "faute", "femme",
    "ferme", "fiche", "fleur", "foire", "force", "forme", "foule", "frais", "franc", "froid",
    "fruit", "fumer", "futur", "gagne", "galop", "garde", "genou", "genre", "glace", "gorge",
    "grâce", "grand", "grave", "grise", "guide", "herbe", "heure", "hiver", "homme", "huile",
    "image", "jambe", "jaune", "jeune", "jouer", "jours", "juste", "laine", "lacet", "lames",
    "large", "larme", "lever", "liens", "ligne", "livre", "local", "loger", "lourd", "loups",
    "lueur", "lundi", "lutte", "magie", "maire", "marge", "masse", "match", "mener", "merci",
    "mieux", "moins", "monde", "monte", "motif", "moule", "neige", "niche", "noble", "noces",
    "notes", "nuage", "nuits", "objet", "ombre", "ordre", "outil", "ouest", "ouvre", "ovale",
    "pages", "paire", "panne", "parce", "parti", "passe", "patte", "pause", "payer", "peine",
    "petit", "piano", "pieds", "piste", "place", "plage", "plein", "pluie", "plume", "poche",
    "poids", "point", "poire", "poser", "poste", "pouce", "poule", "prise", "proie", "puits",
    "quand", "queue", "radio", "rayon", "reine", "repas", "reste", "rouge", "route", "ruban",
    "sable", "saint", "salle", "salon", "sauce", "savon", "scène", "selon", "serre", "seuil",
    "signe", "singe", "sirop", "soeur", "soins", "sorte", "souci", "soupe", "sourd", "sucre",
    "sujet", "super", "table", "tâche", "talon", "tapis", "tarte", "tasse", "temps", "tenir",
    "terme", "terre", "texte", "tigre", "titre", "toile", "tombe", "total", "tours", "train",
    "trait", "trois", "trous", "tuile", "union", "usage", "usine", "utile", "vague", "valse",
    "vaste", "veine", "vente", "verbe", "verre", "vider", "vieux", "ville", "vingt", "vitre",
    "vivre", "voile", "voler", "volet", "votre", "vrais", "zones", "zeste", "yacht", "album",
    "adieu", "agent", "ainsi", "aigle", "alors", "appel", "arbre", "aussi", "autre", "avril",
    "bague", "beaux", "bijou", "bocal", "canne", "chute", "clown", "colle", "comme", "copie",
    "coupe", "court", "crier", "croix", "dalle", "dette", "devis", "dites", "écran", "gamin",
    "gants", "givre", "golfe", "gomme", "grain", "habit", "jeudi", "jolie", "jouet", "laver"
];

export default function Grille() {
    const {
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
        validerProposition,
    } = useWordle(MOTS_SECRETS, LONGUEUR_DU_MOT);

    return (
        <form className="grille-form" onSubmit={validerProposition} onClick={activerSaisie}>
            <input
                ref={saisieRef}
                className="saisie-grille"
                type="text"
                value={proposition.join('')}
                maxLength={LONGUEUR_DU_MOT}
                onChange={saisirProposition}
                disabled={verificationEnCours || Boolean(resultatPartie)}
                aria-label="Votre proposition de cinq lettres"
                aria-busy={verificationEnCours}
                autoComplete="off"
                autoFocus
            />
            {verificationEnCours && <p className="message-verification" role="status">Vérification du mot…</p>}
            {propositionRefusee && (
                <p className="message-refus" role="alert">
                    « {propositionRefusee} » n&apos;est pas reconnu comme mot français. Cet essai ne compte pas.
                </p>
            )}
            {avertissementApi && <p className="message-avertissement" role="status">{avertissementApi}</p>}
            <div className="grille">
                {Array.from({ length: NOMBRE_DE_LIGNES }, (_, ligne) =>
                    Array.from({ length: LONGUEUR_DU_MOT }, (_, colonne) => {
                        const essai = essais[ligne];
                        const ligneActive = ligne === essais.length;
                        const lettre = essai?.lettres[colonne]
                            ?? (ligne === essais.length && propositionRefusee ? propositionRefusee[colonne] : undefined)
                            ?? (ligneActive ? proposition[colonne] : '');
                        const resultat = essai?.resultats[colonne] ?? '';

                        return (
                            <div className={`case ${propositionRefusee && ligneActive ? 'refusee' : (ligneActive ? '' : resultat)}`} key={`${ligne}-${colonne}`}>
                                {lettre}
                            </div>
                        );
                    }),
                )}
            </div>
            {resultatPartie && (
                <FinPartie
                    resultatPartie={resultatPartie}
                    motSecret={motSecret}
                    onRejouer={relancerPartie}
                />
            )}
        </form>
    );
}
