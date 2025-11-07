const Podcast = require("../models/Podcast");

exports.createPodcast = async (req, res) => {
  try {
    const { title, description } = req.body;
    const podcast = await Podcast.create({ title, description, creator: req.user._id });
    res.status(201).json({ podcast });
  } catch {
    res.status(500).json({ message: "Create podcast failed" });
  }
};
