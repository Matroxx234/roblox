const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const cache = {}; // { userId: { data, timestamp } }

app.use(cors());

app.get('/api/passes/:userId', async (req, res) => {
  const userId = req.params.userId;

  // Vérifie si c’est en cache (10 minutes)
  if (cache[userId] && Date.now() - cache[userId].timestamp < 10 * 60 * 1000) {
    return res.json({ assets: cache[userId].data });
  }

  try {
    const response = await axios.get(`https://games.roblox.com/v1/users/${userId}/games`);
    const games = response.data.data;

    if (!games || games.length === 0) {
      return res.status(404).json({ error: "No games found" });
    }

    const placeId = games[0].rootPlace.id;

    const passRes = await axios.get(`https://www.roblox.com/game-pass-api/game-passes?startRowIndex=0&maxRows=100&placeId=${placeId}`);
    const raw = passRes.data;

    const passes = raw.map(pass => ({
      id: Number(pass.ProductId),
      name: pass.Name,
      price: Number(pass.Price),
      thumbnail: `https://www.roblox.com/Thumbs/Asset.ashx?assetId=${pass.AssetId}&x=150&y=150&format=png`
    }));

    // Ajout au cache
    cache[userId] = {
      data: passes,
      timestamp: Date.now()
    };

    res.json({ assets: passes });

  } catch (err) {
    res.status(400).json({ error: "Erreur de récupération", message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy API running on port ${PORT}`);
});
