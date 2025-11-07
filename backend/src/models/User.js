const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["listener", "creator", "admin"],
      default: "listener",
    },
    subscribedPodcasts: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Podcast" },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.compare = function (pw) {
  return bcrypt.compare(pw, this.password);
};

module.exports = mongoose.model("User", userSchema);
