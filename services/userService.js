const fs = require('fs').promises;
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/users.json');

const readUsersFile = async () => {
  try {
    const data = await fs.readFile(usersFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file', error);
    return [];
  }
};

const writeUsersFile = async (data) => {
  try {
    await fs.writeFile(usersFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing users file', error);
  }
};

const createUser = async (user) => {
  const users = await readUsersFile();
  users.push(user);
  await writeUsersFile(users);
  return user;
};

const getUserById = async (id) => {
  const users = await readUsersFile();
  return users.find(user => user.id === id);
};

const getAllUsers = async () => {
  return await readUsersFile();
};

module.exports = {
  createUser,
  getUserById,
  getAllUsers,
};
