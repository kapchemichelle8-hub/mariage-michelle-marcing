# Documentation complète du site de mariage
## Michelle & Marcing — Notre dote & mariage traditionnel

**Version documentée :** 8 octobre 2026  
**Projet :** `mariage-michelle-marcing`  
**Nature :** invitation de mariage publique avec RSVP, billets électroniques, livre d’or et espace privé des mariés  
**Statut de cette documentation :** spécification et état des lieux. Les changements de programme et de design décrits ici ne sont pas appliqués automatiquement dans cette étape.

---

## 1. Objectif du site

Le site sert de faire-part numérique pour la dot et le mariage de **Michelle et Marcing**. Il doit permettre aux invités de :

- découvrir l’histoire et l’univers du couple ;
- consulter la date, les lieux et le déroulé de la journée ;
- voir les photos et la vidéo du couple ;
- confirmer leur présence ou signaler leur indisponibilité ;
- indiquer le nombre de personnes présentes ;
- choisir le côté de la famille auquel ils sont invités ;
- laisser un mot d’amour ou une bénédiction ;
- recevoir un billet électronique personnel après confirmation ;
- télécharger le billet en PNG ou en PDF et l’imprimer seul, sans imprimer tout le site ;
- consulter une section Dons et cadeaux avec les coordonnées de Michelle.

L’espace privé permet aux mariés de consulter les réponses et les compteurs sans exposer ces informations au public.

---

## 2. Identité du mariage

| Élément | Valeur actuelle |
|---|---|
| Mariée | Michelle |
| Marié | Marcing |
| Date | 26 décembre 2026 |
| Ville | Bandjoun, Cameroun |
| Lieu familial indiqué | Mission protestante de Nlem, Bandjoun |
| Itinéraire | Depuis le Centre climatique de Bandjoun, prendre une moto et demander « Mission protestante de Nlem ». La maison est juste à côté. |
| Date limite RSVP | 1er décembre 2026 |
| Titre | Mariage civil, religieux & traditionnel |
| Couleurs | Ivoire, crème, brun profond, or doux |
| Atmosphère | Élégante, chaleureuse, familiale, romantique et traditionnelle |

### Coordonnées Dons et cadeaux

- **Bénéficiaire :** Kapche Michelle
- **Numéros :** 688915296 et 651974889
- **Message de principe :** la présence des invités reste le plus beau cadeau ; une contribution volontaire est accueillie avec gratitude.

---

## 3. Parcours public actuel

### 3.1 En-tête

L’en-tête contient :

- la signature « Michelle & Marcing » ;
- un lien vers « Quand & Où ? » ;
- un bouton « Confirmer ma présence » ;
- un lien discret vers « Espace Mariés ».

### 3.2 Hero principal

Le hero reprend l’esprit de la maquette de référence :

- photo plein écran du couple ;
- voile sombre et chaud pour assurer la lisibilité ;
- symbole de colombes et cœur ;
- texte d’invitation ;
- date et ville ;
- portraits des mariés placés en forme de cœurs à la jonction avec la section suivante ;
- pétales et feuilles qui tombent doucement.

### 3.3 Compte à rebours

Le compte à rebours affiche le temps restant avant le mariage. Une page dédiée de simulation du jour J existe afin que la simulation ne se mélange pas avec la page publique. La simulation doit ouvrir directement l’animation de confettis et proposer un retour clair vers l’invitation.

### 3.4 Histoire d’amour

La section présente :

- Michelle et son portrait ;
- Marcing et son portrait ;
- deux textes personnels ;
- une citation romantique ;
- un récit de leur rencontre et de leur engagement.

### 3.5 Section Quand & Où

La section présente le contexte de Bandjoun, une image paysagère et une frise chronologique. **Cette frise doit être mise à jour selon le nouveau programme de la présente demande**, décrit au chapitre 7.

### 3.6 Vidéo

La vidéo est chargée à la demande : une miniature est affichée d’abord, puis la vidéo est lue lorsque l’invité appuie sur le bouton de lecture. Cela réduit le poids initial sur les connexions mobiles.

### 3.7 Dons et cadeaux

La section explique que la présence est déjà un cadeau et affiche les coordonnées de Kapche Michelle. Elle doit rester sobre, respectueuse et cohérente avec l’esthétique du site.

### 3.8 Livre d’or

Les messages d’amour et bénédictions enregistrés dans la base sont affichés publiquement. L’affichage doit rester compact sur mobile, avec seulement les premiers messages visibles et un bouton « Voir plus » pour dérouler la suite.

### 3.9 RSVP

Le formulaire collecte actuellement :

