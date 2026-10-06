# Note de déploiement et état des données

1. Base de données :
- Le schéma MySQL contient la table `rsvps` avec toutes ses colonnes : `id`, `name`, `email`, `attendance`, `side`, `guestsCount`, `message`, `ticketCode`, `createdAt`, `updatedAt`.
- Le contrôle exécuté avant cette mise à jour a confirmé que la table ne contenait pas d'anciennes réponses persistées dans cette instance de base.
- Les tests automatisés ont été modifiés pour ne plus exécuter de `DELETE FROM rsvps;` global : chaque test nettoie uniquement sa propre ligne créée via son identifiant unique afin de préserver intégralement toute confirmation ou mot d'or réel à venir.

2. Programme ajusté :
- Arrêt strict de la chronologie à l'étape : « Début de la cérémonie traditionnelle » (22 h 00). Les mentions de pause et de réjouissances tardives ont été retirées.
- Remplacement du libellé de célébration par « Messe d'action de grâce ».
- Ajout de la mention « Bandjoun » sur chaque étape du programme et sur le billet.

3. Ambiance visuelle :
- Préservation de la palette dorée, ivoire et bordeaux doux.
- Ajout de légères lueurs satinées en arrière-plan, d'un flottement naturel des portraits en cœur et de transitions douces sur les cartes et boutons pour un rendu plus vivant, chaleureux et moins rigide.
