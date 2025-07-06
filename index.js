const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

app.get("/api/assets/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
   const gamepassesRes = await axios.get(`https://inventory.roblox.com/v1/users/${userId}/assets/999999999`);
    const catalogRes = await axios.get(`https://catalog.roblox.com/v1/search/items`, {
      params: {
        category: 3,
        creatorTargetId: userId,
        limit: 30
      }
    });

    const assets = [];

    for (const item of catalogRes.data.data) {
      assets.push({
        id: item.id,
        name: item.name,
        price: item.price || 0,
        thumbnail: item.thumbnail.imageUrl
      });
    }

    for (const pass of gamepassesRes.data.data) {
      assets.push({
        id: pass.id,
        name: pass.name,
        price: pass.price || 0,
        thumbnail: `https://www.roblox.com/Thumbs/Asset.ashx?assetId=${pass.id}`
      });
    }

    res.json({ assets });
  } catch (err) {
    res.status(500).json({ error: "Erreur de récupération", message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("✅ Proxy prêt sur le port " + PORT));
