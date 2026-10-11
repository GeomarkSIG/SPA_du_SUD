/* Données du site SPA du Sud – à éditer ici sans toucher au reste du code.
   ⚠ Les profils d'animaux et de personnes ci-dessous sont des EXEMPLES illustratifs :
   remplacez-les par les vrais (photo : champ "photo": "img/nom.jpg"). */

window.SITE = {
  nom: "SPA du Sud",
  adresse: "199 chemin Charette, 97410 Saint-Pierre, La Réunion",
  tel: "02 62 25 98 17",
  telFourriere: "02 62 35 25 58",
  numeroVertCaptures: "0800 501 501",
  email: "spa.dusud@gmail.com",
  facebook: "https://www.facebook.com/Spadusud/",
  helloasso: "https://www.helloasso.com/associations/spa-du-sud-reunion",
  coord: [-21.3246, 55.4370]
};

/* Chiffres du centre animalier de Saint-Pierre (source : CIVIS, page « Le Centre Animalier ») */
window.FLUX = [
  { an: 2018, entrees: 1389, restitues: 147, refuge: 398, adoptes: 389 },
  { an: 2019, entrees: 1152, restitues: 130, refuge: 493, adoptes: 707 },
  { an: 2020, entrees: 1089, restitues: 137, refuge: 529, adoptes: 596 },
  { an: 2021, entrees: 1226, restitues: 123, refuge: 501, adoptes: 421 },
  { an: 2022, entrees: 1194, restitues: 119, refuge: 318, adoptes: 320 }
];

/* Animaux (EXEMPLES) – size: S/M/L ; energy: 1 calme … 3 sportif */
window.ANIMAUX = [
  { id: "d1", nom: "Biscuit", espece: "chien", sexe: "M", age: "3 ans", taille: "M", energie: 3, enfants: true, chats: false, c1: "#d9a566", c2: "#8a5a2b",
    traits: ["Joueur", "Câlin", "Sociable"], histoire: "Ramassé errant près de la ravine. Adore les balades en bord de mer et rapporte tout ce qu'on lui lance. Besoin d'un jardin clos." },
  { id: "d2", nom: "Moka", espece: "chien", sexe: "F", age: "6 ans", taille: "L", energie: 1, enfants: true, chats: true, c1: "#7b5a43", c2: "#3e2a1d",
    traits: ["Calme", "Patiente", "Douce"], histoire: "Une grande dame tranquille, parfaite pour une famille posée ou une personne âgée. S'entend avec tout le monde." },
  { id: "d3", nom: "Pitaya", espece: "chien", sexe: "F", age: "1 an", taille: "S", energie: 2, enfants: true, chats: true, c1: "#f1d7a8", c2: "#c98c4e",
    traits: ["Curieuse", "Câline", "Timide au début"], histoire: "Petite boule de poils encore un peu craintive. Elle s'épanouit en quelques jours dès qu'on lui laisse du temps." },
  { id: "d4", nom: "Zeus", espece: "chien", sexe: "M", age: "4 ans", taille: "L", energie: 3, enfants: false, chats: false, c1: "#2f2f33", c2: "#111",
    traits: ["Énergique", "Fidèle", "Intelligent"], histoire: "Un chien sportif qui a besoin d'un maître expérimenté et de beaucoup d'activité. Très attaché une fois en confiance." },
  { id: "d5", nom: "Cacahuète", espece: "chien", sexe: "M", age: "9 ans", taille: "S", energie: 1, enfants: true, chats: true, c1: "#cfa27a", c2: "#8c6641",
    traits: ["Senior", "Tendre", "Dormeur"], histoire: "Retraité au grand cœur qui rêve d'un canapé et de câlins. Les seniors se font souvent oublier : donnez-lui sa chance !" },
  { id: "d6", nom: "Rocky", espece: "chien", sexe: "M", age: "2 ans", taille: "M", energie: 2, enfants: true, chats: false, c1: "#9aa0a6", c2: "#4a4e54",
    traits: ["Joyeux", "Gourmand", "Obéissant"], histoire: "Apprend vite, adore les friandises. Excellent candidat pour une première adoption avec un peu d'éducation positive." },
  { id: "c1", nom: "Mimi", espece: "chat", sexe: "F", age: "2 ans", taille: "S", energie: 2, enfants: true, chats: true, c1: "#e9e2d6", c2: "#b9ab94",
    traits: ["Affectueuse", "Joueuse", "Bavarde"], histoire: "Elle ronronne dès qu'on s'approche et suit les bénévoles partout dans la chatterie." },
  { id: "c2", nom: "Tigre", espece: "chat", sexe: "M", age: "5 ans", taille: "M", energie: 2, enfants: true, chats: false, c1: "#d89b5c", c2: "#8a5524",
    traits: ["Indépendant", "Chasseur", "Câlin le soir"], histoire: "Un chat tigré d'extérieur, idéal avec jardin. Préfère être le seul chat de la maison." },
  { id: "c3", nom: "Noiraude", espece: "chat", sexe: "F", age: "7 ans", taille: "M", energie: 1, enfants: false, chats: true, c1: "#2a2a2e", c2: "#0e0e10",
    traits: ["Calme", "Sage", "Réservée"], histoire: "Les chats noirs sont adoptés moins vite… à tort ! Elle sera une compagne discrète et fidèle." },
  { id: "c4", nom: "Choupette", espece: "chat", sexe: "F", age: "4 mois", taille: "S", energie: 3, enfants: true, chats: true, c1: "#f4efe6", c2: "#d4c3a2",
    traits: ["Chaton", "Fofolle", "Câline"], histoire: "Un chaton plein d'énergie, à adopter de préférence avec un copain ou une copine." },
  { id: "c5", nom: "Gus", espece: "chat", sexe: "M", age: "3 ans", taille: "L", energie: 1, enfants: true, chats: true, c1: "#b8bcc4", c2: "#6d7380",
    traits: ["Gros nounours", "Paisible", "Gourmand"], histoire: "Un gros matou gris qui adore les genoux. Parfait en appartement." },
  { id: "c6", nom: "Pimprenelle", espece: "chat", sexe: "F", age: "1 an", taille: "S", energie: 3, enfants: true, chats: true, c1: "#e3a45f", c2: "#f4efe6",
    traits: ["Curieuse", "Aventurière", "Joueuse"], histoire: "Grimpe partout et adore les jouets à plumes. Elle a besoin d'un foyer vivant." }
];

