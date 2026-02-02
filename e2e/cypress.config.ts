import { defineConfig } from 'cypress';
import failedLog from 'cypress-failed-log/src/failed';
import { install as installLogToOutput } from 'cypress-log-to-output';

export default defineConfig({
  viewportWidth: 1024,
  viewportHeight: 1500,
  video: false,
  defaultCommandTimeout: 8000,
  requestTimeout: 30000,
  responseTimeout: 30000,
  chromeWebSecurity: false,
  allowCypressEnv: false,
  e2e: {
    setupNodeEvents(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {
      on('task', {
        failed: failedLog(),
      });
      installLogToOutput(on);
      return config;
    },
    baseUrl: 'http://localhost:4200',
    specPattern: 'cypress/e2e/**/*.e2e-spec.ts',
    testIsolation: false,
  },
});
