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

Ressens la résistance,
trouve le rythme.

Quand tu seras prêt, avance.`,
    },
    {
      id: "d0-p2",
      type: "TYPING_TRAINER",
      concept: "la rangée de repos",
      lines: [
        "qsdf jkl;",
        "qsdf jkl;",
        "fjdkslq;",
        "fjdkslq;",
        "ff jj kk dd ss ll qq ;;",
      ],
      headerLabel: "Entraînement fondamental",
      headerColor: "#4682b4",
      helpLabel: "Suivre la séquence",
      errorLabel: "Fautes",
      fontSize: "24px",
      letterSpacing: "2px",
    },
    {
      id: "d0-p3",
      type: "TYPING_TRAINER",
      concept: "symboles et structure",
      lines: ["() {} []", '"" == ; : , .', "const let if while"],
      headerLabel: "Entraînement fondamental",
      headerColor: "#4682b4",
      helpLabel: "Suivre la séquence",
      errorLabel: "Fautes",
      fontSize: "24px",
      letterSpacing: "2px",
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
    {
      id: "d1-p2",
      type: "TYPING_TRAINER",
      concept: "console.log",
      lines: [
        "console.log();",
        "console.log(expression);",
        'console.log("hello, world!");',
        'console.log("Défi réussi !");',
      ],
      headerLabel: "Entraînement",
      headerColor: "#8a2be2",
      helpLabel: "Taper le code",
      errorLabel: "Erreurs",
    },
    {
      id: "d1-p3",
      type: "BOSS",
      concept: `affiche "Je connais le console.log !" dans la console`,
      initialCode:
        "// Ce que tu connais :\n// console.log(expression);\n\n// Écris ton code JavaScript ici\n",
      expectedOutput: "Je connais le console.log !",
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

La commande "prompt()" permet d'interroger les ombres.

Pour retenir leur réponse,
on la stocke dans une "constante" (const) ou une "variable" (let).`,
    },
    {
      id: "d2-p2",
      type: "TYPING_TRAINER",
      concept: "variables",
      lines: [
        "const answer = prompt(question);",
        'const name = prompt("Quel est ton nom ?");',
        'const quest = prompt("Quelle est ta mission ?");',
        'const color = prompt("Quelle est ta couleur préférée ?");',
      ],
      headerLabel: "Entraînement",
      headerColor: "#8a2be2",
      helpLabel: "Taper le code",
      errorLabel: "Erreurs",
    },
    {
      id: "d2-p3",
      type: "BOSS",
      concept: "interroge les ombres",
      mockPromptReturns: ["Romain"],
      initialCode:
        "// Ce que tu connais :\n// console.log(expression);\n// const answer = prompt(question);\n\n// Demande son nom à l'écho avec prompt() et stocke-le dans une constante.\n// Affiche ensuite cette constante avec console.log().\n",
      expectedOutput: "Romain",
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

Une silhouette massive garde la porte.
C'est le Gardien.

Il te regarde, hésite, puis lâche :
"Je fais une pause. Surveille la porte.
Personne de moins de 18 ans ne passe."

Le mot-clé "if" (si) permet d'exécuter du code,
mais uniquement quand une condition est vraie.`,
    },
    {
      id: "d3-p2",
      type: "TYPING_TRAINER",
      concept: "conditions",
      lines: [
        "if () {}",
        "if (condition) { doSomething(); }",
        'if (age < 18) { console.log("Trop jeune !"); }',
        'if (age >= 18) { console.log("Bienvenue !"); }',
      ],
      headerLabel: "Entraînement",
      headerColor: "#8a2be2",
      helpLabel: "Taper le code",
      errorLabel: "Erreurs",
    },
    {
      id: "d3-p3",
      type: "BOSS",
      concept: "l'oracle des conditions",
      mockPromptReturns: ["15"],
      initialCode:
        '// Ce que tu connais :\n// console.log(expression);\n// const answer = prompt(question);\n// if (condition) { doSomething(); }\n\n// Un voyageur approche. Demande-lui son âge via prompt().\n// Si l\'âge est < 18, affiche "Trop jeune !"\n// puis affiche "Reviens dans X ans." (où X = 18 - age).\n',
      expectedOutput: "Trop jeune !\nReviens dans 3 ans.",
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
      type: "TYPING_TRAINER",
      concept: "boucles",
      lines: [
        "while () {}",
        "while (condition) { repeatSomething(); }",
        "let i = 0;\nwhile (i < 10) { console.log(i); i++; }",
        'let answer = "Non";\nwhile (answer !== "Oui") { answer = prompt("Tu confirmes ?"); }',
      ],
      headerLabel: "Entraînement",
      headerColor: "#8a2be2",
      helpLabel: "Taper le code",
      errorLabel: "Erreurs",
    },
    {
      id: "d4-p3",
      type: "BOSS",
      concept: "compte jusqu'à 10",
      initialCode:
        "// Ce que tu connais :\n// console.log(expression);\n// const answer = prompt(question);\n// if (condition) { doSomething(); }\n// while (condition) { repeatSomething(); }\n\n// Utilise une boucle while pour afficher de 1 jusqu'à 10.\nlet i = 0;\n",
      expectedOutput: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10",
    },
  ],
};

export const dungeon5: Dungeon = {
  id: 5,
  title: "Le Gardien",
  concept: "le combat final",
  phases: [
    {
      id: "d5-p1",
      type: "NARRATIVE",
      content: `Le sol tremble.
Le Gardien apparaît.

Il bloque la sortie.
Il exige de voir ce que tu as compris :
comment maîtriser le temps et les actions.

Montre-lui.`,
    },
    {
      id: "d5-p2",
      type: "BOSS",
      concept: "à toi de jouer",
      mockPromptReturns: ["Non", "Jamais", "Oui"],
      initialCode:
        '// Ce que tu connais :\n// console.log(expression);\n// const answer = prompt(question);\n// if (condition) { doSomething(); }\n// while (condition) { repeatSomething(); }\n\n// Tant que le Gardien ne répond pas "Oui":\n// 1. Demande-lui "Tu m\'ouvres ?" via prompt().\n// 2. S\'il répond "Non", affiche "Sésame".\n// 3. S\'il répond "Jamais", affiche "Pitié".\n// Après qu\'il ait dit "Oui", affiche "J\'entre".\nlet answer = "";\n',
      expectedOutput: "Sésame\nPitié\nJ'entre",
    },
  ],
};

export const dungeon6: Dungeon = {
  id: 6,
  title: "Épilogue",
  concept: "fin de l'aventure",
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
    {
      id: "d6-p2",
      type: "ACTION",
      content: `Rejoins le collectif pour partager ton expérience :

https://discord.gg/EJTsyuFwzj`,
      actionDescription: "Rejoindre le Discord du collectif",
      onAction: () => {
        window.open("https://discord.gg/EJTsyuFwzj", "_blank")?.focus();
      },
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
  tableOfContentsScreenText: `=== Entre les touches ===

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
