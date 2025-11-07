const mongoose = require("mongoose");

const podcastSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: String,
    subscribers: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Podcast", podcastSchema);
