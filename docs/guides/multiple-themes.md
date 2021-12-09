<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Multiple Themes

It is possible to create multiple themes for the PWA.
This mechanism uses Angular configurations to replace files for each configuration.

The Intershop Progressive Web App currently uses multi-theming to provide different styles for the B2B an the B2C application.
The styles for B2B are defined in `src/styles/themes/b2b/style.scss`, for B2C in `src/styles/themes/b2c/style.scss`.

Using schematics to start customizing Intershop Progressive Web App prepares a theme for your own custom styling. (See [Customizations - Start Customization](../guides/customizations.md#start-customization))

## Developing the PWA with only one Theme

To configure and run the Intershop PWA with only one project/brand specific theme start the customization by setting the `<brand>` theme as default theme.

```
node schematics/customization/add --default <brand>
```

This configures the `<brand>` theme as the only active theme in the `package.json`.
Besides that, all necessary configurations in `angular.json`, `tslint.json` and `override/schema.json` are made and a new `src/styles/themes/<brand>` folder and `environment.<brand>.ts` is created that should be used for further project development.

> **NOTE:** If only one theme is active, PM2 will run the theme-specific SSR process in cluster mode on the default port (see [Building Multiple Themes](../guides/ssr-startup.md#building-multiple-themes)).

# Further References

- [Guide - Customization - Theme Specific Overrides](./customizations.md#theme-specific-overrides)
