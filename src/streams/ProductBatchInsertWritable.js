const { Writable } = require('stream');
const AppDataSource = require('../config/db');

class ProductBatchInsertWritable extends Writable {
    constructor(options = {}) {
        super({ ...options, objectMode: true });
        this.batchSize = options.batchSize || 1000;
        this.batch = [];
        this.productRepository = AppDataSource.getRepository("Product");
    }

    async _write(chunk, encoding, callback) {
        this.batch.push(chunk);

        if (this.batch.length >= this.batchSize) {
            try {
                await this.flushBatch();
                callback();
            } catch (error) {
                callback(error);
            }
        } else {
            callback();
        }
    }

    async _final(callback) {
        try {
            if (this.batch.length > 0) {
                await this.flushBatch();
            }
            callback();
        } catch (error) {
            callback(error);
        }
    }

    async flushBatch() {
        if (this.batch.length === 0) return;


        await this.productRepository.insert(this.batch);

        this.batch = [];

    }
}

module.exports = ProductBatchInsertWritable;
