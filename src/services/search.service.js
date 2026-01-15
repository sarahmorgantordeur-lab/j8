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
                title: { type: "text" },
                content: { type: "text" },
                tags: { type: "keyword" },
                created_at: { type: "date" },
              },
            },
          },
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

  // Indexe un tableau de documents en une seule requête HTTP.
  // @param {Array} posts - Liste des entités Post venant de SQL
  async bulkIndex(posts) {
    if (!posts || posts.length === 0) return;
    try {
      // TODO 1: Transformer le tableau 'posts' en format Bulk (NDJSON)
      // Utilisez la méthode .flatMap() pour créer 2 entrées par post :
      // 1. L'instruction d'indexation : { index: { _index: this.index, _id: ... } }
      // 2. Le document lui-même (title, content, tags, created_at)
      posts.flatMap(post => [
        { 
          index: { _index: this.index, 
          _id: post.id.toString() } 
        },
        {
          title: post.title,
          content: post.content,
          tags: post.tags,
          created_at: post.created_at,
        }
      ]);

      const operations = posts.flatMap((post) => [
        // Ligne 1 : Métadonnées (Quel index ? Quel ID ?)
        { index: { _index: this.index, _id: post.id.toString() } },
        // Ligne 2 : Les données (Ce qu'on cherche)
        {
          title: post.title,
          content: post.content,
          tags: post.tags,
          created_at: post.created_at,
        },
      ]);

      // TODO 2: Envoyer le tout à Elastic
      await client.bulk({ refresh: true, operations }); 
      // 'refresh: true' rend les documents visibles immédiatement pour la recherche (utile en dev) mais ne pas faire en réaliter (mettre false) sinon, si on a 1000 000 de requêtes ça crash le serveur

      const bulkResponse = await client.bulk({
        refresh: true,
        operations,
      });
      // Gestion d'erreurs simple
      if (bulkResponse.errors) {
        console.error("Erreurs lors du Bulk (voir logs pour détails)");
        // En prod, on parcourrait bulkResponse.items pour voir quel doc a échoué
      } else {
        console.log(` Bulk success : ${posts.length} documents indexés.`);
      }
    } catch (error) {
      console.error(" Erreur critique Bulk :", error.message);
    }
  }
}

module.exports = SearchService;