/* Équipe (EXEMPLES de postes – remplacer par les vrais noms et photos) */
window.EQUIPE = {
  ca: { titre: "Conseil d'administration", noms: ["Membres élus (à compléter)"] },
  direction: [
    { role: "Présidente", nom: "À compléter", desc: "Représente l'association, pilote la stratégie et les relations avec la CIVIS et les mairies.", c: "#e4572e" },
    { role: "Gérante du refuge", nom: "À compléter", desc: "Organise le quotidien du refuge « Chance », les plannings et le suivi des adoptions.", c: "#e4572e" }
  ],
  salaries: [
    { role: "Soigneur·se animalier", nom: "À compléter", desc: "Nourrissage, soins, hygiène des box, surveillance de la santé des pensionnaires.", c: "#17a398" },
    { role: "Soigneur·se animalier", nom: "À compléter", desc: "Sorties, socialisation, comportement des chiens.", c: "#17a398" },
    { role: "Chatterie & quarantaine", nom: "À compléter", desc: "Responsable de la chatterie (jusqu'à 45 chats et chatons).", c: "#17a398" },
    { role: "Accueil & adoptions", nom: "À compléter", desc: "Reçoit les familles, instruit les dossiers d'adoption, suit les stérilisations.", c: "#17a398" },
    { role: "Toilettage", nom: "À compléter", desc: "Salle de toilettage du refuge : soins du poil, griffes, bien-être.", c: "#17a398" }
  ],
  benevoles: [
    { role: "Promenades", n: "Équipe balades", desc: "Sorties quotidiennes des chiens, du refuge vers le littoral." },
    { role: "Bricolage", n: "Équipe travaux", desc: "Réparations, aménagements, enrichissement des box." },
    { role: "Entretien des box", n: "Équipe propreté", desc: "Nettoyage, désinfection, litières." },
    { role: "Toilettage", n: "Équipe beauté", desc: "Brossage et soins en renfort du toiletteur." },
    { role: "Câlinothérapie", n: "Équipe câlins", desc: "Moments de présence auprès des timides et des seniors." },
    { role: "Communication", n: "Équipe réseaux", desc: "Photos, vidéos, rédaction, évènements, collectes." }
  ]
};

