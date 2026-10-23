const TOUCHES = [
    ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
    ['W', 'X', 'C', 'V', 'B', 'N'],
];

const PRIORITE_RESULTATS = {
    gris: 0,
    jaune: 1,
    vert: 2,
};

export default function Clavier({
    essais,
    saisirLettre,
    effacerLettre,
    desactive,
}) {
    const etatsLettres = essais.reduce((etats, essai) => {
        essai.lettres.forEach((lettre, index) => {
            const resultat = essai.resultats[index];
            const resultatActuel = etats[lettre];

            if (!resultatActuel || PRIORITE_RESULTATS[resultat] > PRIORITE_RESULTATS[resultatActuel]) {
                etats[lettre] = resultat;
            }
        });

        return etats;
    }, {});

    return (
        <div className="clavier" aria-label="Clavier de jeu">
            {TOUCHES.map((ligne, index) => (
                <div className="ligne-clavier" key={index}>
                    {ligne.map((lettre) => (
                        <button
                            className={`touche ${etatsLettres[lettre] ?? ''}`}
                            type="button"
                            key={lettre}
                            onClick={() => saisirLettre(lettre)}
                            disabled={desactive}
                        >
                            {lettre}
                        </button>
                    ))}
                </div>
            ))}
            <div className="ligne-clavier">
                <button type="button" onClick={effacerLettre} disabled={desactive}>
                    Effacer
                </button>
                <button type="submit" disabled={desactive}>
                    Valider
                </button>
            </div>
        </div>
    );
}