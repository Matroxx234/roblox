const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

app.get("/api/assets/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const passes = [];

    // Obtenir les jeux de l'utilisateur
    const gamesRes = await axios.get(`https://games.roblox.com/v2/users/${userId}/games`);
    const games = gamesRes.data.data;

    // Pour chaque jeu, récupérer les Game Passes
    for (const game of games) {
      try {
        const passRes = await axios.get(`https://games.roblox.com/v1/games/${game.id}/game-passes`);
        const gamePasses = passRes.data;

        gamePasses.forEach(pass => {
          passes.push({
            id: pass.id,
            name: pass.name,
            price: pass.price || 0,
            thumbnail: `https://thumbnails.roblox.com/v1/assets?assetIds=${pass.id}&format=Png&size=150x150`
          });
        });
      } catch (e) {
        // Ignore erreurs pour ce jeu
      }
    }

    res.json({ assets: passes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur de récupération", message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("✅ Proxy passes-only prêt sur le port " + PORT));

