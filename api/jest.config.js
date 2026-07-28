// eslint-disable-next-line no-undef
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json"],
  coverageProvider: "v8",
  setupFiles: ["dotenv/config"],
  transformIgnorePatterns: ["/node_modules/"],
  collectCoverage: false,
  collectCoverageFrom: ["src/**/*.{js,ts,tsx}", "!src/**/*.d.ts", "!src/**/index.*"],
  verbose: true,
};
