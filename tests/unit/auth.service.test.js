// 1. IMPORT : On importe la CLASSE à tester (pas le container !)
const AuthService = require( '../../src/services/AuthService');


// Mock de bcryptjs (attention, le service utilise bcryptjs, pas bcrypt)
jest.mock('bcryptjs');
const bcrypt = require('bcryptjs');

// 2. DESCRIBE : Le dossier qui regroupe les tests
describe('validateUser', () => {
  // 3. VARIABLES : On déclare les mocks et le service
  let authService;
  let mockUserRepository;

  // 4. BEFORE EACH : On remet tout à neuf avant chaque test
  beforeEach(() => {
    jest.clearAllMocks(); // Nettoyer tous les mocks avant chaque test
    mockUserRepository = { findByUsername: jest.fn() }; // Création du Mock
    authService = new AuthService(mockUserRepository); // Injection du Mock dans le service
  })

  // 5. IT : Un test unique (scénario)
  test(`Retourne l'utilisateur si username et mot de passe sont corrects`, async () => {
    const fakeUser = {
      id: 1,
      username: 'john',
      password: 'hashedPassword'
    }

    // 1️⃣ L'utilisateur existe
    // ARRANGE
    mockUserRepository.findByUsername.mockResolvedValue(fakeUser)
    // 2️⃣ Mot de passe correct
    bcrypt.compare.mockResolvedValue(true)

    // ACT
    const result = await authService.validateUser('john', 'password123')

    // ASSERT
    expect(result).toEqual(fakeUser)
    expect(mockUserRepository.findByUsername).toHaveBeenCalledWith('john')
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword')
  })

  // 5. IT : Un test unique (scénario)
  test(`Retourne null si l’utilisateur n’existe pas`, async () => {
    // 1️⃣ Aucun utilisateur trouvé
    // ARRANGE
    mockUserRepository.findByUsername.mockResolvedValue(null)

    // ACT
    const result = await authService.validateUser('unknown', 'password123')

    // ASSERT
    expect(result).toBeNull()
    expect(mockUserRepository.findByUsername).toHaveBeenCalledWith('unknown')
  })

  // 5. IT : Un test unique (scénario)
  test('Retourne null si le mot de passe est incorrect', async () => {
    const fakeUser = {
      id: 1,
      username: 'john',
      password: 'hashedPassword'
    }

    // 1️⃣ Utilisateur trouvé
    // ARRANGE
    mockUserRepository.findByUsername.mockResolvedValue(fakeUser)
    // 2️⃣ Mot de passe incorrect
    bcrypt.compare.mockResolvedValue(false)

    // ACT
    const result = await authService.validateUser('john', 'wrongPassword')

    // ASSERT
    expect(result).toBeNull()
    expect(bcrypt.compare).toHaveBeenCalled()
  });
});

// Tests pour la méthode register
describe('register', () => {
  let authService;
  let mockUserRepository;

  beforeEach(() => {
    mockUserRepository = {
      findByUsername: jest.fn(),
      create: jest.fn()
    };
    authService = new AuthService(mockUserRepository);
    jest.clearAllMocks();
  });

  test('devrait créer un nouvel utilisateur avec un mot de passe hashé', async () => {
    // ARRANGE
    mockUserRepository.findByUsername.mockResolvedValue(null); // L'utilisateur n'existe pas
    const hashedPassword = 'hashedPassword123';
    bcrypt.hash.mockResolvedValue(hashedPassword);
    const newUser = { id: 1, username: 'newuser', password: hashedPassword };
    mockUserRepository.create.mockResolvedValue(newUser);

    // ACT
    const result = await authService.register('newuser', 'password123');

    // ASSERT
    expect(mockUserRepository.findByUsername).toHaveBeenCalledWith('newuser');
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(mockUserRepository.create).toHaveBeenCalledWith({
      username: 'newuser',
      password: hashedPassword
    });
    expect(result).toEqual(newUser);
  });

  test('devrait lancer une erreur si username est vide', async () => {
    // ACT & ASSERT
    await expect(authService.register('', 'password'))
      .rejects
      .toThrow('Username et password requis');
  });

  test('devrait lancer une erreur si password est vide', async () => {
    // ACT & ASSERT
    await expect(authService.register('user', ''))
      .rejects
      .toThrow('Username et password requis');
  });

  test('devrait lancer une erreur si les deux champs sont vides', async () => {
    // ACT & ASSERT
    await expect(authService.register('', ''))
      .rejects
      .toThrow('Username et password requis');
  });

  test('devrait lancer une erreur si le username est déjà pris', async () => {
    // ARRANGE
    mockUserRepository.findByUsername.mockResolvedValue({ id: 1, username: 'deja_pris' });

    // ACT & ASSERT
    await expect(authService.register('deja_pris', 'password'))
      .rejects
      .toThrow('Username déjà pris');
  });
});
