const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Chemin vers l'application Next.js
  dir: './',
});

// Configuration Jest personnalisée
const customJestConfig = {
  // Ajouter plus de configurations de configuration ici si nécessaire
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // Gérer les importations d'alias
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/src/(.*)$': '<rootDir>/src/$1',
    // Gérer les importations de CSS, images, etc.
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  // Couverture de code
  collectCoverage: true,
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
  // Répertoires à ignorer
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
  ],
};

// createJestConfig est exporté de cette façon pour s'assurer que next/jest peut charger la configuration Next.js
module.exports = createJestConfig(customJestConfig); 