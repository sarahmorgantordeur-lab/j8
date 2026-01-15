// TODO: On intercepte le module 'ioredis'
jest.mock("ioredis", () => {
  // ioredis est une classe, on retourne donc un constructeur
  return jest.fn().mockImplementation(() => ({
    // Simulation des événements (.on('connect'), .on('error'))
    on: jest.fn(),
    // TODO: Simuler .get(key) -> Doit retourner une Promesse résolue avec null
    get: jest.fn().mockResolvedValue(null),
    // TODO: Simuler .set(key, value) -> Doit retourner une Promesse "OK"
    set: jest.fn().mockResolvedValue("OK"),
    // Fermeture propre
    quit: jest.fn(),
    disconnect: jest.fn(),
    status: "ready",
  }));
});
