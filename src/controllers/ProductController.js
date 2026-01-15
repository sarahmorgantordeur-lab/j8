// Pour l'import : Il passe req (qui est un stream) directement au service.
// Pour l'export : Il configure les headers (Content-Type: text/csv) et passe res (qui est un stream) au service.

const BaseController = require("../core/BaseController");

class ProductController extends BaseController {
  constructor(service) {
    super(service);
  }
  async importProducts(req, res) {
    // Validation headers si nécessaire...
    // TODO: Appeler this.service.importProducts(req)
    await this.service.importProducts(req);
    // req est lisible, le service va le lire.
    // TODO: Répondre 201 quand c'est fini
    res.status(201).send();
  }

  async exportProducts(req, res) {
    // Configuration de la réponse pour le téléchargement
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="products.csv"');
    // TODO: Appeler this.service.exportProducts(res)
    // res est inscriptible, le service va écrire dedans.
    // Pas de res.json() ici ! Le stream s'occupe de la réponse.
    await this.service.exportProducts(res);
  }
}

module.exports = ProductController;
