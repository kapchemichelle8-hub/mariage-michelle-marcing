# Michelle & Marcing — invitation de mariage

Invitation numérique du mariage civil, religieux et traditionnel de **Michelle et Marcing**,
le **samedi 26 décembre 2026 à Bandjoun (Cameroun)**.

React 19 · TypeScript · Tailwind 4 · tRPC · Drizzle ORM · MySQL/MariaDB · Express.

## Ce que contient le site

| Page | Rôle |
| --- | --- |
| `/` | Invitation : hero, portraits en cœurs, compte à rebours, histoire, programme, vidéo, dons, livre d’or, RSVP |
| `/billet/:code` | Billet personnel seul (PNG, PDF, impression, retour à l’invitation) |
| `/merci` | Message après une réponse d’absence |
| `/jour-j` | Simulation du jour J (confettis), séparée de la page publique |
| `/espace-maries` | Espace privé protégé par mot de passe (statistiques, réponses, export CSV, suppression ciblée) |

Programme officiel : **13 h 00 mairie**, **15 h 00 messe d’action de grâce**, **20 h 00 soirée**.
Tous les textes, horaires, lieux et numéros se modifient dans `client/src/weddingConfig.ts`.

## Publication avec Manus

Ce dépôt suit la structure des projets web Manus (point d'entrée `server/_core/index.ts`,
scripts `dev`, `build`, `start` et `db:push`).

1. Importez ce dépôt dans un projet Manus (ou donnez à Manus l'accès au dépôt).
2. Dans les **Secrets** du projet, ajoutez `ADMIN_PASSWORD` (mot de passe de l'Espace Mariés).
   `DATABASE_URL` et `JWT_SECRET` sont fournis par Manus.
3. Créez la table `rsvps` avec `pnpm db:push` (migration versionnée, sans remise à zéro).
4. Publiez.

## Installation locale

```bash
pnpm install
cp .env.example .env      # remplir DATABASE_URL, ADMIN_PASSWORD et SESSION_SECRET
pnpm db:push              # crée la table rsvps
pnpm dev                  # http://localhost:3000
```

Production : `pnpm build` puis `pnpm start`.

## Protection des réponses et des mots doux

- Aucune suppression globale n’existe dans le code. Seule une ligne précise peut être supprimée, par son identifiant exact, depuis l’Espace Mariés et après confirmation.
- Un test automatique (`server/dataSafety.test.ts`) échoue si `DELETE FROM rsvps`, `TRUNCATE` ou `DROP TABLE rsvps` apparaît dans le projet.
- Les tests unitaires utilisent une base en mémoire et ne touchent jamais la vraie base.

Avant toute modification de la base :

```bash
pnpm backup    # exporte rsvps en JSON + CSV horodatés dans backups/ et affiche lignes, noms, statuts et messages
```

Après la modification, refaire un `pnpm backup`, puis comparer :

```bash
pnpm tsx scripts/compare-backups.ts backups/<avant>.json backups/<après>.json
```

Test d’intégration facultatif sur une vraie base (insère une ligne « TEST » puis supprime uniquement celle-ci) :

```bash
RSVP_INTEGRATION_DB=mysql://... pnpm test
```

## Espace Mariés

- Le mot de passe est demandé à chaque accès.
- La session vit uniquement en mémoire : elle se verrouille à la déconnexion, en quittant l’espace privé, au rechargement ou à la fermeture de l’onglet, et expire après 2 h.
- Les essais de mot de passe sont limités (8 par quart d’heure et par adresse).
- Aucune statistique n’est exposée sur la page publique.

## Vérifications

```bash
pnpm check   # TypeScript
pnpm build
pnpm test
```

## Médias

Les images sont en WebP dans `client/public/media/` (photo principale en 720 et 1200 px, portraits 520 px).
La vidéo a été recadrée en vertical (404×720, 1,8 Mo) et ne se charge qu’après un appui sur « Lecture ».
Les polices (Cormorant Garamond, Great Vibes, Jost, licence OFL) sont hébergées avec le site dans `client/public/fonts/`.
