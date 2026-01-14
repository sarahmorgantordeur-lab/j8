const express = require('express');
const passport = require('passport');
const router = express.Router();

// Import des contrôleurs depuis le container
const { userController, authController } = require('../container')

router.post('/register', authController.register.bind(authController));
router.post('/login', passport.authenticate('local'), authController.login.bind(authController));
router.post('/logout', authController.logout.bind(authController));

router.get('/kill-me', (req, res) => {
    res.send("Je vais mourir 😅");
    process.exit(1);
});

// Routes utilisateurs - montées sur /users dans app.js
// Route: GET /users
router.get('/users', userController.handleRequest('getAll'));

// Route: POST /users
router.post('/users', userController.handleRequest('create'));

// Route: GET /users/:id
router.get('/users/:id', userController.handleRequest('getById'));

// Route: DELETE /users/:id
router.delete('/users/:id', userController.handleRequest('delete'));

module.exports = router;