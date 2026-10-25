# MysteryWord

Les propositions sont vérifiées auprès de l’API du Wiktionnaire français avant d’être colorées. Une proposition absente d’une entrée française est refusée et ne consomme pas d’essai. La vérification est désactivée pendant la requête afin d’éviter les doubles validations.

## Listes de mots

La partie libre propose des mots solutions de 5, 6 ou 7 lettres. Ces listes ont été constituées manuellement à partir de vocabulaire français courant, puis relues pour vérifier la longueur et l'absence de doublons. Elles sont volontairement embarquées dans `src/utils/difficultes.js` afin que le jeu reste disponible sans téléchargement d'une base externe. Les propositions du joueur continuent d'être contrôlées par le Wiktionnaire.

La longueur choisie et le mode difficile sont conservés dans le navigateur. La longueur est également intégrée à l'URL de la partie, par exemple `/jeu/6?mode=difficile`.

Si l’API est indisponible ou dépasse cinq secondes, l’essai est accepté
exceptionnellement et un avertissement est affiché. Ce choix évite de bloquer
la partie tout en informant clairement le joueur que la vérification n’a pas pu être réalisée. En fin de partie, le mot secret accentué est lié à sa page du Wiktionnaire.


## Nouveautés depuis le passage à l'oral

Depuis notre passage à l'oral, nous avons ajouté et amélioré les fonctionnalités
suivantes :

### Expérience de jeu

- Les lettres se retournent une par une lors de la validation d'un mot.
- Une ligne tremble lorsqu'une proposition est refusée.
- Le joueur peut choisir sa difficulté :
  - partie libre en 5, 6 ou 7 lettres ;
  - mode difficile avec des contraintes supplémentaires.
- En mode difficile, une lettre révélée en vert doit rester à la même position
  et toute lettre révélée en jaune doit être réutilisée dans les propositions
  suivantes.
- Les propositions qui ne respectent pas ces règles sont refusées avec un
  message explicite.
- La grille et le nombre d'essais s'adaptent automatiquement à la longueur du
  mot.
- Les scores prennent en compte la difficulté :
  - multiplicateur ×1,5 pour les mots de 6 lettres ;
  - multiplicateur ×2 pour les mots de 7 lettres ;
  - multiplicateur ×1,5 en mode difficile.
- La longueur choisie et le mode difficile sont conservés entre deux visites.
- La longueur du mot est intégrée à l'adresse de la partie.

### Mot du jour

- Un mode « mot du jour » est disponible en complément de la partie libre.
- Le même mot est proposé à tous les joueurs, sur tous les ordinateurs.
- Le mot change automatiquement à minuit.
- Une partie du jour reprend là où elle s'était arrêtée après un rechargement
  de la page.
- Une partie du jour terminée ne peut pas être rejouée.
- Un compte à rebours indique le temps restant avant le prochain mot.

### Classements et partage

- Le tableau des scores distingue le classement du mot du jour du classement
  général.
- Le classement du mot du jour regroupe les joueurs de l'ordinateur pour le
  mot en cours et les classe par points, puis par temps de résolution.
- Le classement général peut être filtré selon la longueur du mot et le mode de
  jeu.
- Chaque score affiche la longueur du mot et le mode utilisé.
- Le résultat d'une partie peut être copié dans le presse-papiers sous forme
  d'une grille colorée, sans révéler les lettres jouées.

### Déploiement et qualité

- L'application est déployée sur Vercel à partir du dépôt Git.
- Chaque envoi sur la branche principale déclenche automatiquement une nouvelle
  mise en ligne.
- Toutes les adresses de l'application fonctionnent en ligne, y compris après
  un rechargement ou lors de l'ouverture directe d'un lien vers une partie ou
  vers le tableau des scores.
- Au moins cinq tests automatisés ont été ajoutés, dont au moins deux vérifient
  la coloration correcte des lettres en double.
