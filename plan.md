# Plan — Réinscription par code et plan de table privé

## Décision et périmètre

La décision A est approuvée : migrer le roster et les affectations utiles dans la base privée de l’application, puis retirer le droit de lecture « toute personne disposant du lien » du classeur original. Le dépôt GitHub source reste inchangé. Le classeur contient aussi des informations de budget/paiement; elles ne seront jamais copiées dans le site.

Classeur source : [Planification_Dote_Michelle_Marcing_2026](https://docs.google.com/spreadsheets/d/1YbJ-ezfIv4g23J1J4T3rcD4YmP525Ce2kpKhDEGXq10/edit), onglets `👥 Invités Michelle`, `👥 Invités Marcing` et `🪑 Plan de table`.

Les deux onglets d’invités comptent 83 lignes numérotées côté Michelle et 135 côté Marcing, avec une numérotation unique et continue dans chacun. Les codes suivront cet ordre : `MM001`–`MM083`, puis `MM084`–`MM218`. Toutes les 218 lignes nommées recevront un code. Les cases de statut « Invité(e) » et « Confirmé(e) » resteront intactes. Les affectations de table sont présentes sur 198 lignes et vides sur 20.

Le plan séparé comporte 217 affectations nom/table renseignées sur 20 numéros de table. Les 198 lignes courantes déjà affectées ont une correspondance exacte; les 20 lignes sans affectation n’en ont aucune et resteront non attribuées dans le nouveau système. L’audit des 24 anciens RSVP ne trouvait que 3 correspondances de table uniques, 0 ambiguë et 21 sans correspondance exacte. Un snapshot privé des 217 affectations historiques permettra donc à un ancien billet de charger une table seulement si le nom exact normalisé mène à une table unique; aucun rapprochement partiel ne sera conservé.

La base gérée contenait 25 réponses avant la réinitialisation autorisée, dont 24 anciennes réponses et 17 mots doux. Les réponses ont été supprimées après archivage transactionnel des mots doux dans `legacy_guestbook_messages`; les 218 invitations, leurs tables et le plan historique restent privés et inchangés. Les messages historiques continuent d’être affichés, sans limite qui puisse les faire disparaître derrière de nouveaux messages.

## Architecture d’implémentation

Le classeur recevra, en colonne J de chaque liste, l’en-tête « Code invité » et les codes dans l’ordre numéroté; aucune autre cellule ne sera écrite. L’import ponctuel lira les onglets des invités et du plan, mais ne copiera ni téléphone, ni notes, ni budget, ni paiements. Il créera dans MySQL les tables privées des invitations, des 20 tables, du snapshot historique et des nouveaux messages; les codes et affectations viendront de la ligne source de chaque invité. La migration SQL sera additive et versionnée, et le serveur ne modifiera plus le schéma automatiquement au démarrage. Le plan du site n’appellera plus le CSV public.

Le formulaire demandera d’abord un code `MM###`; sa vérification en lecture seule renverra uniquement l’état reconnu, le côté et la table éventuelle, sans dévoiler le nom d’un tiers. Après vérification, l’invité saisira son nom complet ou son nom de famille à afficher; il ne servira jamais à identifier ou placer la personne. Le côté et la table viennent de la ligne associée au code. Un code déjà utilisé est refusé avec une erreur et ne peut plus créer de seconde réponse. Chaque nouveau mot doux est inséré séparément, y compris s’il est identique à un précédent, et ne remplace aucune valeur historique. Sur réinitialisation autorisée, les RSVP sont supprimés après archivage des messages historiques dans une table dédiée.

Les 45 couples validés par les mariés (32 détections automatiques, 10 paires vertes validées manuellement et 3 paires orange validées; la paire orange `MM210`/`MM211` reste individuelle) sont reliés de façon symétrique dans la base privée. Pour un code de couple, le formulaire autorise une confirmation pour une ou deux personnes. Une confirmation pour deux personnes consomme le droit du couple et bloque immédiatement le code partenaire; une confirmation individuelle ne bloque pas le code partenaire. Cette consommation est inscrite durablement sur les deux codes et survit à une suppression administrative du RSVP. Le serveur vérifie que le lien est réellement symétrique, puis verrouille les deux codes dans une transaction : il est impossible de contourner la règle ou de confirmer deux fois un même couple en envoyant deux formulaires simultanés.

L’administration cherchera dans les 218 invitations par code ou nom et attribuera une des 20 tables aux invitations non placées. Les 17 mots doux historiques sont conservés dans l’archive privée et restent visibles dans le livre d’or, tandis que les réponses RSVP ont été réinitialisées sur autorisation. Le billet public ne présente plus le bloc « Votre table », mais porte un QR compact `MMQR1` contenant le billet et la table afin que l’équipe d’accueil puisse scanner sans réseau. Les placements restent réservés aux outils privés d’administration et d’accueil. La route publique renvoie uniquement les données nécessaires à ce billet, est limitée en débit et refuse les lignes historiques sans code d’invitation. Selon l’option A approuvée, les anciens billets numériques ne sont plus consultables publiquement. Le code d’invitation reste privé et aucun exemple séquentiel n’est affiché sur la page publique.

Le roster de réception reste utilisable hors connexion dans l’onglet préparé, mais son cache et son état de déverrouillage seront limités à `sessionStorage`, supprimés au verrouillage et à la fermeture de l’onglet, avec verrouillage automatique après 15 minutes d’inactivité. Le QR autonome permet de retrouver la table même sans roster; les anciens QR URL restent pris en charge par la copie locale. Le scan demande l’autorisation caméra, sélectionne en priorité la caméra arrière et conserve la saisie manuelle comme secours. L’espace mariés utilise un mot de passe configuré séparément et un cookie de rôle réservé à l’administration; l’équipe d’accueil utilise un autre mot de passe et un cookie distinct qui ne peut pas ouvrir l’administration. Les deux accès ont chacun une limitation de 5 tentatives par client sur 15 minutes, et les tentatives RSVP/billet restent limitées en mémoire. La signature technique des cookies utilise `MANUS_JWT_SECRET`, injectée et gérée par la plateforme, et non partagée avec les utilisateurs; le serveur échoue si cette clé technique est absente et n’emploie aucun fallback prévisible. Express fait confiance à un seul saut d’ingress afin que la limitation s’appuie sur l’IP client plutôt que sur l’adresse partagée de la passerelle.

L’application sera déployée et vérifiée sur la base privée avant le retrait de la permission `anyone:reader`. Les droits nominativement accordés aux collaborateurs du classeur seront conservés. La colonne des codes sera écrite seulement après restriction du classeur afin de ne pas exposer temporairement les nouveaux codes.

L’espace mariés comprend également un petit panneau « Horaires du programme » protégé par la session administrateur. Il permet de modifier séparément l’heure du mariage civil, de la bénédiction nuptiale et de la soirée avec des champs horaires simples. Les valeurs sont persistées dans une table dédiée, validées côté serveur et réutilisées par le programme public, le formulaire RSVP et le billet numérique; les horaires par défaut restent disponibles si la base est momentanément indisponible.

Le contrôle de consommation couple est conditionné à l’existence d’un lien partenaire valide. Une invitation individuelle ne peut donc pas être refusée à cause d’un ancien marqueur de consommation couple résiduel. Une clé de nom normalisée nullable et unique pour les RSVP par code, complétée par une vérification transactionnelle, empêche qu’un même nom d’affichage soit utilisé sur plusieurs invitations; les anciennes lignes historiques et les doublons déjà présents ne sont pas supprimés automatiquement.

Pour l’équipe d’accueil, le QR imprimé sur un nouveau billet utilise un format compact `MMQR1` contenant le jeton du billet et l’affectation de table. Le téléphone peut ainsi afficher la table sans réseau; les anciens QR URL continuent de fonctionner lorsque le roster a été préparé en ligne. Après scan, l’écran reste volontairement court: « Table trouvée », puis le nom de table, avec un emplacement réservé au futur plan 2D.

## Style et interaction

Réutiliser l’identité existante du mariage : fond ivoire, brun profond, accents or mat, typographies déjà installées et ton chaleureux. Le formulaire reste progressif : saisir le code privé, confirmer la reconnaissance, puis répondre. Le style et les autres sections du site restent inchangés.

## Structure du projet

- `client/src/components/RsvpFormSection.tsx` : saisie et vérification du code, puis réponse sans rapprochement par nom.
- `client/src/components/GuestbookSection.tsx` : afficher les 17 anciens mots doux et les nouveaux, sans écrasement ni suppression silencieuse.
- `client/src/pages/PlanPage.tsx`, `TicketPage.tsx` et `ReceptionPage.tsx` : billets via jeton aléatoire, tables, et contrôle d’entrée privé avec cache hors ligne de session.
- `client/src/pages/AdminPage.tsx` : recherche des invitations, attribution privée des tables et séparation historique/nouveau.
- `server/routers.ts` et `server/invitationCodes.ts` : procédures publiques à réponse minimale, codes exacts, limites d’essais RSVP/billet et connexion admin; procédures privées d’administration.
- `server/db.ts`, `drizzle/schema.ts`, `drizzle/*.sql` : stockage, requêtes et migrations additives.
- `server/seatPlan.ts` : compatibilité historique par correspondance exacte non ambiguë, sans lecture du CSV public ni rapprochement flou.
- Import ponctuel hors du code livré : lire les cellules avec `gws`, écrire MySQL et le classeur, et n’afficher que les totaux.

## Contraintes

Le MySQL géré est partagé entre développement et production; toute écriture de test y toucherait. Aucun RSVP fictif ne sera envoyé. `MM001` sera contrôlé uniquement par la lecture du code et de sa table. Le visuel 2D des tables reste hors de ce lot jusqu’à réception du plan 2D réel.
