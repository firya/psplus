module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  setupFiles: ["<rootDir>/.jest/setEnvVars.js"],
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
};