- nom complet ou nom de famille ;
- côté de la famille : mariée ou marié ;
- présence ou absence ;
- nombre total de participants lorsque la présence est confirmée ;
- mot d’amour ou bénédiction.

En cas de présence, l’invité est redirigé vers son billet personnel. En cas d’indisponibilité, il est redirigé vers une page dédiée avec un message de gratitude et de soutien.

---

## 4. Billet électronique

Chaque confirmation positive reçoit un code unique au format `MM-XXXXXX`.

Le billet doit afficher :

- le nom de l’invité ;
- la date du mariage ;
- Bandjoun ;
- le lieu principal ;
- les informations pratiques ;
- une phrase de bienvenue ;
- le code personnel du billet.

Les actions attendues sont :

1. téléchargement direct en image PNG ;
2. téléchargement en PDF ;
3. impression du billet seul grâce aux règles d’impression dédiées ;
4. lien « Retourner à l’invitation » pour revoir le site complet.

---

## 5. Espace privé des mariés

L’espace privé doit être inaccessible sans mot de passe. Les métriques et la liste des réponses ne doivent jamais apparaître sur la page publique.

Après authentification, les mariés peuvent consulter :

- le nombre de réponses ;
- le nombre de présents ;
- le nombre total de convives ;
- le nombre d’absents ;
- le côté de la famille ;
- les messages ;
- les codes de billet ;
- les dates de réponse ;
- l’export CSV ;
- la suppression ciblée d’une ligne, avec confirmation explicite.

### Règle de verrouillage

La session administrateur doit être invalidée :

- lors d’un clic sur « Se déconnecter » ;
- lors d’un changement de page qui quitte l’espace privé ;
- lors de la fermeture ou du rechargement de l’onglet lorsque cela est techniquement possible ;
- après expiration de la session.

---

## 6. Données et règles de sécurité

La table principale est `rsvps`. Une ligne correspond à une réponse d’invité ou de groupe.

Champs principaux :

- `name` : nom de l’invité ;
- `email` : adresse électronique lorsqu’elle est fournie ;
- `attendance` : `yes` ou `no` ;
- `side` : côté de la mariée ou du marié ;
- `guestsCount` : nombre de participants ;
- `message` : mot doux ou bénédiction ;
- `ticketCode` : code unique ;
- `createdAt` et `updatedAt` : dates de création et de mise à jour.

### Interdictions absolues

- Ne jamais exécuter `DELETE FROM rsvps`.
- Ne jamais vider la base pour tester un formulaire.
- Ne jamais modifier une donnée existante pour simuler un invité.
- Ne jamais appliquer une migration destructive sans sauvegarde et confirmation.
- Ne jamais remplacer des mots doux par du texte inventé.
- Ne jamais utiliser un rollback du code comme s’il s’agissait d’un rollback de la base.

### Méthode de test obligatoire

Tout test doit utiliser une ligne clairement identifiée comme test, puis supprimer uniquement cette ligne à partir de son identifiant ou de son code billet. Avant toute modification de schéma ou de données :

1. exporter la table RSVP ;
2. vérifier le nombre de lignes ;
3. faire la modification ;
4. vérifier à nouveau les lignes et les messages ;
5. conserver un export horodaté.

---

## 7. Nouveau programme demandé

Le programme visible par les invités doit être simplifié et plus clair. Il ne faut plus afficher une longue succession artificielle de pauses, déplacements ou étapes secondaires si elles ne sont pas confirmées.

### Programme à afficher

| Heure | Étape | Lieu à afficher |
|---|---|---|
| **13 h 00** | **Mairie — cérémonie civile** | Mairie de Pète-Bandjoun, Bandjoun |
| **15 h 00** | **Église — cérémonie religieuse** | Mission protestante de Nlem, Bandjoun |
| **20 h 00** | **Soirée — célébration et réception** | Domicile familial à Nlem, à côté de la Mission protestante, Bandjoun |

Les heures sont des heures de début. Ne pas inventer une heure de fin si elle n’a pas été validée.

### Formulations recommandées

- Remplacer « Célébration eucharistique » par **« Messe d’action de grâce »** si cette appellation correspond bien à la cérémonie religieuse souhaitée.
- Utiliser systématiquement **Bandjoun** dans les lieux et les textes pratiques.
- Conserver l’itinéraire : « Depuis le Centre climatique de Bandjoun, prenez une moto et dites : Mission protestante de Nlem. La maison est juste à côté. »
- Ne pas remettre les anciennes étapes « Pause », « Réjouissances » ou « déplacement » comme des événements séparés sans validation.

---

