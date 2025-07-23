// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Altere esta linha para encontrar QUALQUER arquivo .spec.ts
  testMatch: ['<rootDir>/src/modules/**/*.spec.ts'], 
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};