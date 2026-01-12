const express = require('express');
const router = express.Router();
const HeavyComputationController = require('../controllers/HeavyComputationController');
// Route qui va bloquer le serveur
router.get('/heavy-task-blocking', HeavyComputationController.blockingTask);
// Route qui délègue le travail à un Worker Thread
router.get('/heavy-task-worker', HeavyComputationController.workerTask);
module.exports = router;