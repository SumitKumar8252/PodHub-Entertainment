const Comment = require("../models/Comment");
const Episode = require("../models/Episode");

exports.listForEpisode = async (req, res) => {
  try {
    const comments = await Comment.find({ episode: req.params.episodeId })
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("user", "name");
    res.json({
      comments: comments.map((c) => ({
        _id: c._id,
        text: c.text,
        userName: c.user?.name || "User",
        createdAt: c.createdAt,
      })),
    });
  } catch {
    res.status(500).json({ message: "Failed to list comments" });
  }
};

exports.create = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim())
      return res.status(400).json({ message: "Empty comment" });

    const comment = await Comment.create({
      episode: req.params.episodeId,
      user: req.user._id,
      text: text.trim(),
    });

    await Episode.findByIdAndUpdate(req.params.episodeId, {
      $inc: { commentCount: 1 },
    });

    res.status(201).json({
      comment: {
        _id: comment._id,
        text: comment.text,
        userName: req.user.name,
        createdAt: comment.createdAt,
      },
    });
  } catch {
    res.status(500).json({ message: "Failed to comment" });
  }
};
