import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    specPattern: 'projects/form/cypress/e2e/spec.cy.ts'
  },

  component: {
    devServer: {
      framework: "angular",
      bundler: "webpack",
    },
    specPattern: "**/*.cy.ts",
  },
});
