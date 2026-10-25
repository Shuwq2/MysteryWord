import { useState } from 'react';
import {
    enregistrerReglages,
    lireReglages,
    LONGUEURS_DISPONIBLES,
} from '../utils/difficultes.js';
export default function DifficulteForm() {
    const [reglages, setReglages] = useState(lireReglages);

    function modifierReglage(event) {
        const prochainReglage = {
            ...reglages,
            [event.target.name]: event.target.name === 'longueur'
                ? Number(event.target.value)
                : event.target.checked ? 'difficile' : 'libre',
        };
        setReglages(prochainReglage);
        enregistrerReglages(prochainReglage);
    }

    return (
        <form className="form-difficulte">
            <label>
                Longueur du mot
                <select name="longueur" value={reglages.longueur} onChange={modifierReglage}>
                    {LONGUEURS_DISPONIBLES.map((longueur) => (
                        <option key={longueur} value={longueur}>{longueur} lettres</option>
                    ))}
                </select>
            </label>
            <label className="choix-difficile">
                <input
                    name="mode"
                    type="checkbox"
                    checked={reglages.mode === 'difficile'}
                    onChange={modifierReglage}
                />
                Mode difficile
            </label>
        </form>
    );
}
