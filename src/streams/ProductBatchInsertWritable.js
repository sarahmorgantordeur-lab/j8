// Consignes :
// ● Modifiez le constructeur pour accepter un repository dans les options.
// ● Utilisez ce repository injecté au lieu d'importer la DB globale.

const { Writable } = require('stream');

class ProductBatchInsertWritable extends Writable {
    constructor(options = {}) {
        super({ ...options, objectMode: true });
        this.batchSize = options.batchSize || 1000;
        this.batch = [];

        // TODO: Récupérer le repository depuis options.repository
        this.productRepository = options.repository;

        if (!this.productRepository) {
          throw new Error(
            "ProductBatchInsertWritable nécessite un repository !"
          );
        }
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
