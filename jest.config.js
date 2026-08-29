module.exports = {
  testEnvironment: 'node',

  transformIgnorePatterns: ['/node_modules/', '/dist/'],
  cache: false,

  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleFileExtensions: ['js', 'ts', 'json', 'node'],
  testMatch: ['**/test/**/*.test.js'],
};
