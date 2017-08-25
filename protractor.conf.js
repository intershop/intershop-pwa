// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');
require('jasmine-reporters');

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './e2e/protractor/**/*.e2e-spec.ts'
  ],
  capabilities: {
    'browserName': 'chrome',
    chromeOptions: {
      args: [ "--headless", "--disable-gpu", "--window-size=1024,768" ]
    }
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  onPrepare() {
    require('ts-node').register({
      project: 'e2e/protractor/tsconfig.e2e.json'
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
    var reporters = require('jasmine-reporters');
    jasmine.getEnv().addReporter(new reporters.JUnitXmlReporter({
      savePath: 'build/test-results/protractor',
      consolidateAll: false,
      filePrefix: 'TEST-'
    }));
    setTimeout(function() {
      browser.driver.executeScript(function() {
          return {
              width: window.screen.availWidth,
              height: window.screen.availHeight
          };
      }).then(function(result) {
          browser.driver.manage().window().setSize(result.width, result.height);
      });
    });
  }
};
