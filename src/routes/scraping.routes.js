const express = require('express');
const router = express.Router();
const scrapingController = require('../controllers/scraping.controller');

router.post('/scrape', scrapingController.scrape);

module.exports = router;
