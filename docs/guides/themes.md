<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Themes

## Multiple Themes

It is possible to create multiple themes for the PWA and the Intershop Progressive Web App currently uses multi-theming to provide different features, configurations and styles for the B2B an the B2C application.
This mechanism uses Angular configurations to replace files for each configuration.

The styles for B2B are defined in `src/styles/themes/b2b/style.scss`, for B2C in `src/styles/themes/b2c/style.scss`.

## Developing the PWA with several themes

Before using multiple themes, use schematics to set your default theme: [Customizations - Start Customization](./customizations.md#start-customization).

Now add another theme **without** using `--default`:

```bash
node schematics/customization/add <theme-prefix>
```

This will add the theme to the according files and create styling specific folders and files, see [Customizations - Start Customization](./customizations.md#start-customization).

## Configurable Theme

> **Note**
> To use this feature the feature toggle `extraConfiguration` needs to be enabled.

> **Warning**
> Multiple themes (e.g. for different channels or brands) increase the build and deployment time of the PWA SSR container.
> That is okay for a limited number of themes (2-3) but will become problematic the more the number grows.
> A solution to this problem could be to use only one theme that can be configured at runtime for the different channels/brands.

With the Intershop PWA 4.1 the two standard themes `b2b` and `b2c` where refactored so the `b2c` theme could be changed into a configurable theme.
Configurable in this context means adaptable at runtime [using CSS custom properties (CSS variables)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties).
This way only one configurable theme is needed at build time that can then be adapted through an ICM backoffice CMS _Configuration_ component on channel or application level.
This is different to compiling different themes at build time e.g. with SCSS variables and using them for different channels through the [Multi Site Configuration](./multi-site-configurations.md).

The difference between the default `b2b` theme and the configurable `b2c` theme lies in the way the SCSS variables are initialized.
The underlying `.scss` files are the same for the standard Intershop PWA.
While the `b2b` theme uses a [`variables.scss`](../../src/styles/themes/b2b/variables.scss) that directly assigns property values to the SCSS variables the `b2c` theme assigns CSS custom properties to the SCSS variables (see [`variables.scss`](../../src/styles/themes/b2c/variables.scss)).

`b2b - variables.scss`

```
$logo: url('/assets/themes/b2b/img/logo.png');
$logo-width: 114px;
...
$font-family-regular: 'robotoregular', 'Helvetica', 'Arial', sans-serif;
...
$CORPORATE-PRIMARY: #688dc3; // BLUE
$CORPORATE-SECONDARY: darken($CORPORATE-PRIMARY, 10%);
$CORPORATE-LIGHT: lighten($CORPORATE-PRIMARY, 10%);
$CORPORATE-DARK: darken($CORPORATE-PRIMARY, 20%);
$CORPORATE-SHADOW: #7f9ecc80; // with alpha transparency
...
$text-color-corporate: $CORPORATE-PRIMARY;
```

`b2c - variables.scss`

```
$logo: var(--logo);
$logo-width: var(--logo-width);
...
$font-family-regular: var(--font-family-regular);
...
$CORPORATE-PRIMARY: var(--corporate-primary);
$CORPORATE-SECONDARY: var(--corporate-secondary);
$CORPORATE-LIGHT: var(--corporate-light);
$CORPORATE-DARK: var(--corporate-dark);
$CORPORATE-SHADOW: var(--corporate-shadow);
...
$text-color-corporate: var(--text-color-corporate);
```

These CSS custom properties are then assigned actual values in the [`properties.scss`](../../src/styles/themes/b2c/properties.scss).

`b2c - properties.scss`

```
:root {
  --logo: url('/assets/themes/b2c/img/logo.png');
  --logo-width: 114px;
...
  --font-family-regular: 'robotoregular', 'Helvetica', 'Arial', sans-serif;
...
  --corporate-primary: #ff6d00; // ORANGE
  --corporate-secondary: #cc5700;
  --corporate-light: #ff8a33;
  --corporate-dark: #994100;
  --corporate-shadow: #ff832680; // with alpha transparency
...
  --text-color-corporate: var(--corporate-primary);
}
```

And with the introduction of such CSS custom properties the values of these properties can be overridden at runtime, in our case through defining them as inline styles at the `html` tag.

```
<html style="--logo: url(https://localhost/INTERSHOP/static/WFS/inSPIRED-inTRONICS_Business-Site/rest/inSPIRED-inTRONICS_Business-rest/en_US/config/logo.png); --logo-width: 260px; -font-family-regular: Open+Sans; --corporate-primary: #688dc3;" lang="en-US">
```

> **Note**
> SCSS color calculations do not work with CSS custom properties, they need real values.
> Therefore SCSS functions like `darken()` and `lighten()` do not work with values like `var(--corporate-primary)`.
> The standard Intershop PWA SCSS styling was adapted to no longer use such functions.
> Unfortunately the underlying Bootstrap styling still uses color calculations based on the SCSS variables `$primary` and `$secondary`.
> For that reason these variables have to be set with actual values so the default Bootstrap stylings can be generated.
> If necessary such Bootstrap generated styles with non fitting colors then need to be overridden in project styles (see [`button.scss`](../../src/styles/global/buttons.scss)).

### ICM Requirements

To configure the configurable `b2c` theme within the ICM backend a specific _Configuration_ CMS include (`include.configuration.pagelet2-Include`) with an assigned _Configuration_ CMS component (`component.configuration.pagelet2-Component`) is needed.
The sources are available with ICM 7.10.40.3 (in the `app_sf_pwa_cm` cartridge) but can be integrated in any earlier ICM version as well.

With the _Configuration_ component in place the theme configuration can be changed via CMS on organization, channel or application level.

### Configuration Parameters

The _Configuration_ component provides several configuration parameters for the PWA.

Regarding CSS custom properties for a configurable theme it provides options to change the _Logo_, _Logo (mobile)_ and _CSS Properties_ in general.
Besides that additional _CSS Fonts_ can be integrated that can then be referenced in the _CSS Properties_.

Independent from the used theme being configurable via CSS custom properties the _Configuration_ Component can be used to change the _Favicon_ or an additional _CSS File_ can be referenced or additional _CSS Styling_ can be added.

Also the used feature set can be changed with the _Features_ and _Additional Features_ parameters and additional custom _Configuration JSON_ can be provided for any specific customization needs.

| Parameters          | Values               | Description                                                                                                                                                                                                           |
| ------------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Logo                | image reference      | Brand Logo, can be a reference to an ICM managed image (uploaded and selected), an absolute URL (`https://`) or with the prefix `file://` pointing to an image in the PWA assets folder                               |
| Logo (mobile)       | image reference      | Brand Logo on mobile devices (see "Logo" description)                                                                                                                                                                 |
| Favicon             | image reference      | Storefront Favicon (see "Logo" description)                                                                                                                                                                           |
| CSS Properties      | key-value pairs      | CSS custom properties as multiline key (name without `--`) value pairs separated by a `:`, configurable properties can be found in `properties.scss`, example: `corporate-primary:#688dc3`                            |
| CSS Fonts           | font URL             | CSS Font references (multiline) (e.g. `https://fonts.googleapis.com/css2?family=Open+Sans`)                                                                                                                           |
| CSS File            | URL                  | CSS style file reference, either ICM managed (uploaded and selected, could even be an unzipped `branding.zip`), an absolute URL (`https://`) or with the prefix `file://` pointing to a file in the PWA assets folder |
| CSS Styling         | URL                  | CSS style definitions, added via a `style` tag to the HTML `head`                                                                                                                                                     |
| Features            | comma separated list | Enabled PWA features, a comma separated features list, if empty, all default features of the theme will be enabled                                                                                                    |
| Additional Features | comma separated list | Additional PWA features, a comma separated list of features added to the default feature set of the used theme                                                                                                        |
| Configuration JSON  | JSON                 | Additional Configuration data in JSON notation, will be available in the PWA state, accessible via `appFacade.extraSetting$(path)`                                                                                    |

### Configuration JSON

The _Configuration_ CMS component provides a generic _Configuration JSON_ parameter that can be used to add any structured data in JSON format for the specific needs of the PWA customization in projects without the need to change/extend the CMS component model.
This could be used for example to provide additional tracking configuration information.
The data is available as JSON in the PWA state and can be easily accessed via a facade method.

```
this.appFacade.extraSetting$<string>('foo.bar')
```

If additional document manipulation needs to be done for the customization the `setThemeConfiguration` method of the `configuration.service.ts` is the current reference.
Please be aware of the [DOM manipulations advices](./angular-component-development.md#dom-manipulations).

If the _Configuration JSON_ does not suite the requirements for customizations good enough it is always possible to extend the Pagelet model of the _Configuration_ component in the ICM project sources.

### Developing with the Configurable Theme

> **Note**
> To use this feature the feature toggle `extraConfiguration` needs to be enabled.

For testing the configurable `b2c` theme, even without an ICM that provides the needed CMS include and pagelet, we provide mock data that can be used instead.

Add this line to your `environment.development.ts`.

```javascript
apiMockPaths: ['^cms/includes/include.configuration.pagelet2-Include'],
```

Also the `icmChannel` and the wanted `features` set should be set in the `environment.development.ts` if the ones from `environment.b2c.ts` are not what you want.

To start the PWA with the `b2c` theme run

```bash
ng s -c=b2c,development
```

To experiment with the CMS _Configuration_ component parameters you can edit the [`src\assets\mock-data\cms\includes\include.configuration.pagelet2-Include\get.json`](../../src/assets/mock-data/cms/includes/include.configuration.pagelet2-Include/get.json).

To develop a custom configurable theme one needs to copy the `b2c` theme as base of the custom theme instead of using the default `b2b` theme.

# Further References

- [Guide - Customizations - Theme Specific Overrides](./customizations.md#theme-specific-overrides)
- [Using CSS custom properties (variables)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
