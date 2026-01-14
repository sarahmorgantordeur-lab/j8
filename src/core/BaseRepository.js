// Le BaseRepository a pour responsabilité d'encapsuler les méthodes de TypeORM. 
// Il permet d'interagir avec n'importe quelle entité sans réécrire les requêtes de base.

// Consignes :
// ● Le constructeur doit stocker l'entité et la dataSource.
// ● get repo() doit retourner le repository TypeORM correspondant à l'entité stockée.
// ● Implémentez les méthodes CRUD en utilisant this.repo.

class BaseRepository {
  /**
   * @param {string|EntitySchema} entity - L'entité cible (ex: 'User')
   * @param {DataSource} dataSource - La connexion TypeORM
   */
  constructor(entity, dataSource) {
    // TODO: Stocker l'entité et la dataSource dans l'instance
    this.entity = entity;
    this.dataSource = dataSource;
  }

  // Accesseur pour obtenir le repository TypeORM spécifique à l'entité
  get repo() {
    // TODO: Retourner le repository via this.dataSource.getRepository(...)
    return this.dataSource.getRepository(this.entity);
  }

  async findAll(options = {}) {
    // TODO: Retourner tous les éléments via this.repo
    return await this.repo.find(options);
  }

  async findById(id) {
    // TODO: Trouver un élément par son ID via this.repo
    return await this.repo.findOneBy({ id });
  }

  async create(data) {
    // TODO: Créer une instance de l'entité avec les data (sans db)
    const entity = this.repo.create(data);
    // TODO: Sauvegarder et retourner l'entité créée (persiste en db)
    return await this.repo.save(entity);
  }

  async update(id, data) {
    // TODO: Mettre à jour l'élément avec l'ID donné
    // Note: TypeORM update ne retourne pas l'objet modifié par défaut.
    await this.repo.update(id, data);
    // Pensez à retourner l'objet mis à jour (findById) après l'update.
    return this.repo.findOneBy({ id });
  }

  async delete(id) {
    // TODO: Supprimer l'élément par son ID
    const result = await this.repo.delete(id);

    // result.affected contient le nombre de lignes supprimées
    if (result.affected === 0) {
        throw new Error(`Entity with id ${id} not found.`);
    }

    return { message: `Entity with id ${id} deleted successfully.`};
  }
}
module.exports = BaseRepository;