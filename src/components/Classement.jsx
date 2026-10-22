import { useState } from 'react';
import { recupererClassement } from '../utils/classement.js';

export default function Classement() {
    const [classement] = useState(recupererClassement);

    return (
        <section className="classement" aria-labelledby="titre-classement">
            <h2 id="titre-classement">Classement</h2>
            {classement.length === 0 ? (
                <p>Aucun score pour le moment.</p>
            ) : (
                <ol>
                    {classement.map((joueur, index) => (
                        <li key={`${joueur.pseudo}-${index}`}>
                            <span>{joueur.pseudo}</span>
                            <strong>{joueur.score} points</strong>
                        </li>
                    ))}
                </ol>
            )}
        </section>
    );
}
