const User = require("../models/customer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var storage = require("local-storage");
const mailer = require("../middleware/mailer");
const saltRounds = 10;
const register = async (req, res) => {
  const { first_name, last_name, email, password, confirm_password } = req.body;
  try {
    if (!first_name || !last_name || !email || !password) {
      throw Error("Fill in all fields to register");
    }
    if (password !== confirm_password) {
      throw Error("Passwords do not match");
    }
    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
      return res.status(400).json({ massage: "Email already exists" });
    }
    const hashPassword = await bcrypt.hash(password, saltRounds);
    const user = await User.create({
      first_name,
      last_name,
      email,
      password: hashPassword,
    });
    if (user) {
      mailer.main("register", user);
      res.json({
        message:
          "Successfully registered. Check your email to activate your account",
        email: email,
      });
    } else {
      throw Error("User not created, please try again");
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send("Registration failed");
  }
};
const login = async (req, res) => {
  const { body } = req;
  if (!body.email || !body.password)
    throw Error("Fill the all fields to login");
  const login_user = await User.findOne({ email: body.email });
  if (
    !login_user ||
    !(await bcrypt.compare(body.password, login_user.password))
  )
    throw Error("Email or password is incorect");
  if (!login_user.verification)
    throw Error("Check your email to active your account");
  if (!login_user.status) {
    console.log(login_user);
    throw Error("You can't to login");
  }
  const token = await jwt.sign({ id: login_user.id }, process.env.TOKEN_KEY);
  storage("token", token);
  res.status(200).json({
    message: "Login success",
    username: login_user.username,
    _id: login_user._id,
    email: login_user.email,
    token: storage("token"),
  });
};
const logout = async (req, res) => {
  storage.clear();
  res.send(true);
};
module.exports = {
  register,
  login,
  logout,
};
