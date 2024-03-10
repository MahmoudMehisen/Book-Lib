const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');
const authService = require("../services/auth.service");
const DuplicateEmailError = require('../errors/duplicate_email.error');

const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
const secretKey = process.env.SECRET_KEY || 'secret_key';

const register = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error('Validation error while registering user', { errors: errors.array() });
    return res.status(400).json({ errors: errors.array() });
  }

  const user = await authService.findUserByEmail(req.body.email);
  if (user) {
    console.error('Email is already in use');
    return res.status(400).json({ message: 'Email is already in use' });
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    try {
      const user = await authService.registerUser({
        email: req.body.email,
        password: hashedPassword,
        name: req.body.name
      });
      const userObject = user.toJSON();
      delete userObject.password;

      logger.info('User registered successfully', { userObject });
      res.status(201).json({ message: 'User registered successfully', user: userObject });
    }
    catch (error) {
      if (error instanceof DuplicateEmailError) {
        console.error('Email is already in use');
        return res.status(400).json({ message: 'Email is already in use' });
      }
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Failed to create user', error: error.message });
    }

  } catch (err) {
    logger.error('Failed to register user', { error: err.message });
    res.status(500).json({ message: 'Failed to register user', error: err.message });
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error('Validation error while logging in', { errors: errors.array() });
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await authService.findUserByEmail(req.body.email);

    if (!user) {
      logger.error('User not found', { email: req.body.email });
      return res.status(404).json({ message: 'User not found' });
    }

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
      logger.error('Invalid credentials', { email: req.body.email });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '2h' });

    logger.info('User logged in successfully', { user });
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    logger.error('Failed to login', { error: err.message });
    res.status(500).json({ message: 'Failed to login', error: err.message });
  }
};

module.exports = {
  login,
  register,
};