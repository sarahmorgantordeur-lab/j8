const productService = require('../services/product.service');

class ProductController {

    async importProducts(req, res) {
        try {
            if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data') && !req.headers['content-type'].includes('text/csv')) {
            //     return res.status(400).json({ 
            //     message: 'Format invalide. Veuillez envoyer un fichier CSV (text/csv).' 
            // });
            }

            await productService.importProducts(req);

            res.status(201).json({ message: 'Import started/completed successfully' });
        } catch (error) {
            console.error('Import error:', error);
            res.status(500).json({ message: 'Error during import', error: error.message });
        }
    }

    async exportProducts(req, res) {
        try {
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="products.csv"');

            await productService.exportProducts(res);

        } catch (error) {
            console.error('Export error:', error);
            if (!res.headersSent) {
                res.status(500).json({ message: 'Error during export', error: error.message });
            } else {
                res.end();
            }
        }
    }
}

module.exports = new ProductController();
