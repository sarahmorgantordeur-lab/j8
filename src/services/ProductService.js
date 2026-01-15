// Consignes :
// 1. Héritez de BaseService.
// 2. Importez les outils de stream (pipeline, csv-parser, etc.).
// 3. Dans importProducts, configurez le pipeline.
    // ○ Astuce : Vous devrez modifier légèrement ProductBatchInsertWritable (voir Étape 2) ou lui passer votre this.repository.repo dans ses options.
// 4. Dans exportProducts, utilisez un générateur ou un QueryBuilder pour streamer les données vers la sortie.


const AppDataSource = require('../config/db');
const BaseService = require('../core/BaseService');
const { pipeline } = require('stream/promises');
const csv = require('csv-parser');
const { stringify } = require('csv-stringify');

// Import des streams customs
const ProductValidationTransform = require('../streams/ProductValidationTransform');
const ProductBatchInsertWritable = require('../streams/ProductBatchInsertWritable');
const { Readable } = require('stream');

class ProductService extends BaseService {
  constructor(repository) {
    super(repository);
  }
  // Méthode CRUD héritées (findAll, etc.) sont déjà là !
  /**
   * Importe des produits depuis un flux de lecture (ex: req ou file stream)
   * @param {Readable} inputStream
   */
  async importProducts(inputStream) {
    const validationTransform = new ProductValidationTransform();
    // TODO: Instancier ProductBatchInsertWritable
    const batchInsertWritable = new ProductBatchInsertWritable({ 
        batchSize: 500, 
        repository: this.repository.repo 
    });
    // ATTENTION : Il faut lui passer le repository pour qu'il puisse sauvegarder !
    // TODO: Mettre en place le pipeline : inputStream -> csv() -> validation -> batchInsert
    await pipeline(
        inputStream,
        csv(),
        validationTransform,
        batchInsertWritable
    );
  }
  
  /**
   * Exporte les produits vers un flux d'écriture (ex: res)
   * @param {Writable} outputStream
   */
  async exportProducts(outputStream) {
    const repo = this.repository.repo;
    // Générateur async pour lire la BDD ligne par ligne (Memory safe)
    async function* productGenerator() {
      // TODO: Implémenter la logique de pagination (cursor-based)
      let lastId = 0;
      const batchSize = 1000;

      while (true) {
        const products = await repo.createQueryBuilder("product")
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

    const queryStream = Readable.from(productGenerator());
    // TODO: Configurer stringify (csv-stringify) avec les colonnes
    const stringifier = stringify({
      header: true,
      columns: ["id", "name", "price", "stock", "description", "isArchived"]
    });

    // TODO: Pipeline : queryStream -> stringify -> outputStream
    await pipeline(
      queryStream,
      stringifier,
      outputStream
    );
  }
}

module.exports = ProductService;