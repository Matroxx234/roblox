const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/passes/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const response = await axios.get(`https://games.roblox.com/v1/users/${userId}/games?sortOrder=Asc&limit=50`);
        const games = response.data.data;

        let allPasses = [];

        for (const game of games) {
            const placeId = game.rootPlace.id;
            const passesResponse = await axios.get(`https://www.roblox.com/game-pass-api/v1/game/passes?placeId=${placeId}`);
            allPasses = allPasses.concat(passesResponse.data);
        }

        res.json(allPasses);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Erreur lors de la récupération des passes' });
    }
});

module.exports = router;
