const client = require("../config/elastic");

class SearchService {
  constructor() {
    this.index = "posts"; // Le nom de notre "table" dans Elastic
  }

  // Initialise l'index avec le bon mapping si celui-ci n'existe pas.
  async initIndex() {
    try {
      // TODO 1: Vérifier si l'index existe déjà via l'API client.indices.exists
      // Si oui, on log un message et on retourne (Early Return) pour ne pas recréer
        const exists = await client.indices.exists({ index: this.index });
        if (exists) {
            console.log(`[ELASTIC] Index '${this.index}' existe déjà.`);
            return; // Early return
        } else {
            // TODO 2: Si l'index n'existe pas, le créer via client.indices.create
            // Vous devez définir le Mapping suivant dans le body :
            await client.indices.create({
                index: this.index,
                body: {
                    mappings: {
                        properties: {
                            title: { type: 'text' },
                            content: {type: 'text' },
                            tags: { type: 'keyword' },
                            created_at: { type: 'date' }
                        }
                    }
                }
            });
        }
      console.log(`[ELASTIC] Index '${this.index}' créé avec succès.`);
    } catch (error) {
      console.error(
        "[ELASTIC] Erreur lors de l'initialisation de l'index :",
        error.message
      );
    }
  }
}

module.exports = SearchService;
