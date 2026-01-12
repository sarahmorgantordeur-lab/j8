// Le BaseService agit comme une couche intermédiaire. 
// Il applique le principe d'Injection de Dépendance : 
// il ne connaît pas la base de données directement, il connaît uniquement un "Repository".

// Consignes :
// Le Service fait office de "passe-plat" par défaut. 
// Il doit déléguer chaque appel au repository injecté.


class BaseService {
  /**
   * @param {BaseRepository} repository - Instance du repository associé
   */
  constructor(repository) {
    // TODO: Injecter le repository (this.repository = ...)
    this.repository = repository;
  }

  async findAll() {
    // TODO: Appeler la méthode findAll du repository
    return await this.repository.findAll();
  }

  async findById(id) {
    // TODO: Appeler la méthode findById du repository
    return await this.repository.findById(id);
  }

  async create(data) {
    // TODO: Appeler la méthode create du repository
    return await this.repository.create(data);
  }

  async update(id, data) {
    // TODO: Appeler la méthode update du repository
    return await this.repository.update(id, data);
  }

  async delete(id) {
    // TODO: Appeler la méthode delete du repository
    return await this.repository.delete(id);
  }
}

module.exports = BaseService;