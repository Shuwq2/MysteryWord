import { useEffect, useState } from 'react';
import { calculerStatistiques, recupererHistorique } from '../utils/classement.js';

export default function Statistiques() {
    const [pseudo, setPseudo] = useState(() => localStorage.getItem('mysteryword-pseudo')?.trim() || '');
    const [statistiques, setStatistiques] = useState(() => calculerStatistiques(
        recupererHistorique(),
        localStorage.getItem('mysteryword-pseudo')?.trim() || '',
    ));

    useEffect(() => {
        function actualiserStatistiques() {
            const nouveauPseudo = localStorage.getItem('mysteryword-pseudo')?.trim() || '';
            setPseudo(nouveauPseudo);
            setStatistiques(calculerStatistiques(recupererHistorique(), nouveauPseudo));
        }

        window.addEventListener('pseudo-change', actualiserStatistiques);
        return () => window.removeEventListener('pseudo-change', actualiserStatistiques);
    }, []);

    if (!pseudo) {
        return null;
    }

    return (
        <section className="statistiques" aria-labelledby="titre-statistiques">
            <h2 id="titre-statistiques">Statistiques de {pseudo}</h2>
            <div className="resume-statistiques">
                <p><strong>{statistiques.partiesJouees}</strong><span>Parties jouées</span></p>
                <p><strong>{statistiques.pourcentageVictoires}%</strong><span>Victoires</span></p>
                <p><strong>{statistiques.serieEnCours}</strong><span>Série en cours</span></p>
                <p><strong>{statistiques.meilleureSerie}</strong><span>Meilleure série</span></p>
                <p><strong>{statistiques.totalPoints}</strong><span>Total des points</span></p>
            </div>
            <h3>Répartition des victoires</h3>
            <div className="repartition-victoires">
                {statistiques.repartition.map((nombre, index) => (
                    <div className="ligne-repartition" key={index}>
                        <span>{index + 1}</span>
                        <div className="barre-repartition">
                            <div
                                className="remplissage-repartition"
                                style={{ width: `${nombre ? Math.max(nombre * 12, 12) : 0}%` }}
                            >
                                {nombre}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
