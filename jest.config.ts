// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Altere esta linha para encontrar QUALQUER arquivo .spec.ts
  testMatch: ['<rootDir>/src/modules/**/*.spec.ts'], 
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], 
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};