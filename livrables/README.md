# Livrables

Ce dossier contient tout ce que Claude produit pour toi.

---

## Règle d'or

| Sens | Dossier |
|------|---------|
| **Tu fournis** un document (PDF, note, export, photo) | `context/import/` |
| **Claude produit** quelque chose pour toi | `livrables/` |

Ne mets jamais tes propres documents bruts ici. Ce dossier est réservé aux outputs.

---

## Organisation

```
livrables/
├── location-perche/   Tout ce qui concerne la location et les réservations
├── site-web/          Contenus et éléments pour le site internet
└── analyses/          Analyses, rapports, études de marché
```

Crée un nouveau sous-dossier si un projet ne rentre dans aucune catégorie existante.

---

## Convention de nommage

```
YYYY-MM-DD_description-courte.ext
```

Exemples :
- `2026-06-01_annonce-airbnb-v1.md`
- `2026-06-01_analyse-prix-perche.md`
- `2026-06-15_texte-homepage.md`

La date en préfixe permet de retrouver les versions chronologiquement.
Quand un fichier est revu et corrigé, incrémente la version : `_v1`, `_v2`, etc.
