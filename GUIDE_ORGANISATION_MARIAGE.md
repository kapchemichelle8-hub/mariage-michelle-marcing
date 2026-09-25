# Présentation du Dispositif Web & Organisationnel de la Dote — Michelle & Marcing

Le présent document expose l'architecture complète du site web d'invitation et du système de gestion des réponses conçu pour la dote et l'union traditionnelle de **Michelle & Marcing**, prévue le **26 décembre 2026 à Bafoussam, Cameroun**. Ce dispositif allie l'élégance visuelle d'un faire-part digital de prestige à la rigueur technique d'un outil de pilotage pour les mariés.

---

## 1. Adresses d'Accès au Service

Le service est accessible en ligne aux adresses suivantes :

| Destination | Rôle et Public | Adresse Web |
| :--- | :--- | :--- |
| **Site Public d'Invitation** | Accueil des invités, compte à rebours, programme, vidéo, livre d'or et formulaire RSVP | [Page d'accueil du mariage](https://3000-ig9cle9d30k1ihph822wl-d08e6d11.us1.manus.computer/) |
| **Billet Électronique Personnel** | Exemple d'accès digital officiel délivré après confirmation | [Exemple de billet en ligne](https://3000-ig9cle9d30k1ihph822wl-d08e6d11.us1.manus.computer/billet/MM-LNGBJ3) |
| **Espace Organisation & Réponses** | Suivi du décompte des personnes, tableau filtrable et export Excel | [Tableau de bord organisateur](https://3000-ig9cle9d30k1ihph822wl-d08e6d11.us1.manus.computer/admin) |

---

## 2. Conception Artistique et Respect des Visuels

L'univers graphique a été intégralement repensé par rapport au projet initial sur Canva. Il adopte une palette lumineuse et noble combinant l'or satiné, l'ivoire chaleureux et des touches sable, rappelant le prestige des mariages traditionnels bamilékés. Les typographies d'apparat *Cinzel* et *Great Vibes* sont associées à *Plus Jakarta Sans* pour garantir une lisibilité optimale sur les téléphones mobiles de tous les convives.

Conformément à la consigne de préservation des visages, les photos authentiques fournies dans le dossier partagé (le couple dans leur tenue de cérémonie, ainsi que les portraits de Michelle et de Marcing) ont été intégrées sans aucune altération de leurs traits. De plus, la vidéo originale avec son lecteur interactif a été intégrée pour apporter un dynamisme émotionnel avant le formulaire de confirmation.

---

## 3. Déroulement du Programme & Nouvelles Illustrations

Les visuels provisoires de la section *« Quand & Où ? »* ont été remplacés par des illustrations photographiques soignées et fidèles à l'atmosphère de l'événement :

| Horaire | Moment Célébré | Lieu | Illustration associée |
| :--- | :--- | :--- | :--- |
| **18h00** | Assise des familles & déballage des présents | Maison familiale, Bafoussam | Cérémonie des présents et symboles traditionnels de la dote |
| **22h00** | Union des deux cœurs selon la Tradition | Bafoussam, Cameroun | Alliance des mains scellée selon les coutumes ancestrales |
| **23h00** | Célébration & ouverture du grand buffet | Chez les parents du marié | Table de banquet festive éclairée à la bougie |

Une vue panoramique des collines verdoyantes de Bafoussam vient chapeauter l'ensemble pour situer avec fierté le cadre de la cérémonie.

---

## 4. Compte à Rebours Festif & Explosion de Confettis

Le compte à rebours calcule les jours, heures, minutes et secondes restantes jusqu'au 26 décembre 2026 à 18h00. Lorsqu'il arrive à son terme, il déclenche automatiquement une animation de confettis dorés et festifs, tout en dévoilant la photo du couple et un message annonçant que le grand jour est arrivé.

Un bouton discret de démonstration intitulé **« Déclencher l'explosion »** a été mis à disposition sur la page pour permettre aux mariés de visualiser immédiatement l'effet final sans attendre le jour J.

---

## 5. Gestion des Confirmations (RSVP) & Billet Électronique

Chaque invité peut confirmer sa venue ou signaler son absence avant le **1er décembre 2026**. En cas de présence, l'invité indique le nombre exact d'accompagnants et peut adresser une bénédiction qui s'affiche aussitôt sur le Livre d'Or public du site.

Dès la validation, le système génère instantanément un **Billet Électronique d'Accès Officiel** doté :
- D'un identifiant unique (par exemple `MM-LNGBJ3`) et d'un QR code stylisé ;
- De la mention d'accueil : *« Nous sommes infiniment heureux de vous compter parmi nous ! »* ;
- Des informations pratiques de date, d'heure et de lieu ;
- D'options directes pour imprimer le billet au format PDF ou copier le lien personnel de partage.

---

## 6. Pilotage des Réponses et Décompte des Invités

Le tableau de bord disponible à l'adresse `/admin` consolide l'ensemble des données dans une base de données relationnelle MySQL :
- **Décompte cumulé des convives** : additionne l'ensemble des personnes déclarées pour dimensionner le service traiteur et les places assises ;
- **Recherche et filtres instantanés** : permet de retrouver un invité par son nom ou son code de billet ;
- **Exportation Excel / CSV** : télécharge en un clic la liste complète pour la remettre aux organisateurs et aux équipes chargées de l'accueil.
