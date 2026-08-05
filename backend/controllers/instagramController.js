import { scrapeInstagram } from "../services/instagram/apifyService.js";

export const getProfile = async (req, res) => {

    try {

        const { username } = req.params;

        const profile = await scrapeInstagram(username);

        res.json(profile);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: err.message,
        });

    }

};