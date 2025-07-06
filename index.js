const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

app.get("/api/assets/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const passRes = await axios.get("https://catalog.roblox.com/v1/search/items", {
      params: {
        category: "GamePass",
        creatorTargetId: userId,
        limit: 30,
        sortOrder: "Asc"
      }
    });

    const passes = passRes.data.data.map(pass => ({
      id: pass.id,
      name: pass.name,
      price: pass.price || 0,
      thumbnail: pass.thumbnail?.imageUrl || ""
    }));

    res.json({ assets: passes });
  } catch (err) {
    console.error("Erreur :", err.message);
    res.status(500).json({ error: "Erreur de récupération", message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("✅ Proxy prêt sur le port " + PORT));
