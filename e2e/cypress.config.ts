import { defineConfig } from 'cypress';

export default defineConfig({
  viewportWidth: 1024,
  viewportHeight: 1500,
  video: false,
  videoUploadOnPasses: false,
  defaultCommandTimeout: 8000,
  requestTimeout: 30000,
  responseTimeout: 30000,
  chromeWebSecurity: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {
      /* eslint-disable-next-line @typescript-eslint/no-var-requires */
      return require('./cypress/plugins/index.js')(on, config);
    },
    baseUrl: 'http://localhost:4200',
    specPattern: 'cypress/e2e/**/*.e2e-spec.ts',
  },
});
