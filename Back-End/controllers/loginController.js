const User = require('../models/user');
const jwt = require('jsonwebtoken');
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: "Email does not exist" });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: "Password incorrect" });
    }
    const token = generateToken(user.email, user._id, user.role);
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const generateToken = (email, _id, role) => {
  const token = jwt.sign({ email, _id, role }, "secretcode" , { expiresIn: "2h" });
  return token;
};