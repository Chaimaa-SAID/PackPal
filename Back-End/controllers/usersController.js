const User = require('../models/user');
const jwt = require('jsonwebtoken');
exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: 'User not found' });
  }};
exports.getOneUser = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, "secretcode");
    const _id = decodedToken._id;
    const user = await User.findOne({ _id: _id });
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: 'User not found' });
  }};
exports.createUser = async (req, res) => {
  try {
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      media: req.body.media,
    });
    await user.save();
    res.status(201).json({ message: 'User saved successfully!' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }};
exports.updateUser = async (req, res) => {
      const updatedUser = {
        email: req.body.email,
        password: req.body.password,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        media: req.body.media,
      };
      User.updateOne({ _id: req.params.id }, updatedUser)
        .then(() => res.status(200).json({ message: 'User updated successfully!' }))
        .catch(() => res.status(404).json({ message: 'User not found' }));
};
exports.deleteUser = async (req, res) => {
  try{
  await User.deleteOne({_id: req.params.id});
  res.status(201).json({ message: 'User deleted successfully!' });        
  }catch (error) {
    res.status(403).json({ message: 'You are not an admin' });
  }};