## 8. Refonte pour un site plus vivant et plus humain

Le site doit conserver les couleurs et l’esprit élégant, mais éviter l’impression de modèle automatique.

### Principes visuels

- garder la photo héroïque, les colombes, les portraits en cœur et les pétales ;
- réduire les blocs trop uniformes et les cartes répétitives ;
- introduire davantage de respiration et d’asymétrie ;
- utiliser des phrases personnelles, naturelles et courtes ;
- donner à chaque section une intention émotionnelle distincte ;
- conserver une lisibilité parfaite sur téléphone ;
- éviter les animations permanentes trop rapides ou trop nombreuses.

### Interactions douces

- apparition progressive des sections au défilement ;
- léger mouvement des portraits au passage de la souris ou au toucher ;
- pétales irréguliers mais discrets ;
- surbrillance douce des étapes du programme ;
- bouton RSVP avec retour visuel immédiat ;
- transitions de 150 à 300 ms ;
- respect de `prefers-reduced-motion`.

### Humanisation des textes

Les textes doivent parler comme les mariés, pas comme une brochure générique. Préférer :

> « Nous serions profondément heureux de vous avoir à nos côtés pour ces trois moments qui comptent tant pour nous. »

à une formulation trop impersonnelle comme :

> « Participez à notre événement inoubliable. »

---

## 9. Performance mobile

Les invités peuvent utiliser une connexion mobile lente. Les règles suivantes sont prioritaires :

- conserver les WebP optimisés pour le hero et les portraits ;
- ne pas charger la vidéo avant le clic ;
- utiliser `loading="lazy"` pour les images sous la ligne de flottaison ;
- définir `width` et `height` ou un ratio afin d’éviter les sauts de mise en page ;
- ne pas charger les mêmes images originales et optimisées en même temps ;
- limiter les animations coûteuses ;
- vérifier l’affichage sur petit écran avant publication.

---

## 10. Critères d’acceptation de la prochaine version

La refonte sera considérée comme terminée seulement si :

- le programme affiche exactement 13 h, 15 h et 20 h ;
- aucune ancienne étape non validée n’apparaît ;
- « Bandjoun » figure dans les informations de localisation ;
- le lieu de l’église est présenté comme Mission protestante de Nlem, Bandjoun, si cette information est confirmée ;
- les RSVP et les mots doux déjà présents sont inchangés ;
- aucun `DELETE FROM rsvps` global n’est présent dans le code ou les tests ;
- l’espace mariés demande toujours le mot de passe ;
- le livre d’or affiche les messages existants sans les réécrire ;
- le billet se télécharge et s’imprime seul ;
- le site reste agréable sur mobile ;
- `pnpm check`, `pnpm build` et `pnpm test` passent ;
- un export de sauvegarde de la base est créé avant toute modification ;
- une capture mobile et une capture desktop sont contrôlées avant publication ;
- un checkpoint est créé seulement après validation complète.

---

## 11. Fichiers importants

| Fichier | Rôle |
|---|---|
| `client/src/pages/Home.tsx` | Page publique principale |
| `client/src/weddingConfig.ts` | Données du mariage, lieux, médias et programme |
| `client/src/components/ScheduleAndDetailsSection.tsx` | Histoire, lieux, programme et vidéo |
| `client/src/components/RsvpFormSection.tsx` | Formulaire de confirmation |
| `client/src/components/DigitalTicket.tsx` | Billet et exports PNG/PDF/impression |
| `client/src/pages/AdminPage.tsx` | Espace privé des mariés |
| `server/routers.ts` | Procédures RSVP, billets et authentification admin |
| `server/db.ts` | Accès et requêtes de base de données |
| `drizzle/schema.ts` | Schéma des tables |
| `client/src/index.css` | Thème, animations et impression |

---

## 12. Médias disponibles

Les médias récupérés sont conservés hors du dossier source dans :

`/home/ubuntu/webdev-static-assets/mariage/`

Catégories :

- `images/` : originaux ;
- `optimized/` : versions WebP optimisées ;
- `decor/` : illustrations et décorations ;
- `apercus/` : aperçus ;
- `video/` : vidéo et miniature ;
- `preview/contact-sheet.jpg` : planche contact.

---

## Conclusion

La priorité de la prochaine intervention est double : rendre le site plus personnel et vivant, tout en garantissant que les données RSVP et les mots doux restent strictement protégés. La modification du programme doit être limitée aux trois rendez-vous validés : **mairie à 13 h, église à 15 h et soirée à 20 h**. Toute évolution doit être testée sur une copie ou avec une sauvegarde vérifiée avant publication.
