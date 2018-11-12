const jscpdHtmlReporter = require('jscpd-html-reporter');

jscpdHtmlReporter({
  outDir: 'reports/jscpd', // Output directory for report. Relative to project root.
  outFileName: 'index.html', // Name of final html file generated.
  files: 'src/**/*.*', // Glob specifying files to check for duplicity.
  exclude: ['**/*.spec.ts', 'src/environments/**'], // Globs which should be excluded from the report.
  minLines: 4, // Minimum lines to qualify as duplicate.
  minTokens: 70, // Minimum tokens to qualify as duplicate.
  blame: true, // Set to true to add information of author with each duplicate line (for Git).
});
