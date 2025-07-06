const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const cache = {}; // { userId: { data, timestamp } }

app.use(cors());

app.get('/api/passes/:userId', async (req, res) => {
  const userId = req.params.userId;

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ error: "Invalid userId" });
  }

  // Vérifie le cache (valide 10 minutes)
  if (cache[userId] && Date.now() - cache[userId].timestamp < 10 * 60 * 1000) {
    return res.json({ assets: cache[userId].data });
  }

  try {
    // Étape 1 : récupérer les jeux du joueur
    const response = await axios.get(`https://games.roblox.com/v1/users/${userId}/games`);
    const games = response.data.data;

    if (!games || games.length === 0 || !games[0].rootPlace) {
      return res.status(404).json({ error: "No public games with Game Passes found" });
    }

    const placeId = games[0].rootPlace.id;

    // Étape 2 : récupérer les Game Pass pour ce jeu
    const passRes = await axios.get(`https://www.roblox.com/game-pass-api/game-passes?startRowIndex=0&maxRows=100&placeId=${placeId}`);
    const raw = passRes.data;

    const passes = raw.map(pass => ({
      id: Number(pass.ProductId),
      name: pass.Name,
      price: Number(pass.Price),
      thumbnail: `https://www.roblox.com/Thumbs/Asset.ashx?assetId=${pass.AssetId}&x=150&y=150&format=png`
    }));

    // Stocker en cache
    cache[userId] = {
      data: passes,
      timestamp: Date.now()
    };

    res.json({ assets: passes });

  } catch (err) {
    console.error("Erreur de récupération :", err.message);
    res.status(400).json({
      error: "Erreur de récupération",
      message: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy API running on port ${PORT}`);
});
