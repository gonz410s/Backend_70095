const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { createUser, getUserById, getAllUsers } = require('../services/userService');

router.post('/', async (req, res) => {
  const { name, email, age, password, username } = req.body;

  if (!name || !email || !age || !password || !username) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newUser = new User(`${Date.now()}${Math.floor(Math.random() * 1000)}`, name, email, age, password, username);
  try {
    const createdUser = await createUser(newUser);
    res.status(201).json(createdUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.get('/:uid', async (req, res) => {
  try {
    const user = await getUserById(req.params.uid);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user' });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get users' });
  }
});

module.exports = router;
