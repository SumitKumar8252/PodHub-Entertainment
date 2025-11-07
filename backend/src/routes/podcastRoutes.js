const router = require("express").Router();
const auth = require("../middleware/auth");
const allow = require("../middleware/roles");
const { createPodcast } = require("../controllers/podcastController");

router.post("/", auth, allow("creator", "admin"), createPodcast);

module.exports = router;
