module.exports = {
  stories: ['../src/**/*.stories.ts'],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-notes/register',
    '@storybook/addon-viewport/register',
    '@storybook/addon-storysource',
    '@storybook/addon-knobs/register',
  ],
};
