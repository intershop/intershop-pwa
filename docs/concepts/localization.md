<!--
kb_concepts
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Localization

Intershop Progressive Web App uses the internationalization library ngx-translate for localization.
In addition the dependency to Angular's internationalization tools (i18n) is needed as a dependency for ng-bootstrap.

For more information refer to:

- [NGX-Translate: The internationalization (i18n) library for Angular](http://www.ngx-translate.com/)
- [Angular - Internationalization (i18n)](https://angular.io/guide/i18n)
- [ng-bootstrap Angular 9 support](https://github.com/ng-bootstrap/ng-bootstrap/issues/3537#issuecomment-586472803)

## Usage Examples

Although ngx-translate provides pipe and directive to localize texts, we want to use a pipe-only approach.

### Localization of Simple Text

To localize simple texts, just apply the `translate` pipe to the key:

**en.json**

```json
{ ...
  "header.wishlists.text": "Wishlist",
  ...
}
```

**\*.component.html**

```html
<span>{{ 'header.wishlists.text' | translate }}</span>
```

### Localization with Parameters

ngx-translate uses named parameters.
A map of parameters can be supplied as input to the `translate` pipe.

Localization file:

**en.json**

```json
{ ...
  "product.items.label": "{{0}} list items"
  ...
}
```

Parameter setting in HTML:

**\*.component.html**

```html
<div>{{ 'product.items.label' | translate:{'0': '8'} }}</div>
```

Parameter setting in component and usage in HTML:

**\* .component.ts**

```typescript
export class Component {
  param = '8';
  ...
```

**\*.component.html**

```html
<div>{{ 'product.items.label' | translate:{'0': param} }}</div>
```

---

### Localization with Pluralization

The PWA uses an [ICU Message Format](https://unicode-org.github.io/icu/userguide/format_parse/messages/) inspired way of supporting pluralization in translation keys.

In addition to using pluralization for specific numbers, the Intershop PWA supports the following [pluralization cases](https://unicode-org.github.io/cldr-staging/charts/latest/supplemental/language_plural_rules.html): `zero`, `one`, `two`, `few`, `many` and `other`.
You can use these cases in your pluralizable translation definitions like this:

```json
"shopping_cart.ministatus.items.text": "{{0, plural, one{# item} other{# items}}}",
```

Refer to [this explanation](https://www.gnu.org/savannah-checkouts/gnu/gettext/manual/html_node/Plural-forms.html) if you want to learn more about pluralization rules and why they are necessary for inclusive, multi-language applications.

Have a look at the spec for [PWATranslateCompiler](../../src/app/core/utils/translate/pwa-translate-compiler.spec.ts) for an overview of supported methods.

> :warning: Translations with large values (> 1000 characters) will not be compiled to improve performance. We recommend using CMS components instead. If you _really_ need to increase this limit, adapt the `MAX_COMPILATION_LENGTH` variable of [PWATranslateCompiler](../../src/app/core/utils/translate/pwa-translate-compiler.ts).

### Localization with Formatted Dates

The date pipe is used as formatter in texts with dates.

Localization file:

**en.json**

```json
{ ...
  "quote.edit.submitted.your_quote_expired.text": "Your quote expired at {{0}} {{1}}.",
  ...
}
```

Date pipe as formatter in HTML:

**\*.component.html**

```html
<span class="text-danger"
  >{{ 'quote.edit.submitted.your_quote_expired.text' | translate : { '0': quote['validToDate'] | ishDate: 'shortDate',
  '1': quote['validToDate'] | ishDate: 'mediumTime' } }}</span
>
```

### Localization of Text with HTML Tags

To skip the cleansing of the translated text (i.e., to insert HTML), the `innerHTML` binding has to be used.

Localization file:

**en.json**

```json
{ ...
  "common.header.contact_no.text": "<small>1300</small>  032 032",
  ...
}
```

Usage in HTML:

**\*.component.html**

```html
<span [innerHTML]="'common.header.contact_no.text' | translate"></span>
```

### Localization in the component(.ts) File

If you want to get the translation for a key within a component file, you have to:

- Inject `TranslateService` in the component
- Use the `get` method of the translation service, e.g., `translate.get('ID')`
- Use `subscribe` to assign the translation to the data array

**\*.component.ts**

```typescript
export class ProductTileComponent implements OnDestroy {
  ...
  private destroy$ = new Subject<void>();
  constructor(protected translate: TranslateService) {}
  ...
  toggleCompare() {
    this.compareToggle.emit();
    this.translate
      .get('compare.message.add.text', { 0: this.product.name })
      .pipe(takeUntil(this.destroy$))
      .subscribe((message: string) => {
        this.toastr.success(message);
      });
  }
  ...
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

See also: [How to translate words in the component(.ts) file?](https://github.com/ngx-translate/core/issues/835)

### Localization of Text with HTML-Anchors (Links) & OnClickHandlers (Callback-Functions)

Translated texts can contain html-anchors (e.g. link to external page or internal route) or onclick handlers.

Here we need the `ServerHtmlDirective`.
Pass the translated text and optional callbacks into `ishServerHtml`-directive.

To open a modalDialog by click use the callback-handler (1st anchor in example).

Links with internal route-target will routed by angular (2nd anchor in example).

Links with external target will navigate by browser (3rd anchor in example).

Localization file:

**en.json**

```json
{ ...
  "registration.tac_privacy_policy.label": "I agree to the <a callback=\"callbackTAC\">Terms & Conditions</a>. <a href=\"/home\">Home</a> <a href=\"https://google.com\" target=\"_blank\">Google</a>"
  ...
}
```

Usage in View (.html):

**\*.component.html**

```html
<span
  [ishServerHtml]="'registration.tac_privacy_policy.label' | translate"
  [callbacks]="{
    callbackTAC: showModalDialog(modalDialogTAC)
  }"
></span>

<ish-modal-dialog #modalDialogTAC>
  <!-- modal content -->
</ish-modal-dialog>
```

Usage in ViewModel (.ts)

**\*.component.ts**

```typescript
/* attention: generate callback-function with closure */
showModalDialog(dialog) {
  return () => {
    dialog.show();
  };
}
```

## Localization Files Generation

The idea is to use the existing localization properties files of the current Responsive Starter Store cartridges (or the localization files of a project) and convert them into the proper JSON files that can be used by ngx-translate.
For this purpose a [Standalone Java application](https://gitlab.intershop.de/ISPWA/ngx-translate-plugin) was implemented that can handle this conversion process.

In the current state of the Intershop Progressive Web App, the converted localization properties from _a_responsive_ (without _app_sf_responsive_b2b_ and _app_sf_responsive_costcenter_) were added and should be used within the HTML templates.

## ICM Localization Management

In case you want to change translation values without redeploying the PWA, it is possible to override the local `.json` files via ICM localization backoffice page.
Therefore generate `.xliff` files and upload them to ICM for further import processing.
Here is how:

1. Use the `npm run xliff` command to convert all localization files into separate `.xliff` files. The result is placed in `src/assets/xliff`.
2. Upload and import each `.xliff` file to ICM. Please mind below warning to select the correct application type and target locale.
3. Refer to [Localization Management](https://docs.intershop.com/icm/7.10/olh/icm/en/operation_maintenance/topic_localization_management.html) in the ICM online help for further details.

:warning: Make sure to select the correct application type for which you want to import generated XLIFF data.
This has to fit to your PWA environment.

:warning: The generated `.xliff` files prefix translation keys with `pwa-`.
This allows to enable easy filtering.
The prefixes will be removed when the translations are loaded into the PWA.

## External Localization Sources

The Intershop PWA presents no native way to use a different external source for loading translations in JSON format.
The pull request [feat: allow translations to be loaded from an external source](https://github.com/intershop/intershop-pwa/pull/927) presents a way how such an external service could be integrated and configured in the Intershop PWA.

## Localization File Clean Up Process

Localization files require constant maintenance to keep them up to date.
They should not contain any localizations that are no longer required by the project sources or functionality.
The PWA project provides a script that helps to keep the localization files clean.
The script is saved under `scripts/clean-up-localizations.js` and can be run with `npm run clean-localizations`.

The script removes all unused localization keys from the default localization file `src/assets/i18n/en_US.json` and sorts the remaining keys.
In a second step it generates localization files for the other available language files under `src/assets/i18n` by using the localization keys found for the default language.
Localization keys that are not available in these files - meaning they have no translation - are logged.

Not explicitly used localization keys, such as dynamic created keys or error keys from REST calls, are handled separately.
Their patterns are searched in all the localization keys of the default localization file and all matches will be included in the new cleaned up file.

Global patterns can be added to the [`clean-up-localizations` script](../../scripts/clean-up-localizations.js);

```javascript
// ADDITIONAL GLOBAL PATTERNS HAVE TO BE ADDED HERE
const regExps = [/.*\.error.*/i];
```

Localization patterns can also be defined where they are used.
Add a comment with the keyword `keep-localization-pattern:` to the code to register a specific pattern for preservation.

Javascript

```javascript
// keep-localization-pattern: ^account\.costcenter\.budget\.period\.value.*
```

HTML

```html
<!-- keep-localization-pattern: ^account\.login\..*\.message$ -->
```

The clean up script is integrated in the full check run (`npm run check`) and will also be performed in continuous integration on the whole code base.

The cleanup script also supports a build argument: `npm run clean-localizations --build`.
When supplied, an Angular build with source maps is performed to limit the project to sources that are actually used before performing a cleanup.
With this, project customizations can clean-up keys from features that are not required in the project.

## Extend Locales

To learn how languages other than English, German and French can be used in the progressive web app, see [Configuration - Extend Localization](./configuration.md#extend-locales).
