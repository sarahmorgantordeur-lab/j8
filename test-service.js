const scrapingService = require('./src/services/scraping.service');

(async () => {
    console.log('🚀 Démarrage du test manuel du Service...');

    try {
        // On appelle directement la méthode métier
        const result = await scrapingService.scrapeProducts('https://books.toscrape.com/', 1); // 1 page max pour le test
        
        console.log('✅ Succès !');
        console.log('Résultat:', result);
    } catch (error) {
        console.error('❌ Erreur :', error);
    }
})();