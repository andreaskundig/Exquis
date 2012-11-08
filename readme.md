Exquis
======

le projet "Exquis" consiste à afficher sur une page web des cases contenant des animations javascript qui réagissent aux animations voisines. Le dispositif devrait permettre d'assembler sans trop de peine des animations créées par des auteurs différents.

Ce projet est réalisé dans le cadre du [gongfu.io](http://gongfu.io/)


session 12 juillet 2012:
------------------------

exploration de l'api canvas:

2 canvas utilisés pour cette session. 
Le premier, CanvasLeft, génére un motif animé.
Le second, CanvasRight, reçoit les pixels de la première ligne du CanvasLeft, et produit
sa propre représentation avec cette information.


session 19 juillet 2012:
------------------------

modularisation de l'entité animation. 
Exploration des différents patterns de création d'objets.
session à 3 (Olivier en guest star).


session 26 juillet 2012:
------------------------

objectifs: faire fonctionner la page de cases avec le nouvel objet.
introduire un objet "dashboard".

réalisation: 
session à 3 (Thanks Olivier)
simplifier l'objet animation
création d'une grille de 2 x 2 canevas
communication simple des bordures entre les canevas.


session 2 aout 2012:
--------------------

grille de 3 x 3 canevas.

système d'enchaînement d'animations

discussion sécurité du context d'évaluation. (voir solution iframe cf jsfiddle)


session 9 aout 2012:
-------------------

structure de données pour les animations.
généralisation du système de communication des bordures.


session 16 aout 2012:
---------------------

comprendre le très joli bug pour le reproduire délibérement.

pourquoi TR  copie t'il le bord nord au lieu du bord ouest ?


session 23 aout 2012:
---------------------

implémentation du live coding pour la case du milieu.

bug sur la mise à jour de la fonction draw, quand la string est incorrecte.


session 30 aout 2012:
---------------------

correction du bug du 23.
visualisation de la validité du code.
refactor du mécanisme de mise à jour du code évalué.


session 7 septembre 2012:
-------------------------

live coding pour toutes les cellules.

rajouté serveur statique (node.js)


session 13 septembre 2012
-------------------------

session en remote gung-fu (Skype + TeamViewer)
charger les définitions des animations via le serveur (json)


session 20 septembre 2012
-------------------------

annulé


session 27 septembre 2012
-------------------------

(use nodemon to monitor code changes on node app: npm install nodemon -g)

refactor du loading des jsons vers une version async.
création du fichier animation "copieBordSud.json"


session 4 octobre 2012
----------------------

continuer à traduire les animations sous formes de json servies par le serveur
définir un assemblage d'animations sous forme de json sur le serveur.

...
enregistrer les modifications au code d'animations


session 11 octobre 2012
-----------------------

rendre possible l'édition des 9 cases.


session 18 octobre 2012
-----------------------

définir un assemblage d'animations sous forme de json sur le serveur,
et permettre la sauvegarde du code modifié en ligne.


session 25 octobre 2012
-----------------------

permettre la sauvegarde du code modifié en ligne.


session 1 novembre 2012
-----------------------

TODOs:
réorganiser le code.
onRollOver sur les cases on voit les limites des cases.
onClick (sélection) sur une case, apparition des textArea si invisible et surbrillance sur l
case pour indiquer son statut de case sélectionnée.
onClick sur l'extérieur des cases, déactivation de la surbrillance et disparition des text areas.


session 8 novembre 2012
-----------------------

continuer la réorganisation du code

débuger le comportement du rollOver

onClick (sélection) sur une case, apparition des textArea si invisible et surbrillance sur l
case pour indiquer son statut de case sélectionnée.
onClick sur l'extérieur des cases, déactivation de la surbrillance et disparition des text areas.


session 15 novembre 2012
-----------------------

continuer la réorganisation du code

onClick (sélection) sur une case, apparition des textArea si invisible et surbrillance sur l
case pour indiquer son statut de case sélectionnée.
onClick sur l'extérieur des cases, déactivation de la surbrillance et disparition des text areas.

