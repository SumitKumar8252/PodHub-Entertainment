const {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = require("../config/s3");
const { getDurationSeconds } = require("../utils/upload");
const Episode = require("../models/Episode");
const Podcast = require("../models/Podcast");

const BUCKET = process.env.AWS_S3_BUCKET;

exports.list = async (req, res) => {
  try {
    const sort =
      req.query.sort === "latest" ? { createdAt: -1 } : { createdAt: -1 };
    const eps = await Episode.find({})
      .sort(sort)
      .limit(40)
      .populate("podcast", "title creator");
    const mapped = await Promise.all(
      eps.map(async (e) => ({
        _id: e._id,
        title: e.title,
        description: e.description,
        durationSec: e.durationSec,
        playCount: e.playCount,
        downloadCount: e.downloadCount,
        commentCount: e.commentCount,
        podcastTitle: e.podcast?.title,
        creatorName: "", // optional populate user later
      }))
    );
    res.json({ episodes: mapped });
  } catch {
    res.status(500).json({ message: "Failed to list episodes" });
  }
};

exports.mine = async (req, res) => {
  try {
    const pods = await Podcast.find({ creator: req.user._id }).select("_id");
    const ids = pods.map((p) => p._id);
    const eps = await Episode.find({ podcast: { $in: ids } }).sort({
      createdAt: -1,
    });
    res.json({ episodes: eps });
  } catch {
    res.status(500).json({ message: "Failed to list your episodes" });
  }
};

exports.getOne = async (req, res) => {
  try {
    const e = await Episode.findById(req.params.id).populate(
      "podcast",
      "title creator"
    );
    if (!e) return res.status(404).json({ message: "Episode not found" });

    // increment play count (naive)
    e.playCount += 1;
    await e.save();

    const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: e.s3Key });
    const streamUrl = await getSignedUrl(s3, cmd, { expiresIn: 60 * 10 }); // 10 min

    res.json({
      episode: {
        _id: e._id,
        title: e.title,
        description: e.description,
        durationSec: e.durationSec,
        playCount: e.playCount,
        downloadCount: e.downloadCount,
        commentCount: e.commentCount,
        podcastId: e.podcast?._id,
        podcastTitle: e.podcast?.title,
        streamUrl,
      },
    });
  } catch {
    res.status(500).json({ message: "Failed to fetch episode" });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, description, podcastId } = req.body;
    if (!req.file)
      return res.status(400).json({ message: "Audio file required" });

    const pod = await Podcast.findOne({
      _id: podcastId,
      creator: req.user._id,
    });
    if (!pod)
      return res.status(404).json({ message: "Podcast not found for creator" });

    const duration = await getDurationSeconds(req.file.buffer);
    if (!duration || duration > 180) {
      return res.status(400).json({ message: "Audio must be ≤ 180 seconds" });
    }

    const key = `episodes/${podcastId}/${Date.now()}_${req.file.originalname.replace(
      /\s+/g,
      "_"
    )}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
    );

    const ep = await Episode.create({
      podcast: podcastId,
      title,
      description,
      s3Key: key,
      durationSec: duration,
    });

    res.status(201).json({ episode: ep });
  } catch (e) {
    res.status(500).json({ message: "Upload failed" });
  }
};

exports.remove = async (req, res) => {
  try {
    const ep = await Episode.findById(req.params.id).populate(
      "podcast",
      "creator"
    );
    if (!ep) return res.status(404).json({ message: "Not found" });
    if (
      String(ep.podcast.creator) !== String(req.user._id) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: ep.s3Key }));
    await ep.deleteOne();
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
};
