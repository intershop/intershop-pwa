// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');
require('jasmine-reporters');

exports.config = {
  allScriptsTimeout: 30000,
  specs: ['./src/**/*.e2e-spec.ts'],
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: ['--headless', '--disable-gpu', '--window-size=1024,768'],
    },
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {},
  },
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.e2e.json'),
    });
    jasmine.getEnv().addReporter(
      new SpecReporter({
        spec: {
          displayStacktrace: false,
          displayDuration: true,
          displayErrorMessages: true,
        },
        summary: {
          displayStacktrace: true,
        },
        // stacktrace: {
        //   filter: (inp) => {
        //     return inp.split(' at ')
        //     .filter(i => /\/e2e\//.test(i))
        //     .map(i => i.split('/e2e/')[1].trim())
        //     .reduce((a, b) => a + '\n' + b)
        //   }
        // }
      })
    );
    var reporters = require('jasmine-reporters');
    jasmine.getEnv().addReporter(
      new reporters.JUnitXmlReporter({
        savePath: 'build/test-results/protractor',
        consolidateAll: false,
        filePrefix: 'TEST-',
      })
    );
    setTimeout(function() {
      browser.driver
        .executeScript(function() {
          return {
            width: window.screen.availWidth,
            height: window.screen.availHeight,
          };
        })
        .then(function(result) {
          browser.driver
            .manage()
            .window()
            .setSize(result.width, result.height);
        });
    });
  },
};
