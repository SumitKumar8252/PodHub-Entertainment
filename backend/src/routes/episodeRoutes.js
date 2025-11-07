const router = require("express").Router();
const auth = require("../middleware/auth");
const allow = require("../middleware/roles");
const { upload } = require("../utils/upload");
const ctrl = require("../controllers/episodeController");

router.get("/", ctrl.list);
router.get("/mine", auth, allow("creator", "admin"), ctrl.mine);
router.get("/:id", ctrl.getOne);
router.post(
  "/",
  auth,
  allow("creator", "admin"),
  upload.single("audio"),
  ctrl.create
);
router.delete("/:id", auth, ctrl.remove);

module.exports = router;
