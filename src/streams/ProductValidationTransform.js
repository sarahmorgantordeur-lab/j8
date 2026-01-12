const { Transform } = require('stream');

class ProductValidationTransform extends Transform {
    constructor(options) {
        super({ ...options, objectMode: true });
    }

    _transform(chunk, encoding, callback) {
        try {

            const name = chunk.name ? chunk.name.trim() : '';
            const description = chunk.description ? chunk.description.trim() : '';

            if (!chunk.price || isNaN(parseFloat(chunk.price))) {
                return callback();
            }
            const price = parseFloat(chunk.price);

            let stock = parseInt(chunk.stock, 10);
            if (isNaN(stock)) {
                stock = 0;
            }
            if (stock < 0) {
                stock = 0;
            }

            const product = {
                name,
                price,
                stock,
                description,
                isArchived: chunk.isArchived === 'true' || chunk.isArchived === true
            };

            this.push(product);
            callback();
        } catch (error) {
            // In case of unexpected error, we can emit it or skip
            callback(error);
        }
    }
}

module.exports = ProductValidationTransform;
