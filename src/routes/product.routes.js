const express = require('express');
const router = express.Router();
const { productController } = require('../container');

// Routes CRUD standard via handleRequest
router.get('/', productController.handleRequest('getAll'));
router.post('/', productController.handleRequest('create'));
router.get('/:id', productController.handleRequest('getById'));
router.put('/:id', productController.handleRequest('update'));
router.delete('/:id', productController.handleRequest('delete'));

// Routes spécifiques pour import/export (streaming)
router.post('/import', productController.importProducts.bind(productController));
router.get('/export', productController.exportProducts.bind(productController));

module.exports = router;
