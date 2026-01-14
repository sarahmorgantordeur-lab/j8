// Hériter des classes de base

const BaseController = require('../core/BaseController');

class UserController extends BaseController {
  constructor(service) {
    // TODO: Appeler le constructeur parent (super) avec le nom de l'entité 'User'
    super(service);
  };
  // Pour l'instant, aucune méthode spécifique n'est nécessaire.
  // On hérite de findAll, create, etc.
};

module.exports = UserController;