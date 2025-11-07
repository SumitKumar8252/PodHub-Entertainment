const jwt = require("jsonwebtoken");
const User = require("../models/User");

function sign(u) {
  return jwt.sign({ id: u._id, role: u.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

exports.register = async (req, res) => {
  try {
    const { name, email, password, role = "listener" } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const user = await User.create({ name, email, password, role });
    const token = sign(user);
    res.json({ token, user: { id: user._id, name, email, role } });
  } catch (e) {
    res.status(500).json({ message: "Register failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const u = await User.findOne({ email });
    if (!u || !(await u.compare(password))) return res.status(400).json({ message: "Invalid credentials" });
    const token = sign(u);
    res.json({ token, user: { id: u._id, name: u.name, email: u.email, role: u.role } });
  } catch {
    res.status(500).json({ message: "Login failed" });
  }
};
