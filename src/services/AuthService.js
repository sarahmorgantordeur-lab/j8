// Le AuthService ne doit jamais manipuler req ou res. 
// Il reçoit des données brutes (username,password) et retourne des objets JS ou lance des erreurs.

// Consignes :
// ● Créez une classe AuthService.
// ● Elle doit recevoir le UserRepository dans son constructeur (Injection).
// ● Migrez la logique de hashage de mot de passe depuis le contrôleur vers la méthode register.
// ● Implémentez une méthode validateUser pour vérifier le mot de passe (utile pour le login/Passport).

const bcrypt = require("bcryptjs");

class AuthService {
  constructor(userRepository) {
    // TODO: Injecter le userRepository
    this.userRepository = userRepository;
  }

  async register(username, password) {
    // Validation basique
    if (!username || !password) {
      throw new Error("Username et password requis");
    }
    // TODO: Vérifier si l'utilisateur existe déjà via
    const existingUser = await this.userRepository.findByUsername(username);
    if (existingUser) { // Si oui, lancer une erreur "Username déjà pris"
      throw new Error("Username déjà pris");
    }
    // TODO: Hasher le mot de passe avec bcrypt (salt 10)
    const hashedPassword = await bcrypt.hash(password, 10);
    // TODO: Créer l'utilisateur via this.userRepository.create()
    const newUser = await this.userRepository.create({
      username: username,
      password: hashedPassword
    });
    // Retourner l'utilisateur créé (ou juste { id, username })
    return newUser;
  }

  async validateUser(username, password) {
    // TODO: Récupérer l'utilisateur par son username
    const user = await this.userRepository.findByUsername(username);
    // Si utilisateur n'existe pas, retourner null
    if (!user) {
      return null;
    }
    // TODO: Comparer le password fourni avec le hash en BDD (bcrypt.compare)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    // Si ne correspond pas, retourner null
    if (!isPasswordValid) {
      return null;
    }
    // Si tout est bon, retourner l'utilisateur
    return user;
  }
}
module.exports = AuthService;