const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();
const User = require('../models/user');

const usersFilePath = path.join(__dirname, '../data/users.json');

// Funcion auxiliar para leer los archivos JSON de los users.
const readUsersFile = async () => {
  console.log(`Reading users file: ${usersFilePath}`);
  try {
    const data = await fs.readFile(usersFilePath, 'utf-8');
    console.log('Users file read successfully');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file', error);
    return [];
  }
};

// Funcion auxiliar para escribir los JSON de usuarios
const writeUsersFile = async (data) => {
  console.log('Writing to users file');
  try {
    await fs.writeFile(usersFilePath, JSON.stringify(data, null, 2));
    console.log('Users file written successfully');
  } catch (error) {
    console.error('Error writing to users file', error);
  }
};

// GET /api/users/ - Listar todos los users
router.get('/', async (req, res) => {
  console.log('GET /api/users/ called');
  try {
    const users = await readUsersFile();
    console.log('Returning users:', users);
    res.json(users);
  } catch (error) {
    console.error('Error listing users', error);
    res.status(500).json({ error: 'Failed to read users data' });
  }
});

// POST /api/users/ - Crear un nuevo user
router.post('/', async (req, res) => {
  const { name, email, age, password, username } = req.body;
  console.log('POST /api/users/ called with body:', req.body);
  if (!name || !email || !age || !password || !username) {
    console.log('Missing required fields');
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const users = await readUsersFile();
    const newUser = new User(name, email, age, password, username);
    users.push(newUser);
    await writeUsersFile(users);
    console.log('User created successfully:', newUser);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

module.exports = router;
