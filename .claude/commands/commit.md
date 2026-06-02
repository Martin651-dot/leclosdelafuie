# /commit — Sauvegarder le workspace sur Git

Objectif : créer un point de sauvegarde Git de l'état actuel du workspace.

## Étapes à suivre

1. **Vérifier que Git est initialisé**
   - Si le dossier n'est pas encore un dépôt Git (`git status` échoue), lancer `git init`
   - Si c'est la première fois, configurer le premier commit

2. **Inspecter ce qui a changé**
   - Lancer `git status` pour voir les fichiers modifiés et non suivis
   - Lancer `git diff --stat` pour un résumé des changements
   - **Ne jamais stager `.env`** ni aucun fichier listé dans `.gitignore`

3. **Stager les fichiers appropriés**
   - Stager les fichiers pertinents avec `git add` par nom ou par dossier, pas avec `git add -A` à l'aveugle
   - Exclure explicitement `.env` et tout fichier contenant des secrets

4. **Proposer un message de commit**
   - Générer un message de commit en français, concis (1 ligne max), qui décrit ce qui a changé
   - Format : `type: description courte` — exemples de types : `contenu`, `config`, `livrable`, `contexte`
   - Exemples : `contenu: ajout annonce Airbnb v1`, `config: mise en place gitignore et structure livrables`
   - Afficher le message proposé et demander confirmation avant de commiter

5. **Créer le commit**
   - Une fois confirmé, créer le commit avec le message validé
   - Afficher le résultat (`git log --oneline -3`) pour confirmer le succès

## Règles de sécurité

- Ne jamais commiter `.env` (vérifie que `.gitignore` est bien en place)
- Ne jamais utiliser `--no-verify`
- Toujours demander confirmation avant de créer le commit
