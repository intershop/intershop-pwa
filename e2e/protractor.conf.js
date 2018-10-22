// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {
  allScriptsTimeout: 60000,
  specs: ['./src/**/*.e2e-spec.ts'],
  suites: {
    local: './src/**/*.local.e2e-spec.ts',
    remote: './src/**/*.remote.e2e-spec.ts',
  },
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
    defaultTimeoutInterval: 60000,
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
          displayPending: true,
        },
        summary: {
          displayStacktrace: true,
          displayPending: false,
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
        savePath: './reports/e2e/',
        consolidateAll: true,
        filePrefix: 'junit',
      })
    );
    const Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');
    jasmine.getEnv().addReporter(
      new Jasmine2HtmlReporter({
        savePath: './reports/e2e/',
        screenshotsFolder: 'images',
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
