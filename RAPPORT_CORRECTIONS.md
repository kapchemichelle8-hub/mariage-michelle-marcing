# Rapport des corrections — Michelle & Marcing

1. Sécurité Espace Mariés :
- Suppression des sessions persistantes résiduelles et rotation du cookie (`wedding_admin_session_v2`).
- Obligation stricte de saisir le mot de passe partagé dès le premier accès.
- Déconnexion et verrouillage immédiats à la sortie de la page (`pagehide` + `unmount`).

2. Simulation du Jour J :
- Déclenchement automatique des confettis et de la carte des mariés dès l'arrivée sur `/simulation`, sans second clic nécessaire.

3. Envoi & Billet Officiel :
- Moteur PDF serveur prêt via `pdf-lib` pour l'envoi de pièces jointes.
- Téléchargement direct immédiat en image PNG (galerie téléphone) et en PDF natif depuis le navigateur.
- Base des réponses réinitialisée à zéro.
