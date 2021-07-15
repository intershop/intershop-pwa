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
The styles for B2C are defined in `src/styles/themes/default/style.scss`, for B2B in `src/themes/styles/blue/style.scss`.

Using schematics to start customizing Intershop Progressive Web App prepares a theme for your own custom styling. (See [Customizations - Start Customization](../guides/customizations.md#start-customization))
