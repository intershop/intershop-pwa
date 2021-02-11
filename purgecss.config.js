module.exports = {
  content: ['dist/browser/index.html', 'dist/browser/*.js'],
  css: ['dist/browser/*.css'],
  output: 'dist/browser',
  safelist: [/(p|m)(l|r|x|y|t|b)?-[0-5]/],
};
