// Consignes :
// ● Faites hériter la classe de BaseController.
// ● Remplacez toute la logique complexe par un simple appel au service.
// ● Gérez les cas d'erreurs spécifiques (ex: 409 Conflict si user existe déjà) en attrapant les erreurs du service.


const bcrypt = require('bcryptjs');
const AppDataSource = require('../config/db');
const BaseController = require('../core/BaseController');

class AuthController extends BaseController {
  constructor(authService) {
    super(authService);
    this.authService = authService;
  }

  async register(req, res) {
    const { username, password } = req.body;

    try {
      // TODO: Appeler this.authService.register(username, password)
      const result = await this.authService.register(username, password);
      // TODO: Renvoyer une réponse 201 avec le résultat
      return res.status(201).json(result);
    } catch (error) {
      // Gestion fine des erreurs métier
      if (error.message === "Username déjà pris") {
        return res.status(409).json({ message: error.message });
      }
      if (error.message === "Username et password requis") {
        return res.status(400).json({ message: error.message });
      }
      // Pour les autres erreurs, on laisse remonter (ou throw error)
      throw error;
    }
  }

  login(req, res) {
    // Passport fait le travail en amont via le middleware,
    // ici on renvoie juste le succès.
    res.json({ message: "Connecté", user: req.user.username });
  }

  getProfile(req, res) {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Non autorisé" });
    }
    res.json(req.user);
    console.log(process.pid);
  }

  logout(req, res, next) {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.json({ message: "Déconnecté" });
    });
  }
}

module.exports = AuthController; // Note: Export de la CLASSE, pas d'une instance (new)