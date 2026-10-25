import FinPartie from './FinPartie.jsx';
import Clavier from './Clavier.jsx';
import useWordle from '../hooks/useWordle.js';
import { MOTS_SECRETS, normaliserConfiguration } from '../utils/difficultes.js';
import { useParams, useSearchParams } from 'react-router-dom';

export default function Grille() {
    const { longueur } = useParams();
    const [parametres] = useSearchParams();
    const configuration = normaliserConfiguration(longueur, parametres.get('mode'));
    const longueurDuMot = configuration.longueur;
    const nombreDeLignes = longueurDuMot + 1;
    const motsSecrets = MOTS_SECRETS[longueurDuMot].filter(
        (mot) => mot.length === longueurDuMot,
    );
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
        saisirLettre,
        effacerLettre,
        validerProposition,
    } = useWordle(motsSecrets, longueurDuMot, configuration.mode);

    return (
        <form className="grille-form" onSubmit={validerProposition} onClick={activerSaisie}>
            <div className="entete-partie">
                <strong>{configuration.mode === 'difficile' ? 'Mode difficile' : 'Partie libre'}</strong>
            </div>
            <input
                ref={saisieRef}
                className="saisie-grille"
                type="text"
                value={proposition.join('')}
                maxLength={longueurDuMot}
                onChange={saisirProposition}
                disabled={verificationEnCours || Boolean(resultatPartie)}
                aria-label={`Votre proposition de ${longueurDuMot} lettres`}
                aria-busy={verificationEnCours}
                autoComplete="off"
                autoFocus
            />
            {verificationEnCours && <p className="message-verification" role="status">Vérification du mot…</p>}
            {propositionRefusee && (
                <p className="message-refus" role="alert">
                    {propositionRefusee?.length === longueurDuMot
                        ? `« ${propositionRefusee} » n'est pas reconnu comme mot français. Cet essai ne compte pas.`
                        : propositionRefusee}
                </p>
            )}
            {avertissementApi && <p className="message-avertissement" role="status">{avertissementApi}</p>}
            <div className="grille">
                {Array.from({ length: nombreDeLignes }, (_, ligne) =>
                    Array.from({ length: longueurDuMot }, (_, colonne) => {
                        const essai = essais[ligne];
                        const ligneActive = ligne === essais.length;
                        const lettre = essai?.lettres[colonne]
                            ?? (ligne === essais.length && propositionRefusee?.length === longueurDuMot
                                ? propositionRefusee[colonne]
                                : undefined)
                            ?? (ligneActive ? proposition[colonne] : '');
                        const resultat = essai?.resultats[colonne] ?? '';
                        const classeAnimation = essai
                            ? 'case-retournee'
                            : (propositionRefusee && ligneActive ? 'ligne-refusee' : '');

                        return (
                            <div
                                className={`case ${propositionRefusee && ligneActive ? 'refusee' : (ligneActive ? '' : resultat)} ${classeAnimation}`}
                                style={essai ? { '--delai-retournement': `${colonne * 140}ms` } : undefined}
                                key={`${ligne}-${colonne}`}
                            >
                                {lettre}
                            </div>
                        );
                    }),
                )}
            </div>
            <Clavier
                essais={essais}
                saisirLettre={saisirLettre}
                effacerLettre={effacerLettre}
                desactive={verificationEnCours || Boolean(resultatPartie)}
            />
            {resultatPartie && (
                <FinPartie
                    resultatPartie={resultatPartie}
                    motSecret={motSecret}
                    longueur={longueurDuMot}
                    mode={configuration.mode}
                    onRejouer={relancerPartie}
                    essais={essais}
                />
            )}
        </form>
    );
}
