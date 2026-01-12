const scrapingService = require('../services/scraping.service');

class ScrapingController {
    async scrape(req, res) {
        try {
            const { url } = req.body;

            if (!url) {
                return res.status(400).json({ error: 'URL is required' });
            }

            const result = await scrapingService.scrapeProducts(url);

            res.status(200).json({
                message: 'Scraping completed successfully',
                data: result
            });
        } catch (error) {
            console.error('Controller error:', error);
            res.status(500).json({ error: 'Scraping failed', details: error.message });
        }
    }
}

module.exports = new ScrapingController();
