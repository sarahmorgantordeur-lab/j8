// C'est le fichier central de votre application. 
// Il remplace l'instanciation éparpillée dans les routes.

// Consignes :
// ● Importez la source de données (AppDataSource).
// ● Importez vos nouvelles classes (UserRepository, UserService, UserController).
// ● Assemblez les pièces du puzzle dans le bon ordre.

// Container (src/container.js) :
// ○ Instanciez ProductRepository (hérite de BaseRepository).
// ○ Instanciez ProductService (injectez le repo).
// ○ Instanciez ProductController (injectez le service).
// ○ Exportez productController.


// Import de la configuration DB (Singleton)
const AppDataSource = require('./config/db');

// Import des entités
const { User } = require('./entities/User');

// Import des classes concrètes
const UserRepository = require('./repositories/UserRepository');
const UserService = require('./services/UserService');
const UserController = require('./controllers/UserController');

const ProductRepository = require('./repositories/ProductRepository');
const ProductService = require('./services/ProductService');
const ProductController = require('./controllers/ProductController');

// Imports pour le câblage de AthService dans le container
const AuthService = require('./services/AuthService');
const AuthController = require('./controllers/auth.controller'); // On va le refactoriser

// --- 1. COUCHE DATA (Repositories) ---
// Instancier le UserRepository en lui passant la AppDataSource
const userRepository = new UserRepository(AppDataSource);
// Instancier le ProductRepository
const productRepository = new ProductRepository(AppDataSource);

// --- 2. COUCHE MÉTIER (Services) ---
// Instancier le UserService en lui injectant le userRepository
const userService = new UserService(userRepository);
// Instancier authService = new AuthService(userRepository);
const authService = new AuthService(userRepository);
// Instancier le ProductService en lui injectant le productRepository
const productService = new ProductService(productRepository);

// --- 3. COUCHE PRESENTATION (Controllers) ---
// Instancier le UserController en lui injectant le userService
const userController = new UserController(userService);
// Instancier authController = new AuthController(authService);
const authController = new AuthController(authService);
// Instancier le ProductController en lui injectant le productService
const productController = new ProductController(productService);

// --- 4. EXPORT ---
// On exporte uniquement les contrôleurs prêts à l'emploi pour les routes
module.exports = {
    userController,
    authController,
    productController
};