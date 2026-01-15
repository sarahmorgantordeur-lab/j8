// Nous allons utiliser une technique avancée : le Mock de Module.
// Nous allons intercepter src/container.js pour y injecter nos faux services.

const request = require("supertest");

// --- ZONE DE MOCKING (AVANT L'IMPORT DE L'APP) ---
// 1. MOCK DU CONTAINER (Pour isoler le contrôleur de la BDD)
jest.mock("../../src/container", () => {
  // On fabrique un faux ProductService
  const mockProductService = {
    // TODO: Faire en sorte que findAll retourne une liste avec 1 produit fictif
    findAll: jest
      .fn()
      .mockResolvedValue([{ id: 1, name: "Iphone", price: 99 }]),
    importProducts: jest.fn(),
    exportProducts: jest.fn(),
  };
  // On instancie le VRAI contrôleur avec le FAUX service
  const ProductController = require("../../src/controllers/ProductController");
  const controller = new ProductController(mockProductService);
  // Helper pour les autres contrôleurs qu'on ne teste pas ici
  const dummyController = {
    register: (req, res, next) => next(),
    login: (req, res, next) => next(),
    logout: (req, res, next) => next(),
    handleRequest: () => (req, res, next) => next(),
  };
  // On retourne l'objet qui remplace le fichier container.js
  return {
    productController: controller,
    // On met des bouchons pour le reste pour éviter les erreurs de chargement
    authController: dummyController,
    heavyComputationController: dummyController,
    userController: dummyController,
    userRepository: {},
    productRepository: {},
    messageRepository: {},
    authService: {},
    productService: mockProductService,
    messageService: {},
    heavyComputationService: {},
  };
});

// 2. MOCK DE PASSPORT (Pour contourner le login)
jest.mock("../../src/config/passport", () => ({
  // On surcharge le middleware initialize pour injecter un user factice
  initialize: () => (req, res, next) => {
    // TODO: Forcer isAuthenticated à true
    req.isAuthenticated = () => true;
    req.user = { id: 1, username: "TestAdmin" };
    next();
  },
  session: () => (req, res, next) => next(),
  authenticate: () => (req, res, next) => next(),
}));
// --- FIN DE LA ZONE DE MOCKING ---

// IMPORTANT : On importe l'app APRÈS les mocks
const app = require("../../src/app");

// --- ZONE DE TEST ---
describe("Product API Integration", () => {
  // Récupération du mock pour pouvoir le modifier dans les tests
  let mockProductService;

  // Fermer toutes les connexions après les tests
  afterAll(async () => {
    // Fermer les connexions de base de données et Redis si nécessaire
    const AppDataSource = require("../../src/config/db");
    const redisClient = require("../../src/config/redis");

    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }

    if (redisClient.isOpen) {
      await redisClient.quit();
    }
  });

  beforeEach(() => {
    // On récupère le mock depuis le container mocké
    mockProductService = require("../../src/container").productService;
    // On réinitialise les mocks avant chaque test
    jest.clearAllMocks();
  });

  describe("GET /products", () => {
    it("devrait retourner la liste des produits mockés (200 OK)", async () => {
      // ARRANGE - le mock est déjà configuré dans le mock du container
      mockProductService.findAll.mockResolvedValue([
        { id: 1, name: "Iphone", price: 99 },
      ]);

      // ACT
      const response = await request(app).get("/products");

      // ASSERT
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe("Iphone");
    });

    it("devrait retourner une liste vide si aucun produit (200 OK)", async () => {
      // ARRANGE - On configure le mock pour retourner un tableau vide
      mockProductService.findAll.mockResolvedValue([]);

      // ACT
      const response = await request(app).get("/products");

      // ASSERT
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
      expect(response.body).toEqual([]);
    });

    it("devrait retourner une erreur 500 si le service plante", async () => {
      // ARRANGE - On force le mock à lancer une erreur
      mockProductService.findAll.mockRejectedValue(
        new Error("Erreur de base de données")
      );

      // ACT
      const response = await request(app).get("/products");

      // ASSERT
      expect(response.status).toBe(500);
    });
  });
});
