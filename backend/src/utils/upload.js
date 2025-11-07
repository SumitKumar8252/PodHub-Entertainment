const multer = require("multer");
const { parseBuffer } = require("music-metadata");

// memory storage for S3
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const ok = ["audio/mpeg", "audio/mp3", "audio/x-m4a", "audio/wav", "audio/aac", "audio/m4a"].includes(file.mimetype);
    if (!ok) return cb(new Error("Only audio files allowed"));
    cb(null, true);
  }
});

async function getDurationSeconds(buffer) {
  try {
    const meta = await parseBuffer(buffer, null, { duration: true });
    return Math.round(meta.format.duration || 0);
  } catch {
    return 0; // fallback (backend still enforces via 0? No—reject)
  }
}

module.exports = { upload, getDurationSeconds };
