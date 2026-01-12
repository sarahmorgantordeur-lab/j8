const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class ScrapingService {
    constructor() {
        this.browser = null;
        this.page = null;
        this.outputFile = path.join(__dirname, '../../scraped_products.csv');
    }

    async init() {
        this.browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        this.page = await this.browser.newPage();
        await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
    }

    async delay(min = 1000, max = 3000) {
        const time = Math.floor(Math.random() * (max - min + 1)) + min;
        return new Promise(resolve => setTimeout(resolve, time));
    }

    async scrapeProducts(url, maxPages = 2) {
        let products = [];
        try {
            await this.init();

            let currentPage = 1;
            let hasNextPage = true;
            let currentUrl = url;

            fs.writeFileSync(this.outputFile, 'Title,Price,Stock\n');

            while (hasNextPage && currentPage <= maxPages) {
                console.log(`Scraping page ${currentPage}: ${currentUrl}`);
                await this.page.goto(currentUrl, { waitUntil: 'networkidle2' });

                
                await this.delay(1000, 3000);

                const pageProducts = await this.page.evaluate(() => {
                    const items = [];
                    const productElements = document.querySelectorAll('article.product_pod');

                    productElements.forEach(el => {
                        const title = el.querySelector('h3 a')?.getAttribute('title') || 'No Title';
                        const price = el.querySelector('.price_color')?.innerText || '0';
                        const stock = el.querySelector('.instock.availability')?.innerText?.trim() || 'Unknown';

                        items.push({
                            title: title.replace(/,/g, ' '),
                            price: price.replace(/,/g, ''),
                            stock: stock
                        });
                    });
                    return items;
                });

                products = [...products, ...pageProducts];

                const csvRows = pageProducts.map(p => `${p.title},${p.price},${p.stock}`).join('\n');
                if (csvRows) {
                    fs.appendFileSync(this.outputFile, csvRows + '\n');
                }

                const nextButton = await this.page.$('.next > a');
                if (nextButton) {
                    const nextUrl = await this.page.evaluate(el => el.href, nextButton);
                    currentUrl = nextUrl;
                    currentPage++;
                } else {
                    hasNextPage = false;
                }
            }

            console.log(`Scraping completed. ${products.length} products saved to ${this.outputFile}`);
            return { count: products.length, file: this.outputFile };

        } catch (error) {
            console.error('Scraping error:', error);
            throw error;
        } finally {
            await this.close();
        }
    }
}

module.exports = new ScrapingService();
