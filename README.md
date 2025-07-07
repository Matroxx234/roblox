# Roblox Passes API

Une API Node.js pour récupérer les **Game Passes** des jeux d’un joueur Roblox via son `userId`.

## 🌐 Endpoint

```
GET /passes/:userId
```

### Exemple

```
GET https://ton-api.render.com/passes/123456789
```

---

## 🔧 Installation

1. Clone ce dépôt ou télécharge les fichiers.
2. Installe les dépendances :

```bash
npm install
```

3. Lance le serveur :

```bash
npm start
```

---

## 🧠 Fonctionnement

Cette API :

1. Récupère la liste des jeux créés par le joueur (`userId`)
2. Pour chaque jeu, elle récupère les Game Passes associés
3. Renvoie tous les Game Passes en réponse JSON

---

## 📦 Exemple de réponse

```json
[
  {
    "ProductId": 12345678,
    "Name": "VIP Access",
    "Price": 100
  },
  ...
]
```

---

## 🚀 Déploiement sur Render

1. Connecte ton dépôt GitHub à [Render](https://render.com/)
2. Paramètres :
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Node Version**: `16` ou plus récent
3. Déploie !

---

## 📄 Licence

MIT – Utilisation libre.
