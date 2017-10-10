// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
const path = require('path');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular/cli'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-html-reporter'),
      require('karma-junit-reporter'),
      require('karma-spec-reporter'),
      require('karma-phantomjs-launcher'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular/cli/plugins/karma')
    ],
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly' ],
      dir: path.join(__dirname, 'build/reports/coverage/%browser%'),
      fixWebpackSourcePaths: true
    },
    angularCli: {
      environment: 'dev'
    },
    junitReporter: {
      outputDir: 'build/test-results/karma', // results will be saved as $outputDir/$browserName.xml
      outputFile: 'TEST-karma.xml', // if included, results will be saved as $outputDir/$browserName/$outputFile
//      suite: '', // suite will become the package name attribute in xml testsuite element
      useBrowserName: false, // add browser name to report and classes names
//      nameFormatter: undefined, // function (browser, result) to customize the name attribute in xml testcase element
//      classNameFormatter: undefined, // function (browser, result) to customize the classname attribute in xml testcase element
//      properties: {}, // key value pair of properties to add to the <properties> section of the report
//      xmlVersion: null // use '1' if reporting to be per SonarQube 6.2 XML format
    },
    htmlReporter: {
      outputDir: 'build/reports/karma', // where to put the reports
//      templatePath: null, // set if you moved jasmine_template.html
      focusOnFailures: true, // reports show failures on start
      namedFiles: false, // name files instead of creating sub-directories
//      pageTitle: 'karma', // page title for reports; browser info by default
      urlFriendlyName: false, // simply replaces spaces with _ for files/dirs
//      reportName: 'report-summary-filename', // report summary filename; browser info by default
      // experimental
      preserveDescribeNesting: false, // folded suites stay folded
      foldAll: false, // reports start folded (only with preserveDescribeNesting)
    },
    specReporter: {
      maxLogLines: 3, // limit number of lines logged per test
      suppressErrorSummary: true, // do not print error summary
      suppressFailed: false, // do not print information about failed tests
      suppressPassed: true, // do not print information about passed tests
      suppressSkipped: false, // do not print information about skipped tests
      showSpecTiming: false, // print the time elapsed for each spec
      failFast: false // test would finish with error when a first fail occurs.
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};
