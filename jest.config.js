module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/app.js', // On exclut app.js du coverage car difficile à tester complètement
  ],
  setupFiles: ['<rootDir>/jest.setup.js']
};
