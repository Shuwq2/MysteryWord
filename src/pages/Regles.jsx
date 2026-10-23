import { Link } from 'react-router-dom';
import './Regles.css';

const EXEMPLE = [
    { lettre: 'M', couleur: 'vert', description: 'Bien placée' },
    { lettre: 'A', couleur: 'jaune', description: 'Dans le mot, mal placée' },
    { lettre: 'R', couleur: 'gris', description: 'Absente du mot' },
];

export default function Regles() {
    return (
        <main className="regles">
            <h1>Règles du jeu</h1>
            <p className="regles-introduction">
                Trouvez le mot mystère français en cinq lettres en six essais maximum.
            </p>

            <section className="regles-section" aria-labelledby="fonctionnement">
                <h2 id="fonctionnement">Comment jouer ?</h2>
                <ol>
                    <li>Entrez un mot français de cinq lettres.</li>
                    <li>Validez votre proposition avec le clavier.</li>
                    <li>Utilisez les couleurs pour trouver le mot mystère.</li>
                </ol>
            </section>

            <section className="regles-section" aria-labelledby="exemple">
                <h2 id="exemple">Exemple</h2>
                <div className="exemple-regles" aria-label="Exemple des trois couleurs">
                    {EXEMPLE.map(({ lettre, couleur }) => (
                        <div className={`case-exemple ${couleur}`} key={couleur}>
                            {lettre}
                        </div>
                    ))}
                </div>
                <ul className="legende-couleurs">
                    {EXEMPLE.map(({ lettre, couleur, description }) => (
                        <li key={couleur}>
                            <span className={`pastille-couleur ${couleur}`} aria-hidden="true" />
                            <strong>{lettre} en {couleur}</strong> : {description}.
                        </li>
                    ))}
                </ul>
            </section>

            <Link className="lien-regles" to="/">
                Retour au menu
            </Link>
        </main>
    );
}
