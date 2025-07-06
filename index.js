const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

app.get("/api/assets/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Obtenir les vêtements
    const clothingRes = await axios.get("https://catalog.roblox.com/v1/search/items", {
      params: {
        category: 3,
        creatorTargetId: userId,
        limit: 30,
        sortOrder: "Asc"
      }
    });

    const clothes = clothingRes.data.data.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price || 0,
      thumbnail: item.thumbnail?.imageUrl || ""
    }));

    let passes = [];

    try {
      // Essayer d'obtenir les jeux
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
          // Ignorer les erreurs pour chaque jeu
        }
      }
    } catch (e) {
      // Aucun jeu — on continue sans passes
    }

    const assets = [...clothes, ...passes];
    res.json({ assets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur de récupération", message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("✅ Proxy prêt sur le port " + PORT));
