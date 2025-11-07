const mongoose = require("mongoose");

module.exports = async function connectDB() {
  const uri = process.env.MONGO_URI;
  await mongoose.connect(uri, { autoIndex: true });
  console.log("MongoDB connected ..");
};
