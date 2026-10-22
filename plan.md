# Plan — Réinscription par code et plan de table privé

## Décision et périmètre

La décision A est approuvée : migrer le roster et les affectations utiles dans la base privée de l’application, puis retirer le droit de lecture « toute personne disposant du lien » du classeur original. Le dépôt GitHub source reste inchangé. Le classeur contient aussi des informations de budget/paiement; elles ne seront jamais copiées dans le site.

Classeur source : [Planification_Dote_Michelle_Marcing_2026](https://docs.google.com/spreadsheets/d/1YbJ-ezfIv4g23J1J4T3rcD4YmP525Ce2kpKhDEGXq10/edit), onglets `👥 Invités Michelle`, `👥 Invités Marcing` et `🪑 Plan de table`.

Les deux onglets d’invités comptent 83 lignes numérotées côté Michelle et 135 côté Marcing, avec une numérotation unique et continue dans chacun. Les codes suivront cet ordre : `MM001`–`MM083`, puis `MM084`–`MM218`. Toutes les 218 lignes nommées recevront un code. Les cases de statut « Invité(e) » et « Confirmé(e) » resteront intactes. Les affectations de table sont présentes sur 198 lignes et vides sur 20.

Le plan séparé comporte 217 affectations nom/table renseignées sur 20 numéros de table. Les 198 lignes courantes déjà affectées ont une correspondance exacte; les 20 lignes sans affectation n’en ont aucune et resteront non attribuées dans le nouveau système. L’audit des 24 anciens RSVP ne trouvait que 3 correspondances de table uniques, 0 ambiguë et 21 sans correspondance exacte. Un snapshot privé des 217 affectations historiques permettra donc à un ancien billet de charger une table seulement si le nom exact normalisé mène à une table unique; aucun rapprochement partiel ne sera conservé.

La base gérée contient 24 anciennes réponses (21 présences, 3 refus), dont 17 mots doux. Les anciens RSVP seront laissés inchangés avec `invitationId = NULL`; une colonne nullable, des tables privées d’invitations et de placements, et une table append-only pour les nouveaux mots doux rendront les nouvelles données distinctes. Les messages historiques continueront d’être affichés, sans limite qui puisse les faire disparaître derrière de nouveaux messages.

## Architecture d’implémentation

Le classeur recevra, en colonne J de chaque liste, l’en-tête « Code invité » et les codes dans l’ordre numéroté; aucune autre cellule ne sera écrite. L’import ponctuel lira les onglets des invités et du plan, mais ne copiera ni téléphone, ni notes, ni budget, ni paiements. Il créera dans MySQL les tables privées des invitations, des 20 tables, du snapshot historique et des nouveaux messages; les codes et affectations viendront de la ligne source de chaque invité. La migration SQL sera additive et versionnée. Le plan du site n’appellera plus le CSV public.

Le formulaire demandera d’abord un code `MM###`; sa vérification en lecture seule renverra uniquement l’état reconnu, le côté et la table éventuelle, sans dévoiler le nom d’un tiers. Après vérification, l’invité saisira librement le nom à afficher; il ne servira jamais à identifier ou placer la personne. Le côté et la table viennent de la ligne associée au code. Une nouvelle réponse avec le même code met à jour l’unique RSVP courant au lieu d’en créer un deuxième. Chaque nouveau mot doux est enregistré séparément et ne remplace aucune valeur historique.

L’administration distinguera les anciennes réponses des réponses par code, conservera les 24 anciennes lignes et leurs messages visibles, cherchera dans les 218 invitations par code ou nom, et attribuera une des 20 tables aux invitations non placées. Le billet et son QR résolvent la table de l’invitation associée; le QR utilise un jeton aléatoire de 192 bits distinct du code séquentiel `MM###`. La route publique renvoie uniquement les données nécessaires à ce billet, est limitée en débit et refuse les lignes historiques sans code d’invitation. Selon l’option A approuvée, les anciens billets numériques ne sont plus consultables publiquement; leurs RSVP et mots doux restent conservés dans l’administration et le livre d’or. Le code d’invitation séquentiel reste transférable et ne constitue pas un secret impossible à partager.

Le roster de réception reste utilisable hors connexion dans l’onglet préparé, mais son cache et son état de déverrouillage seront limités à `sessionStorage`, supprimés au verrouillage et à la fermeture de l’onglet, avec verrouillage automatique après 15 minutes d’inactivité. Les tentatives de connexion administrateur seront limitées à 5 par client sur 15 minutes; les tentatives d’accès RSVP et billet resteront limitées en mémoire. En production, le serveur exige `ADMIN_PASSWORD` et un `JWT_SECRET` d’au moins 32 caractères sans fallback prévisible; Express fait confiance à un seul saut d’ingress afin que la limitation s’appuie sur l’IP client plutôt que sur l’adresse partagée de la passerelle.

L’application sera déployée et vérifiée sur la base privée avant le retrait de la permission `anyone:reader`. Les droits nominativement accordés aux collaborateurs du classeur seront conservés. La colonne des codes sera écrite seulement après restriction du classeur afin de ne pas exposer temporairement les nouveaux codes.

## Style et interaction

Réutiliser l’identité existante du mariage : fond ivoire, brun profond, accents or mat, typographies déjà installées et ton chaleureux. Le formulaire devient progressif : saisir `MM001`, confirmer la reconnaissance, puis répondre. Le style et les autres sections du site restent inchangés.

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
