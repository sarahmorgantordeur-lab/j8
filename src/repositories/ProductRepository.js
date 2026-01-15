const BaseRepository = require('../core/BaseRepository');

class ProductRepository extends BaseRepository {
  constructor(dataSource) {
    super('Product', dataSource);
  }
  // Les méthodes CRUD héritées de BaseRepository sont suffisantes
}

module.exports = ProductRepository;
