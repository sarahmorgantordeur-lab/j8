const router = require('express').Router();
const SearchController = require('../controllers/search.controller');
const SearchService = require('../services/search.service');

// Injection de dépendances
const searchService = new SearchService();
const searchController = new SearchController(searchService);

// Route utilitaire pour forcer l'indexation
router.post('/index-all', searchController.indexAll);

module.exports = router;