# Prompt complet de refonte — site Michelle & Marcing

> Ce prompt est prêt à être copié dans une nouvelle tâche de développement. Il doit être exécuté en respectant strictement les règles de protection des données ci-dessous.

---

## Rôle

Tu es un développeur senior spécialisé en React, TypeScript, tRPC, Drizzle/MySQL, UX mobile et sites d’invitation haut de gamme. Tu travailles sur le projet WebDev existant **mariage-michelle-marcing — Michelle & Marcing**.

Tu dois améliorer le site sans perdre les données déjà enregistrées. Le résultat doit être élégant, humain, vivant, rapide sur mobile et cohérent avec les couleurs ivoire, crème, brun profond et or doux déjà utilisées.

---

## Contexte du site

Le site est une invitation numérique pour le mariage de **Michelle et Marcing**, le **26 décembre 2026 à Bandjoun, Cameroun**.

Le site comporte déjà :

- un hero plein écran avec photo du couple ;
- des colombes et un cœur ;
- deux portraits placés en forme de cœurs ;
- une animation de pétales ;
- un compte à rebours ;
- l’histoire d’amour ;
- la section Quand & Où ;
- une vidéo ;
- une section Dons et cadeaux ;
- un livre d’or ;
- un formulaire RSVP ;
- un billet électronique personnel ;
- un espace privé des mariés avec mot de passe.

Conserve ces éléments comme identité de base. Ne remplace pas le concept par un template générique.

---

## Règle absolue de protection des données

Avant toute modification :

1. lire la structure actuelle du projet ;
2. exporter la table `rsvps` dans un fichier horodaté ;
3. afficher le nombre de lignes, les noms, les statuts et les messages ;
4. ne modifier aucune donnée existante ;
5. ne jamais exécuter `DELETE FROM rsvps` ;
6. ne jamais exécuter de suppression globale de la table ;
7. ne pas réinitialiser la base pour tester ;
8. ne jamais réécrire ou inventer les mots doux existants ;
9. ne tester les nouvelles soumissions qu’avec une ligne clairement identifiée comme test ;
10. supprimer uniquement une ligne de test par son identifiant exact, après confirmation.

Si une sauvegarde complète ne peut pas être créée, **arrête l’implémentation et demande une validation humaine**. Les changements visuels ne doivent pas commencer par une action SQL.

Après modification :

- comparer l’export avant et après ;
- vérifier que le nombre de lignes et les messages existants sont inchangés ;
- exécuter les tests sans nettoyage global ;
- créer un checkpoint seulement après validation.

---

## Programme officiel à afficher

Remplace l’ancien programme par exactement ces trois étapes principales :

### 13 h 00 — Mairie

**Titre :** Mairie — cérémonie civile  
**Lieu :** Mairie de Pète-Bandjoun, Bandjoun  
**Texte :** Échange des consentements devant l’officier d’état civil, entourés de nos familles et de nos témoins.

### 15 h 00 — Église

**Titre :** Église — messe d’action de grâce  
**Lieu :** Mission protestante de Nlem, Bandjoun  
**Texte :** Nous nous retrouverons dans la prière et l’action de grâce pour confier notre union à Dieu.

### 20 h 00 — Soirée

**Titre :** Soirée — célébration et réception  
**Lieu :** Domicile familial à Nlem, à côté de la Mission protestante, Bandjoun  
**Texte :** La soirée se poursuivra en famille et entre amis dans une atmosphère chaleureuse, joyeuse et traditionnelle.

Règles :

- les heures sont des heures de début ;
- ne pas inventer d’heure de fin ;
- ne pas afficher « Pause », « Réjouissances », « Vin d’honneur », « Déplacement » ou d’autres étapes non demandées ;
- utiliser « messe d’action de grâce » et non « célébration eucharistique » ;
- ajouter « Bandjoun » aux informations de localisation ;
- conserver l’itinéraire pratique : « Depuis le Centre climatique de Bandjoun, prenez une moto et dites : Mission protestante de Nlem. La maison est juste à côté. »

---

## Direction artistique : plus vivant, plus humain

Le site doit garder son élégance, mais ne plus ressembler à une page générée automatiquement.

### À conserver

- palette ivoire, crème, brun et or ;
- photo héroïque du couple ;
- portraits en cœurs ;
- colombes et cœur ;
- pétales légers ;
- typographies élégantes ;
- ambiance familiale, romantique et traditionnelle.

### À améliorer

1. Remplacer les blocs trop identiques par une composition plus naturelle et respirante.
2. Ajouter des transitions d’apparition au défilement, courtes et discrètes.
3. Donner aux cartes du programme une légère variation de position et de rythme, sans nuire à la lecture.
4. Ajouter une petite ligne décorative, des séparateurs floraux ou des détails manuscrits entre les grandes sections.
5. Utiliser des textes plus personnels, comme si Michelle et Marcing s’adressaient directement aux invités.
6. Ajouter un micro-effet de profondeur sur les portraits et les photos au survol ou au toucher.
7. Faire apparaître progressivement les mots du livre d’or, sans animation excessive.
8. Créer un bouton RSVP visuellement chaleureux avec un état de chargement clair.
9. Ajouter une animation douce sur les trois étapes du programme lorsque l’invité les atteint en faisant défiler la page.
10. Respecter `prefers-reduced-motion` et désactiver les animations non essentielles si l’utilisateur le demande.

