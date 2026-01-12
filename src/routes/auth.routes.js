const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/register', authController.register);

router.post('/login', passport.authenticate('local'), authController.login);

router.get('/profile', authController.getProfile);

router.post('/logout', authController.logout);

router.get

module.exports = router;