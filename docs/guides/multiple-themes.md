<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Multiple Themes

It is possible to create multiple themes for styling.
The Intershop Progressive Web App currently uses multi-theming to provide different styles for the B2C an the B2B application.
The styles for B2C are defined in _/src/styles/themes/default/style.scss_, for B2B in _/src/themes/styles/blue/style.scss_.

Using schematics to start customizing Intershop Progressive Web App prepares a theme for your own custom styling. (See [Customizations - Start Customization](../guides/customizations.md#start-customization))

You can also manually prepare a new theme:

1. Create a custom theme folder (named _custom_) under _/src/themes/styles/_ with a copy of _styles.scss_ and _variables.scss_ from an available theme.

2. Reference the styling theme in the _angular.json_, so that the theme bundle will be extracted during the compiling process

   ```json
   ...
   "styles": [
     ...
     {
       "input": "src/styles/themes/custom/style.scss",
       "lazy": true,
       "bundleName": "custom"
     },
     ...
   ]
   ...
   ```

3. Set the theme to be used in your application settings in the _environment.ts_

```typescript
export const environment: Environment = {
  ...
  theme: 'custom',
};
```
