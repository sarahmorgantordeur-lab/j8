const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

router.post('/import', productController.importProducts);
router.get('/export', productController.exportProducts);

module.exports = router;
