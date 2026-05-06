const { globSync } = require('glob');
const { ESLint } = require('eslint');

(async function main() {
  const files = process.argv.length > 2 ? process.argv.splice(2) : globSync('src/**/*.ts');

  const eslint = new ESLint({
    fix: true,
    overrideConfig: {
      root: true,
      overrides: [
        {
          files: ['*.ts'],
          plugins: ['ish-custom-rules'],
          rules: {
            'ish-custom-rules/ordered-imports': 'error',
          },
        },
      ],
    },
  });

  const results = await eslint.lintFiles(files);

  await ESLint.outputFixes(results);
})();
