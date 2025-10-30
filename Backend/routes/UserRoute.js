const express = require('express');
const { addRegisterUser, addLoginUser, getUserDetails, deleteUser } = require('../controllers/UserController');
const user = express.Router();

user.post('/register', addRegisterUser);
user.post('/login', addLoginUser);
user.get('/' , getUserDetails)
user.delete('/:id', deleteUser);

module.exports = user;
