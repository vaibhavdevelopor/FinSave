export default {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverageFrom: ["app.js", "server.js", "services/**/*.js", "lib/**/*.js"],
};
