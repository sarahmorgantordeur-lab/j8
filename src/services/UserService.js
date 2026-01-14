// Hériter des classes de base

const BaseService = require('../core/BaseService');

class UserService extends BaseService {
  constructor(repository) {
    // TODO: Appeler le constructeur parent (super) avec le nom de l'entité 'User'
    super(repository);
  };
  // Pour l'instant, aucune méthode spécifique n'est nécessaire.
  // On hérite de findAll, create, etc.
};

module.exports = UserService;