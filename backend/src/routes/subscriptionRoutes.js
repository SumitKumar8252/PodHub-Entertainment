const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  subscribe,
  unsubscribe,
  statusForEpisode,
} = require("../controllers/subscriptionController");

router.post("/:podcastId", auth, subscribe);
router.delete("/:podcastId", auth, unsubscribe);
router.get("/status/:episodeId", auth, statusForEpisode);

module.exports = router;
