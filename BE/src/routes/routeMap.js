const express = require("express");
const axios = require("axios");
const router = express.Router();

const ORS_API_KEY = process.env.ORS_API_KEY;

const getDistance = async (from, to) => {
    const res = await axios.post(
        "https://api.openrouteservice.org/v2/directions/driving-car",
        {
            coordinates: [from, to]
        },
        {
            headers: {
                Authorization: ORS_API_KEY,
                "Content-Type": "application/json"
            }
        }
    );
    return {
        distance: res.data.routes[0].summary.distance,
        geometry: res.data.routes[0].geometry
    };
};

router.post("/find-shortest", async (req, res) => {
    try {
        const { staff, customer } = req.body;

        let best = null;
        let bestDistance = Infinity;
        let bestGeometry = null;

        for (const s of staff) {
            const result = await getDistance(s.location, customer);
            if (result.distance < bestDistance) {
                best = s;
                bestDistance = result.distance;
                bestGeometry = result.geometry;
            }
        }

        res.json({
            selectedStaff: best,
            distance: bestDistance,
            route: bestGeometry
        });
    } catch (error) {
        console.error("Route error:", error.message);
        res.status(500).json({ error: "Route calculation failed" });
    }
});

module.exports = router;
