import { useState } from 'react'

export default function Pseudoform() {
    const [pseudo, setPseudo] = useState(() => localStorage.getItem('mysteryword-pseudo') || '')
    const [pseudoApplique, setPseudoApplique] = useState(() => localStorage.getItem('mysteryword-pseudo') || '')

    function appliquerPseudo(event) {
        event.preventDefault()

        const pseudoNettoye = pseudo.trim()
        if (!pseudoNettoye) {
            return
        }

        localStorage.setItem('mysteryword-pseudo', pseudoNettoye)
        setPseudo(pseudoNettoye)
        setPseudoApplique(pseudoNettoye)
    }

    return (
            <form onSubmit={appliquerPseudo}>
                <textarea
                    value={pseudoApplique ? `Le pseudo « ${pseudoApplique} » a bien été sélectionné.` : pseudo}
                    onChange={(event) => {
                        setPseudoApplique('')
                        setPseudo(event.target.value)
                    }}
                    placeholder="Entrer un pseudo"
                    maxLength="20"
                />
                <button type="submit">→</button>
            </form>
            {pseudoApplique && (
                <p className="pseudo-saved">
                    Pseudo enregistré : <strong>{pseudoApplique}</strong>
                </p>
            )}
    )
    
}