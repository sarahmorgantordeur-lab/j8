const client = require("../src/config/elastic");
const AppDataSource = require("../src/config/db");
const Post = require("../src/entities/Post");
const SearchService = require("../src/services/search.service");

async function reindex() {
  console.log("🔄 Démarrage de la migration...");
  // 1. Initialiser les connexions
  const searchService = new SearchService();
  await AppDataSource.initialize();

  // 2. Supprimer l'ancien index (S'il existe)
  // TODO: Utilisez client.indices.delete({ index: 'posts' })
  // Pensez à gérer le cas où l'index n'existe pas (try/catch ou ignore: [404])
  try {
    await client.indices.delete({ index: "posts" });
    console.log("🗑️ Ancien index supprimé.");
  } catch (e) {
    console.log("ℹ️ Index n'existait pas, on continue.");
  }

  // 3. Recréer l'index avec le NOUVEAU Mapping
  // TODO: Appeler la méthode initIndex() du service
  await searchService.initIndex();

  // 4. Récupérer les données SQL (Source de vérité)
  const postRepo = AppDataSource.getRepository(Post);
  const posts = await postRepo.find();
  console.log(` ${posts.length} articles récupérés depuis SQL.`);
  
  // 5. Ré-indexer (Bulk)
  // TODO: Appeler la méthode bulkIndex() du service
  await searchService.bulkIndex(posts);
  console.log(" Migration terminée avec succès.");
  process.exit();
}
reindex().catch(console.error);
