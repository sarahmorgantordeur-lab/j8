// Le BaseController est responsable de la couche HTTP. 
// Sa fonctionnalité critique est la méthode handleRequest, une fonction d'ordre supérieur (High Order Function) qui assure que le contexte this est préservé et que les erreurs sont capturées.

// Consignes :
// ● Implémentez la "magie" handleRequest pour ne plus jamais avoir à écrire de try/catch dans vos routes.
// ● Implémentez les méthodes standard HTTP qui utilisent le Service.

class BaseController {
  /**
   * @param {BaseService} service - Instance du service associé
   */
  constructor(service) {
    // TODO: Injecter le service
    this.service = service;
  }

  /**
   * Méthode utilitaire pour lier le contexte et gérer les erreurs.
   * C'est une High Order Function qui retourne un middleware Express.
   * @param {string} method - Nom de la méthode du contrôleur à exécuter
   */

  handleRequest(method) {
    return async (req, res, next) => {
      try {
        // TODO: Exécuter la méthode passée en paramètre (this[method])
        // ATTENTION : Il faut passer req, res, next
        await this[method](req, res, next);
      } catch (error) {
        // TODO: Passer l'erreur au middleware d'erreur d'Express (next)
        next(error);
      }
    };
  }

  async getAll(req, res) {
    // TODO: Récupérer les items via le service
    const items = await this.service.findAll();
    // TODO: Renvoyer une réponse JSON (status 200 par défaut)
    res.json(items);
  }

  async getById(req, res) {
    const { id } = req.params;
    // TODO: Récupérer l'item via le service
    const item = await this.service.findById(id);
    // TODO: Gérer le cas où l'item n'existe pas (404)
    if (!item) {
        return res.status(404).json({ error: `Item with id ${id} not found` })
    }
    // TODO: Renvoyer l'item en JSON
    res.json(item);
  }

  async create(req, res) {
    // TODO: Créer l'item via le service avec req.body
    const item = await this.service.create(req.body);
    // TODO: Renvoyer une réponse 201 (Created)
    return res.status(201).json(item);
  }

  async update(req, res) {
    const { id } = req.params;
    // TODO: Mettre à jour via le service
    const item = await this.service.update(id, req.body);
    // TODO: Renvoyer l'item mis à jour
    return res.json(item);
  }

  async delete(req, res) {
    const { id } = req.params;
    // TODO: Supprimer via le service
    await this.service.delete(id);
    // TODO: Renvoyer une réponse 204 (No Content) sans body (.end() termine la réponse sans envoyer de contenu).
    return res.status(204).end();
  }
}

module.exports = BaseController;

