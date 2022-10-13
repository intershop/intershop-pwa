<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Multiple Themes

It is possible to create multiple themes for the PWA and the Intershop Progressive Web App currently uses multi-theming to provide different features, configurations and styles for the B2B an the B2C application.
This mechanism uses Angular configurations to replace files for each configuration.

The styles for B2B are defined in `src/styles/themes/b2b/style.scss`, for B2C in `src/styles/themes/b2c/style.scss`.

## Developing the PWA with several themes

Before using multiple themes, use schematics to set your default theme: [Customizations - Start Customization](../guides/customizations.md#start-customization).

Now add another theme **without** using `--default`:

```bash
node schematics/customization/add <theme-prefix>
```

This will add the theme to the according files and create styling specific folders and files, see [Customizations - Start Customization](../guides/customizations.md#start-customization).

# Further References

- [Guide - Customization - Theme Specific Overrides](./customizations.md#theme-specific-overrides)
