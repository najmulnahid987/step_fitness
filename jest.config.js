module.exports = {
  preset: 'jest-expo',
  testMatch: ['<rootDir>/src/tests/**/*.test.[jt]s?(x)'],
  moduleNameMapper: {
    '\\.css$': '<rootDir>/src/tests/fixtures/styleMock.js',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
