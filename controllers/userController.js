const User = require('../models/user');

const createUser = async (user) => {
  const newUser = new User(user);
  return await newUser.save();
};

const getUserById = async (id) => {
  return await User.findById(id);
};

const getAllUsers = async () => {
  return await User.find();
};

module.exports = {
  createUser,
  getUserById,
  getAllUsers,
};
