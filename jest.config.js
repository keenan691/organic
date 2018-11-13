module.exports = {
  testEnvironment: 'node',
  setupTestFrameworkScriptFile: "./node_modules/jest-enzyme/lib/index.js",
  setupTestFrameworkScriptFile: "./__tests__/setup/setupEnzyme.js",
  testPathIgnorePatterns: ["./__tests__/setup/"],
  setupFiles: ["enzyme-react-16-adapter-setup"],
  preset: "react-native",
  transform: {
    "^.+\\.js?$": "babel-jest",
    "^.+\\.ts?$": "babel-jest",
    "^.+\\.tsx?$": "babel-jest",
  },
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node",
  ],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|js|tsx)x?$',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
  ],
};
