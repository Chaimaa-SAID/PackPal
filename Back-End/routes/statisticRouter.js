const express = require("express");
const router = express.Router();
const statistic = require("../controllers/statisticsController");

router.get("/", statistic.calculateTotlal);

module.exports = router;