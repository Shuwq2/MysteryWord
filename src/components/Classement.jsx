import { useState } from 'react';
import { recupererClassement, recupererClassementQuotidien } from '../utils/classement.js';
import { obtenirJourUniversel } from '../utils/wordle.js';

export default function Classement() {
    const [classement] = useState(recupererClassement);
    const [classementQuotidien] = useState(() => recupererClassementQuotidien(obtenirJourUniversel()));

    function afficherDate(date) {
        if (!date) {
            return '—';
        }

        const dateFormatee = new Date(date);
        if (Number.isNaN(dateFormatee.getTime())) {
            return '—';
        }

        return new Intl.DateTimeFormat('fr-FR', {
            dateStyle: 'short',
        }).format(dateFormatee);
    }

    return (
        <section className="classement" aria-labelledby="titre-classement">
            <h2 id="titre-classement">Classement du mot du jour</h2>
            {classementQuotidien.length === 0 ? (
                <p>Aucun score pour le moment.</p>
            ) : (
                <div className="tableau-classement">
                    <table>
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Pseudo</th>
                                <th scope="col">Mot</th>
                                <th scope="col">Essais</th>
                                <th scope="col">Points</th>
                                <th scope="col">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classementQuotidien.map((partie, index) => (
                                <tr key={`${partie.date}-${index}`}>
                                    <td>{index + 1}</td>
                                    <td>{partie.pseudo}</td>
                                    <td>{partie.mot}</td>
                                    <td>{partie.essais}</td>
                                    <td>{partie.score}</td>
                                    <td>{afficherDate(partie.date)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <h2>Classement général</h2>
            {classement.length === 0 ? <p>Aucun score pour le moment.</p> : (
                <ol className="liste-classement-general">
                    {classement.map((partie, index) => (
                        <li key={`${partie.date}-general-${index}`}>
                            <strong>{partie.pseudo}</strong> — {partie.score} points ({partie.mode})
                        </li>
                    ))}
                </ol>
            )}
        </section>
    );
}
