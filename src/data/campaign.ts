import type { Campaign, Dungeon } from "../types/game";

export const dungeon0: Dungeon = {
  id: 0,
  title: "L'épreuve du clavier",
  concept: "Avant d'écrire du code, il faut savoir écrire précisément.",
  phases: [
    {
      id: "d0-p1",
      type: "NARRATIVE",
      content: `Avant d’entrer,
tu dois prouver une chose.

Sais-tu parler avec un clavier,
symbole par symbole ?

Ici, aucun code.
Seulement des touches.

Cette épreuve se déroule ailleurs.

Lis. Tape. Observe.

Quand tu te sentiras à l'aise, reviens.`,
    },
    {
      id: "d0-p2",
      type: "ACTION",
      content: `🗝️ L'épreuve du Clavier

Ouvre le lieu d’entraînement :

https://www.keybr.com/fr

Objectifs :
- regarder et taper
- accepter l’erreur
- viser la précision, pas la vitesse

Durée recommandée :
10 à 15 minutes`,
      actionKey: "Enter",
      onAction: () => {
        window.open("https://www.keybr.com/fr", "_blank")?.focus();
      },
    },
  ],
};

export const dungeon1: Dungeon = {
  id: 1,
  title: "La première parole",
  concept: "console.log",
  phases: [
    {
      id: "d1-p1",
      type: "NARRATIVE",
      content: `Tu es dans les entrailles de la machine.

Dans cet espace vide,
ta voix n'a pas de son.

Pour laisser une trace,
tu dois l'écrire.

La commande "console.log()" imprime un message dans le journal système.`,
    },
    // The following phases are placeholders until we build the Typing engine
    {
      id: "d1-p2",
      type: "TYPING_CHALLENGE",
      concept: "console.log",
      challenges: [
        "console.log();",
        "console.log(expression);",
        'console.log("hello, world!");',
        'console.log("I <3 JS");',
      ],
    },
    {
      id: "d1-p3",
      type: "BOSS",
      concept: "affiche 'hello, universe!' dans la console",
      initialCode:
        "// Écris ton code JavaScript ici\nconsole.log('hello, world!');",
      expectedOutput: "hello, universe!",
    },
  ],
};

export const dungeon2: Dungeon = {
  id: 2,
  title: "La grotte de l'écho",
  concept: "prompt() et les variables (const, let)",
  phases: [
    {
      id: "d2-p1",
      type: "NARRATIVE",
      content: `Tu t'enfonces dans la grotte de l'écho.

Ici, on ne fait pas que parler dans le vide.
On pose des questions.

La commande "prompt()" permet d'interroger le voyageur.

Pour retenir sa réponse,
on la stocke dans une "constante" (const) ou une "variable" (let).`,
    },
    {
      id: "d2-p2",
      type: "TYPING_CHALLENGE",
      concept: "Variables",
      challenges: [
        "const answer = prompt(question);",
        'const name = prompt("What... is your name?");',
        'const quest = prompt("What... is your quest?");',
        'const colour = prompt("What... is your favorite colour?");',
      ],
    },
    {
      id: "d2-p3",
      type: "BOSS",
      concept: "pose une question",
      initialCode:
        "// Demande son âge au voyageur avec prompt() et stocke-le dans une constante.\n// Affiche ensuite cette constante avec console.log().\n",
    },
  ],
};

export const dungeon3: Dungeon = {
  id: 3,
  title: "Le temple des choix",
  concept: "conditions (if)",
  phases: [
    {
      id: "d3-p1",
      type: "NARRATIVE",
      content: `Le temple se dresse devant toi avec des règles strictes.

Tu ne peux avancer que si tes conditions sont remplies.

Le mot-clé "if" (si) permet d'exécuter du code,
mais uniquement quand une condition est vraie.

Par exemple, vérifier si tu as l'âge requis pour cette aventure.`,
    },
    {
      id: "d3-p2",
      type: "TYPING_CHALLENGE",
      concept: "Conditions",
      challenges: [
        "if () {}",
        "if (condition) { doSomething(); }",
        'if (age < 18) { console.log("too young!"); }',
        'if (age > 18) { console.log("too old!"); }',
      ],
    },
    {
      id: "d3-p3",
      type: "BOSS",
      concept: "le videur du code",
      initialCode:
        "// Crée une variable 'age' à 15.\n// Si l'âge est < 18, affiche \"c'est pas possible\".\n",
      expectedOutput: "c'est pas possible",
    },
  ],
};

