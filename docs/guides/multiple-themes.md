<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Multiple Themes

It is possible to create multiple themes for the PWA.
This mechanism uses Angular configurations to replace files for each configuration.

The Intershop Progressive Web App currently uses multi-theming to provide different styles for the B2C an the B2B application.
The styles for B2C are defined in `src/styles/themes/default/style.scss`, for B2B in `src/styles/themes/blue/style.scss`.

Using schematics to start customizing Intershop Progressive Web App prepares a theme for your own custom styling. (See [Customizations - Start Customization](../guides/customizations.md#start-customization))

## Developing the PWA with only one Theme

To configure and run the Intershop PWA with only one project/brand specific theme start the customization by setting the `<brand>` theme as default theme.

```
node schematics/customization/add --default <brand>
```

This configures the `<brand>` theme as the only active theme in the `package.json`.
Besides that, all necessary configurations in `angular.json`, `tslint.json` and `override/schema.json` are made and a new `src/styles/themes/<brand>` folder and `environment.<brand>.ts` is created that should be used for further project development.

> **NOTE:** If only one theme is active, PM2 will run the theme-specific SSR process in cluster mode on the default port (see [Building Multiple Themes](../guides/ssr-startup.md#building-multiple-themes)).
