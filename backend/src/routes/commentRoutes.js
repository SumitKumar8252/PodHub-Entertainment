const router = require("express").Router();
const auth = require("../middleware/auth");
const { listForEpisode, create } = require("../controllers/commentController");

router.get("/:episodeId", listForEpisode);
router.post("/:episodeId", auth, create);

module.exports = router;
