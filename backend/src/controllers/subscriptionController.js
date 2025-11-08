const User = require("../models/User");  // ✅ FIXED CASE
const Podcast = require("../models/Podcast");
const Episode = require("../models/Episode");
const { sendMail } = require("../utils/email");

exports.subscribe = async (req, res) => {
  try {
    const podcastId = req.params.podcastId;

    const user = await User.findById(req.user._id);

    if (user.subscribedPodcasts.includes(podcastId)) {
      return res.json({ subscribed: true });
    }

    user.subscribedPodcasts.push(podcastId);
    await user.save();

    await Podcast.findByIdAndUpdate(podcastId, { $inc: { subscribers: 1 } });

    res.json({ subscribed: true });
  } catch {
    res.status(500).json({ message: "Subscription failed" });
  }
};

exports.unsubscribe = async (req, res) => {
  try {
    const podcastId = req.params.podcastId;

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { subscribedPodcasts: podcastId },
    });

    await Podcast.findByIdAndUpdate(podcastId, {
      $inc: { subscribers: -1 },
    });

    res.json({ subscribed: false });
  } catch {
    res.status(500).json({ message: "Unsubscribe failed" });
  }
};

exports.statusForEpisode = async (req, res) => {
  try {
    const ep = await Episode.findById(req.params.episodeId).populate(
      "podcast",
      "_id"
    );

    if (!ep) return res.json({ subscribed: false });

    const subscribed = req.user
      ? req.user.subscribedPodcasts.some(
          (id) => String(id) === String(ep.podcast._id)
        )
      : false;

    res.json({ subscribed });
  } catch {
    res.json({ subscribed: false });
  }
};
