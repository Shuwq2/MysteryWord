import { useState } from 'react';
import { recupererToutesLesParties } from '../utils/classement.js';

export default function Classement() {
    const [classement] = useState(recupererToutesLesParties);
    const [longueur, setLongueur] = useState('toutes');
    const [mode, setMode] = useState('tous');
    const classementFiltre = classement.filter((partie) => (
        (longueur === 'toutes' || partie.longueur === Number(longueur))
        && (mode === 'tous' || partie.mode === mode)
    )).slice(0, 10);

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
            <h2 id="titre-classement">Classement</h2>
            <div className="filtres-classement">
                <label>
                    Longueur
                    <select value={longueur} onChange={(event) => setLongueur(event.target.value)}>
                        <option value="toutes">Toutes</option>
                        <option value="5">5 lettres</option>
                        <option value="6">6 lettres</option>
                        <option value="7">7 lettres</option>
                    </select>
                </label>
                <label>
                    Mode
                    <select value={mode} onChange={(event) => setMode(event.target.value)}>
                        <option value="tous">Tous</option>
                        <option value="libre">Partie libre</option>
                        <option value="difficile">Difficile</option>
                    </select>
                </label>
            </div>
            {classementFiltre.length === 0 ? (
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
                                <th scope="col">Longueur</th>
                                <th scope="col">Mode</th>
                                <th scope="col">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classementFiltre.map((partie, index) => (
                                <tr key={`${partie.date}-${index}`}>
                                    <td>{index + 1}</td>
                                    <td>{partie.pseudo}</td>
                                    <td>{partie.mot}</td>
                                    <td>{partie.essais}</td>
                                    <td>{partie.score}</td>
                                    <td>{partie.longueur}</td>
                                    <td>{partie.mode === 'difficile' ? 'Difficile' : 'Libre'}</td>
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
