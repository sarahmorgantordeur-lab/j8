// Hériter des classes de base

const BaseRepository = require('../core/BaseRepository');

class UserRepository extends BaseRepository {
  constructor(dataSource) {
    // TODO: Appeler le constructeur parent (super) avec le nom de l'entité 'User'
    super('User', dataSource);
  };

  // Méthode spécifique pour trouver un utilisateur par son username
  async findByUsername(username) {
    return await this.repo.findOneBy({ username });
  }

  // Pour l'instant, aucune méthode spécifique n'est nécessaire.
  // On hérite de findAll, create, etc.
};

module.exports = UserRepository;