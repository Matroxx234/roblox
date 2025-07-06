const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

app.get("/api/assets/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // 🎽 1. Obtenir les vêtements
    const clothingRes = await axios.get("https://catalog.roblox.com/v1/search/items", {
      params: {
        category: 3, // vêtements
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

    // 🎮 2. Obtenir les jeux de l'utilisateur
    const gamesRes = await axios.get(`https://games.roblox.com/v2/users/${userId}/games`);
    const games = gamesRes.data.data;

    const passes = [];

    // 🎟️ 3. Pour chaque jeu, récupérer les Game Passes
    for (const game of games) {
      const gameId = game.id;

      try {
        const passRes = await axios.get(`https://games.roblox.com/v1/games/${gameId}/game-passes`);
        const gamePasses = passRes.data;

        gamePasses.forEach(pass => {
          passes.push({
            id: pass.id,
            name: pass.name,
            price: pass.price || 0,
            thumbnail: `https://thumbnails.roblox.com/v1/assets?assetIds=${pass.id}&format=Png&size=150x150`
          });
        });
      } catch (err) {
        // ignorer les erreurs pour certains jeux
      }
    }

    // ✅ Fusionner tout
    const assets = [...clothes, ...passes];

    res.json({ assets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur de récupération", message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("✅ Proxy prêt sur le port " + PORT));
