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
        window.dispatchEvent(new Event('pseudo-change'))
        setPseudo(pseudoNettoye)
        setPseudoApplique(pseudoNettoye)
    }

    return (
        <div>
            <form onSubmit={appliquerPseudo}>
                <textarea
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
        </div>
    )
    
}