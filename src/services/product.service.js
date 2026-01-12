const { pipeline } = require('stream/promises');
const csv = require('csv-parser');
const { stringify } = require('csv-stringify');
const AppDataSource = require('../config/db');
const ProductValidationTransform = require('../streams/ProductValidationTransform');
const ProductBatchInsertWritable = require('../streams/ProductBatchInsertWritable');

class ProductService {


    async importProducts(inputStream) {
        const validationTransform = new ProductValidationTransform();
        const batchInsertWritable = new ProductBatchInsertWritable({ batchSize: 500 });

        await pipeline(
            inputStream,
            csv(), 
            validationTransform,
            batchInsertWritable
        );
    }

    async exportProducts(outputStream) {
        const productRepository = AppDataSource.getRepository("Product");

        async function* productGenerator() {
            let lastId = 0;
            const batchSize = 1000;

            while (true) {
                const products = await productRepository.createQueryBuilder("product")
                    .select(["product.id", "product.name", "product.price", "product.stock", "product.description", "product.isArchived"])
                    .where("product.id > :lastId", { lastId })
                    .orderBy("product.id", "ASC")
                    .take(batchSize)
                    .getMany();

                if (products.length === 0) break;

                for (const product of products) {
                    yield product;
                }

                lastId = products[products.length - 1].id;
            }
        }

        const { Readable } = require('stream');
        const queryStream = Readable.from(productGenerator());

        const stringifier = stringify({
            header: true,
            columns: ["id", "name", "price", "stock", "description", "isArchived"]
        });

        await pipeline(
            queryStream,
            stringifier,
            outputStream
        );
    }
}

module.exports = new ProductService();
