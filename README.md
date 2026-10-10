# SPA du Sud – Site web (Saint-Pierre, La Réunion)

Site statique (HTML/CSS/JS, aucune compilation) conçu et réalisé par **MAUME Robin – Geomark SIG Solutions**.
Dépôt : https://github.com/GeomarkSIG/SPA_du_SUD

## Lancer
Ouvrir `index.html`, ou : `python -m http.server 8080` puis http://localhost:8080

## Modifier le contenu
Tout est dans `js/data.js` : coordonnées, animaux (champ `photo` pour une vraie image dans `img/`), équipe, missions, structures de l'île.
`js/routes.js` contient les itinéraires piétons (OSM) refuge -> Pointe du Diable / aéroport.

## À compléter avant mise en ligne
- Vrais portraits d'animaux, noms/photos de l'équipe (les profils actuels sont des exemples).
- Directeur de la publication, RNA/SIRET, hébergeur (page Mentions légales).
- Horaires d'ouverture et tarifs d'adoption confirmés par l'association.

## Licences
Code : MIT (`LICENSE`) · Textes : CC BY-NC-SA 4.0 (`LICENSE-CONTENT.md`) · Logo/photos SPA du Sud : tous droits réservés · Cartes © OpenStreetMap (ODbL) · Leaflet (BSD-2).