/* Missions de bénévolat */
window.MISSIONS = [
  { id: "balade", ico: "walk", titre: "Balades", duree: "1 h – 2 h", desc: "Promenez un chien du refuge, en bord de mer. Idéal pour dépenser son énergie et le socialiser.", besoin: "Très demandé" , niveau: 3 },
  { id: "bricolage", ico: "hammer", titre: "Bricolage au refuge", duree: "½ journée", desc: "Peinture, réparation de grillages, niches, parcs de jeux, jeux d'enrichissement.", besoin: "Mains bienvenues", niveau: 2 },
  { id: "box", ico: "sparkles", titre: "Nettoyage des box", duree: "2 h", desc: "Nettoyage, désinfection, renouvellement des litières et gamelles.", besoin: "Besoin permanent", niveau: 3 },
  { id: "toilettage", ico: "scissors", titre: "Toilettage", duree: "2 h", desc: "Brossage, bain, démêlage : un animal propre est un animal adopté plus vite.", besoin: "Quelques créneaux", niveau: 1 },
  { id: "calin", ico: "hug", titre: "Câlinothérapie", duree: "1 h", desc: "Passez du temps avec les chats et chiens timides ou seniors : caresses, voix douce, jeux calmes.", besoin: "Besoin régulier", niveau: 2 },
  { id: "com", ico: "megaphone", titre: "Présence & communication", duree: "Flexible", desc: "Photos, vidéos, réseaux sociaux, stand lors d'évènements, collecte, accueil du public.", besoin: "Compétences recherchées", niveau: 2 }
];

/* Structures de l'île – coordonnées approximatives (géocodage OpenStreetMap), à vérifier avant déplacement */
window.STRUCTURES = [
  { nom: "Refuge « Chance » (SPA du Sud) + Fourrière « Espoir »", type: "both", commune: "Saint-Pierre", zone: "CIVIS",
    adresse: "199 chemin Charette, 97410 Saint-Pierre", tel: "Refuge : 02 62 25 98 17 · Fourrière : 02 62 35 25 58 · Captures : 0800 501 501",
    coord: [-21.3246, 55.4370], info: "Refuge 102 places (66 chiens, 36 chats). Fourrière 113 places (77 chiens, 36 chats), exploitée par la SEMRRE pour la CIVIS." },
  { nom: "Fourrière CASUD", type: "fourriere", commune: "Le Tampon (Bérive)", zone: "CASUD",
    adresse: "Chemin de la Bergerie, Bérive, 97430 Le Tampon", tel: "02 62 27 15 17",
    coord: [-21.31014, 55.53735], info: "Fourrière intercommunale du Sud (d'après le guide préfectoral 2020, à confirmer)." },
  { nom: "Fourrière intercommunale TCO", type: "fourriere", commune: "Saint-Paul (ZA Cambaie)", zone: "TCO",
    adresse: "13 chemin Albertine Desprez, ZA Cambaie, 97460 Saint-Paul", tel: "Numéro vert 0800 605 605 · Standard 02 62 32 12 12",
    coord: [-20.96575, 55.28866], info: "41 chiens et 14 chats. Garde : 8 jours ouvrables si l'animal est identifié, 4 jours sinon ; ensuite euthanasie par un vétérinaire." },
  { nom: "Fourrière CIREST", type: "fourriere", commune: "Saint-André (Grand Canal)", zone: "CIREST",
    adresse: "ZA de Grand Canal, 97440 Saint-André", tel: "02 62 46 06 49",
    coord: [-20.96086, 55.68933], info: "Fourrière intercommunale de l'Est, 49 chiens (guide préfectoral 2020)." },
  { nom: "Fourrière CINOR", type: "fourriere", commune: "Sainte-Marie (Grand Prado)", zone: "CINOR",
    adresse: "Grand Prado, 97438 Sainte-Marie", tel: "À vérifier auprès de la CINOR",
    coord: [-20.90169, 55.52695], info: "Fourrière du Nord. Gestionnaire à vérifier (marché renouvelé depuis 2021)." },
  { nom: "Refuge SPA de la Réunion", type: "refuge", commune: "Sainte-Marie", zone: "CINOR",
    adresse: "112 rue André Lardy, 97438 Sainte-Marie", tel: "02 62 28 98 84 · 06 92 30 86 88",
    coord: [-20.90021, 55.53341], info: "Refuge du Grand Prado, environ 32 chiens (guide préfectoral 2020)." }
];
