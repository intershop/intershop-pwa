/**
 * Extended lint-staged configuration for additional checks on staged files.
 * Run with: npm run check-lint-staged-extended
 *
 * This configuration is separate from the main lint-staged (pre-commit) hooks
 * because these checks take longer to run. Use this for manual verification
 * before pushing or creating a PR.
 *
 * Note: The npm script runs standard lint-staged first (formatting, linting, tests),
 * then runs these extended checks. This ensures fast feedback before running
 * time-intensive analysis.
 */
module.exports = {
  '*.ts': filenames => {
    const nonSpecFiles = filenames.filter(filename => !filename.endsWith('.spec.ts'));
    if (nonSpecFiles.length === 0) {
      return [];
    }
    // Pass all filenames as arguments in a single invocation for better performance
    const quotedFiles = nonSpecFiles.map(file => `"${file.replace(/"/g, '\\"')}"`).join(' ');
    return [`npx ts-node scripts/find-dead-code.ts ${quotedFiles}`];
  },
  '*.spec.ts': ['npm run cleanup-testbed --'],
};
