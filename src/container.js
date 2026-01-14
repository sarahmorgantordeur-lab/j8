// C'est le fichier central de votre application. 
// Il remplace l'instanciation éparpillée dans les routes.

// Consignes :
// ● Importez la source de données (AppDataSource).
// ● Importez vos nouvelles classes (UserRepository, UserService, UserController).
// ● Assemblez les pièces du puzzle dans le bon ordre.


// Import de la configuration DB (Singleton)
const AppDataSource = require('./config/db');

// Import des entités
const { User } = require('./entities/User');

// Import des classes concrètes
const UserRepository = require('./repositories/UserRepository');
const UserService = require('./services/UserService');
const UserController = require('./controllers/UserController');

// Imports pour le câblage de AthService dans le container
const AuthService = require('./services/AuthService');
const AuthController = require('./controllers/auth.controller'); // On va le refactoriser

// --- 1. COUCHE DATA (Repositories) ---
// TODO: Instancier le UserRepository en lui passant la AppDataSource
const userRepository = new UserRepository(AppDataSource);

// --- 2. COUCHE MÉTIER (Services) ---
// TODO: Instancier le UserService en lui injectant le userRepository
const userService = new UserService(userRepository);
// TODO: Instancier authService = new AuthService(userRepository);
const authService = new AuthService(userRepository);

// --- 3. COUCHE PRESENTATION (Controllers) ---
// TODO: Instancier le UserController en lui injectant le userService
const userController = new UserController(userService);
// TODO: Instancier authController = new AuthController(authService);
const authController = new AuthController(authService);

// --- 4. EXPORT ---
// On exporte uniquement les contrôleurs prêts à l'emploi pour les routes
module.exports = {
    // TODO: Exporter userController
    userController,
    // TODO: Exporter authController
    authController
};