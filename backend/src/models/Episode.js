const mongoose = require("mongoose");

const episodeSchema = new mongoose.Schema(
  {
    podcast: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Podcast",
      required: true,
    },
    title: { type: String, required: true },
    description: String,
    s3Key: { type: String, required: true },
    durationSec: { type: Number, required: true },
    playCount: { type: Number, default: 0 },
    downloadCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Episode", episodeSchema);
