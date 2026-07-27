const js = require("@eslint/js");
const globals = require("globals");
const jestPlugin = require("eslint-plugin-jest");
const prettierConfig = require("eslint-config-prettier");
const plugin = require("eslint-plugin-jest");

module.exports = [
  // Regras recomendadas padrão do ESlint
  js.configs.recommended,

  // Configuração para o código da aplicação
  {
    files: ["src/**/*.js", "app.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        ...globals.node, //Reconhece "require", "module", "process", etc.
      },
    },
    rules: {
      "no-unused-vars": "warn", // Avisa sobre variáveis não usadas
      "no-console": "off", // Permitimos console.log para debug
      eqeqeq: "error", // Obriga o uso de ===
      "prefer-const": "error", // Obriga usar const quando a variável nunca é retribuída
    },
  },

  // Configuração específica para os arquivos de teste
  {
    files: ["tests/**/*.js"],
    plugins: { jest: jestPlugin },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest, // Reconhece describe, test, expect, beforeEach, etc.
      },
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
    },
  },

  // Sempre por último: desliga regras de formatação que conflitam com o Prettier
  prettierConfig,
];
