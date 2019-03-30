# Trios

Trios est un jeu de chiffres dans lequel il faut aligner des jetons sur un plateau et dont la somme de trois jetons doit toujours être égale à 15.

## Règles
TBD

## But du projet

Réaliser une solution permettant de jouer une partie à distance.

## Organisation

Afin de réaliser rapidement un MVP nous allons nous concentrer sur les fonctionalités de indispensable et les améliorer et compléter avec d'autres par la suite.  
Les fonctionnalités indispensables sont:  
* Créer une partie
  * Créer un joueur
  * Lister les joueurs connectés
  * Proposer une partie à un joueur connecté
  * L'autre joueur accepte ou refuse la proposition 
* Jouer une partie (à découper)
* Conclure une partie (à découper)

## Technique

Front: Application Angular. Utiliser la commande `npm install -g @angular/cli` puis `ng serve` depuis le dossier `trios-front` pour la lancer en local.  
Server: Application Node. Utiliser la commande `node index.js` depuis le dossier `server` pour le lancer.  
Database: La base de donnée et créée sous forme de fichier avec le serveur.  
