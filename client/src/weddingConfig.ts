/**
 * Toutes les informations du mariage sont ici : pour changer un texte, une heure
 * ou un lieu, il suffit de modifier ce fichier.
 */

export const wedding = {
  bride: "Michelle",
  groom: "Marcing",
  title: "Mariage civil, religieux & traditionnel",
  dateLabel: "Samedi 26 décembre 2026",
  shortDate: "26 · 12 · 2026",
  // Heure du Cameroun (UTC+1) : début de la cérémonie civile.
  dateISO: "2026-12-26T13:00:00+01:00",
  city: "Bandjoun",
  country: "Cameroun",
  rsvpDeadline: "1er décembre 2026",
  itinerary:
    "Depuis le Centre climatique de Bandjoun, prenez une moto et dites : « Mission protestante de Nlem ». La maison est juste à côté.",
};

export type ScheduleStep = {
  time: string;
  title: string;
  place: string;
  text: string;
  mapQuery: string;
};

/** Programme officiel : trois rendez-vous, heures de début uniquement. */
export const schedule: ScheduleStep[] = [
  {
    time: "13 h 00",
    title: "Mairie — cérémonie civile",
    place: "Mairie de Pète-Bandjoun, Bandjoun",
    text: "Échange des consentements devant l’officier d’état civil, entourés de nos familles et de nos témoins.",
    mapQuery: "Mairie de Pète-Bandjoun, Bandjoun, Cameroun",
  },
  {
    time: "15 h 00",
    title: "Église — messe d’action de grâce",
    place: "Mission protestante de Nlem, Bandjoun",
    text: "Nous nous retrouverons dans la prière et l’action de grâce pour confier notre union à Dieu.",
    mapQuery: "Mission protestante de Nlem, Bandjoun, Cameroun",
  },
  {
    time: "20 h 00",
    title: "Soirée — célébration et réception",
    place: "Domicile familial à Nlem, à côté de la Mission protestante, Bandjoun",
    text: "La soirée se poursuivra en famille et entre amis dans une atmosphère chaleureuse, joyeuse et traditionnelle.",
    mapQuery: "Mission protestante de Nlem, Bandjoun, Cameroun",
  },
];

export const gifts = {
  beneficiary: "Kapche Michelle",
  numbers: ["688 91 52 96", "651 97 48 89"],
};

export const media = {
  hero: { small: "/media/hero-720.webp", large: "/media/hero-1200.webp", width: 1200, height: 1600 },
  michelle: "/media/michelle.webp",
  marcing: "/media/marcing.webp",
  soiree: { small: "/media/soiree-800.webp", large: "/media/soiree-1400.webp" },
  table: "/media/table.webp",
  video: "/manus-storage/video-couple_2b1f467e.mp4",
  videoPoster: "/media/video-poster.webp",
};

/**
 * Textes de l'histoire d'amour, écrits à la première personne.
 * À personnaliser librement par Michelle et Marcing.
 */
export const story = {
  michelle:
    "Avec Marcing, j’ai trouvé la paix d’un cœur qui écoute et la joie d’un rire qui ne s’éteint pas. Il est mon ami, mon confident, et bientôt mon mari. Je dis oui avec toute la confiance du monde.",
  marcing:
    "Michelle a cette douceur qui apaise et cette force qui relève. À ses côtés, chaque jour a plus de sens. Je veux construire avec elle une maison pleine de foi, de rires et de portes ouvertes.",
  quote: "« L’amour est patient, il est plein de bonté. » — 1 Corinthiens 13, 4",
  together:
    "Notre histoire s’est écrite pas à pas, dans les petits gestes du quotidien, les longues conversations et la prière. Aujourd’hui, avec la bénédiction de nos familles, nous avons choisi de faire de ce chemin une promesse. Et cette promesse, nous voulons la faire devant vous, à Bandjoun, là où tout prend racine.",
};
