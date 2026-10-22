# MysteryWord

Les propositions sont vérifiées auprès de l’API du Wiktionnaire français avant d’être colorées. Une proposition absente d’une entrée française est refusée et ne consomme pas d’essai. La vérification est désactivée pendant la requête afin d’éviter les doubles validations.

Si l’API est indisponible ou dépasse cinq secondes, l’essai est accepté
exceptionnellement et un avertissement est affiché. Ce choix évite de bloquer
la partie tout en informant clairement le joueur que la vérification n’a pas pu être réalisée. En fin de partie, le mot secret accentué est lié à sa page du Wiktionnaire.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