### Ton rédactionnel

Écrire en français correct, naturel, chaleureux et sans fautes. Éviter les expressions trop commerciales ou artificielles. Préférer des phrases comme :

> « Nous serions profondément heureux de vous avoir à nos côtés pour ces trois moments qui comptent tant pour nous. »

Éviter les répétitions de « événement inoubliable », « expérience unique » et les formulations impersonnelles.

---

## Parcours à préserver

### RSVP

Le formulaire doit conserver :

- nom complet ou nom de famille ;
- côté de la famille : mariée ou marié ;
- présence ou absence ;
- nombre de personnes en cas de présence ;
- mot d’amour ou bénédiction.

En cas de présence :

- enregistrer la réponse ;
- rediriger directement vers le billet de l’invité ;
- afficher uniquement le billet sur la page billet ;
- proposer PNG, PDF, impression du billet seul et retour vers l’invitation.

En cas d’absence :

- enregistrer la réponse sans provoquer d’erreur ;
- afficher un message humain et respectueux ;
- rappeler que les mariés partageront la joie de la journée et comptent sur le soutien sous d’autres formes : prière, encouragement ou contribution selon les possibilités ;
- proposer un bouton de retour vers l’invitation.

### Livre d’or

- ne jamais supprimer ni réécrire les messages existants ;
- afficher les trois premiers messages au chargement ;
- ajouter un bouton « Voir plus » ;
- charger ou révéler la suite au clic ;
- conserver un affichage compact sur mobile.

### Espace mariés

- demander le mot de passe dès le premier accès ;
- ne jamais exposer les statistiques sur la page publique ;
- verrouiller la session lors de la sortie ;
- protéger toutes les procédures `stats`, `listRsvps`, suppression et export ;
- demander une confirmation avant toute suppression d’une ligne ;
- ne jamais proposer de bouton « vider toute la base ».

---

## Performance et médias

Les invités peuvent utiliser une connexion mobile lente. Appliquer les règles suivantes :

- conserver les images WebP optimisées ;
- charger la photo hero en priorité ;
- charger les images secondaires avec `loading="lazy"` ;
- ne charger la vidéo qu’après clic ;
- réserver les originaux aux besoins qui l’exigent réellement ;
- éviter de charger deux fois la même image ;
- ne pas ajouter de librairie lourde si une solution CSS simple suffit ;
- vérifier le rendu avec une largeur mobile de 360 à 430 px ;
- conserver des alt text accessibles en français.

---

## Fichiers à examiner en priorité

- `client/src/weddingConfig.ts`
- `client/src/pages/Home.tsx`
- `client/src/components/ScheduleAndDetailsSection.tsx`
- `client/src/components/CountdownSection.tsx`
- `client/src/components/RsvpFormSection.tsx`
- `client/src/components/GuestbookSection.tsx`
- `client/src/components/GiftsSection.tsx`
- `client/src/components/DigitalTicket.tsx`
- `client/src/pages/TicketPage.tsx`
- `client/src/pages/AdminPage.tsx`
- `client/src/index.css`
- `server/routers.ts`
- `server/db.ts`
- `drizzle/schema.ts`
- les tests RSVP et admin.

Ne modifie pas l’infrastructure serveur ou les fichiers cœur sans nécessité.

---

## Tests obligatoires avant livraison

Exécuter :

```bash
pnpm check
pnpm build
pnpm test
```

Puis vérifier manuellement :

1. la page publique sur desktop ;
2. la page publique sur mobile ;
3. le programme avec les horaires 13 h, 15 h et 20 h ;
4. le RSVP positif ;
5. le RSVP négatif ;
6. le billet PNG ;
7. le billet PDF ;
8. l’impression du billet seul ;
9. le retour vers l’invitation ;
10. le livre d’or et son bouton « Voir plus » ;
11. la demande de mot de passe de l’espace mariés ;
12. le verrouillage après sortie de l’espace privé ;
13. l’absence de métriques sur la page publique ;
14. la présence intacte de chaque ancien message avant et après les tests.

---

## Format de compte rendu exigé

À la fin, fournir un compte rendu en français avec :

- les fichiers modifiés ;
- les changements visuels ;
- les changements du programme ;
- les tests réussis ;
- le nombre de lignes RSVP avant et après ;
- la confirmation que les mots doux existants n’ont pas changé ;
- les éventuels points non réalisés ;
- le lien du checkpoint final.

Ne prétends jamais avoir restauré ou conservé une donnée si cela n’a pas été vérifié par une lecture réelle de la base ou par un export comparé.

---

## Résultat attendu

Livrer une invitation numérique plus chaleureuse, plus humaine et plus vivante, avec le programme clair : **mairie à 13 h, église à 15 h, soirée à 20 h**, tout en protégeant absolument les RSVP, les billets et les mots doux déjà enregistrés.
