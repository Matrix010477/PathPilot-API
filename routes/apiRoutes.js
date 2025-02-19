const express = require("express");
const router = express.Router();

// Sample GET route to test
router.get("/test", (req, res) => {
    res.json({ message: "Hello from PathPilot API!" });
});

module.exports = router;