export const dungeon4: Dungeon = {
  id: 4,
  title: "La tour du temps",
  concept: "boucles (while)",
  phases: [
    {
      id: "d4-p1",
      type: "NARRATIVE",
      content: `Un escalier s'élève sans fin.
Chaque marche est identique à la précédente.

À quoi bon répéter la même chose 10 fois ?

L'instruction "while" (tant que) permet de répéter un bloc de code.

Attention : si la condition est toujours vraie,
la boucle ne s'arrêtera jamais !`,
    },
    {
      id: "d4-p2",
      type: "TYPING_CHALLENGE",
      concept: "Boucles",
      challenges: [
        "while () {}",
        "while (condition) { repeatSomething(); }",
        "let i = 0; while (i < 10) { console.log(i); i++; }",
        'let answer = "no"; while (answer !== "yes") { answer = prompt("are you sure?"); }',
      ],
    },
    {
      id: "d4-p3",
      type: "BOSS",
      concept: "Compte jusqu'à 10",
      initialCode:
        "// Utilise une boucle while pour afficher de 1 jusqu'à 10.\nlet i = 0;\n",
      expectedOutput: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10",
    },
  ],
};

export const dungeon5: Dungeon = {
  id: 5,
  title: "Le Gardien",
  concept: "Le combat final (variables, boucle)",
  phases: [
    {
      id: "d5-p1",
      type: "NARRATIVE",
      content: `Le sol tremble.
La machine s'éveille.

Elle bloque la sortie.
Elle exige de voir ce que tu as compris :
comment contrôler le temps et les actions.

Montre-lui.`,
    },
    {
      id: "d5-p2",
      type: "BOSS",
      concept: "à toi de jouer",
      mockPromptReturns: ["non", "jamais", "oui"],
      initialCode:
        '// Tant que le Gardien ne répond pas "oui":\n// 1. Demande-lui "tu m\'ouvres ?" via prompt().\n// 2. S\'il répond "non", affiche "sésame".\n// 3. S\'il répond "jamais", affiche "pitié".\n// Après qu\'il ait dit "oui", affiche "j\'entre".\nlet answer = "";\n',
      expectedOutput: "sésame\npitié\nj'entre",
    },
  ],
};

export const dungeon6: Dungeon = {
  id: 6,
  title: "Épilogue",
  concept: "Fin de l'aventure",
  phases: [
    {
      id: "d6-p1",
      type: "NARRATIVE",
      content: `Le Gardien sourit.
Le silence revient, paisible et clair.

Les dernières portes s'ouvrent,
révélant un ciel immense et étoilé.

Tu as appris à parler la langue de ce monde.
Tu as survécu à l'espace entre les touches.

Maintenant...
Il ne te reste plus qu'à écrire ta propre histoire.

--- FIN ---`,
    },
  ],
};

export const campaign: Campaign = {
  intro: [
    {
      id: "intro-1",
      type: "NARRATIVE",
      content: `Tu es devant un clavier.

Les touches sont visibles.
Ce qu’elles déclenchent ne l’est pas.

Entre les touches, il y a un monde.
Entre.`,
    },
  ],
  mapScreenText: `=== Entre les touches ===

`,
  dungeons: [
    dungeon0,
    dungeon1,
    dungeon2,
    dungeon3,
    dungeon4,
    dungeon5,
    dungeon6,
  ],
};
