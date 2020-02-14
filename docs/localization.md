# Localization

Intershop Progressive Web App uses a mix of Angular's internationalization tools (i18n) and the internationalization library ngx-translate for localization.

For more information refer to:

* [Angular - Internationalization (i18n)](https://angular.io/guide/i18n)
* [NGX-Translate: The internationalization (i18n) library for Angular](http://www.ngx-translate.com/)

## Usage Examples

Although ngx-translate provides pipe and directive to localize texts, we want to use a pipe-only approach.

### Localization of Simple Text

To localize simple texts, just apply the `translate` pipe to the key:

**en.json**

````json
{ ...
  "header.wishlists.text": "Wishlist",
  ...
}
````

**\*.component.html**

````html
<span class="hidden-xs">{{ 'header.wishlists.text' | translate }}</span>
````

### Localization with Parameters

ngx-translate uses named parameters. A map of parameters can be supplied as input to the `translate` pipe.

Localization file:

**en.json**

````json
{ ...
  "product.items.label": "{{0}} list items"
  ...
}
````

Parameter setting in HTML:

**\*.component.html**

````html
<div>{{ 'product.items.label' | translate:{'0': '8'} }}</div>
````

Parameter setting in component and usage in HTML:

**\* .component.ts**

````typescript
export class Component {
  param = '8';
  ...
````

**\*.component.html**

````html
<div>{{ 'product.items.label' | translate:{'0': param} }}</div>
````

### Localization with Pluralization

For more information refer to:

* [Feature: pluralization](https://github.com/ngx-translate/core/issues/150)
* [Angular - I18nPluralPipe](https://angular.io/api/common/I18nPluralPipe)

Localization file:

**en.json**

````json
{ ...
  "product.items.label": {
    "=0":"0 items",
    "=1": "1 item",
    "other": "# items"},
  ...
}
````

Parameter setting in HTML:

**\*.component.html**

````html
<div>{{ 8 | i18nPlural: ( 'product.items.label' | translate ) }}</div>
````

Parameter setting in component and usage in HTML:

**\*component.ts**

````typescript
export class Component {
  products = ['product1','product2','product3'];
  ...
````

**\*.component.html**

````html
<div>
  {{ products.length | i18nPlural: {'=0': 'product.items.label.none','=1': 'product.items.label.singular','other': 'product.items.label.plural'} | translate:{'0': products.length} }}
</div>
````

### Localization with Formatted Dates

The date pipe is used as formatter in texts with dates.

Localization file:

**en.json**

````json
{ ...
  "quote.edit.submitted.your_quote_expired.text": "Your quote expired at {{0}} {{1}}.",
  ...
}
````

Date pipe as formatter in HTML:

**\*.component.html**

````html
<span class="text-danger">{{
  'quote.edit.submitted.your_quote_expired.text'
    | translate
      : {
          '0': quote['validToDate'] | ishDate: 'shortDate',
          '1': quote['validToDate'] | ishDate: 'mediumTime'
        }
}}</span>
````

### Localization of Text with HTML Tags

To skip the cleansing of the translated text (i.e., to insert HTML), the `innerHTML` binding has to be used.

Localization file:

**en.json**

````json
{ ...
  "common.header.contact_no.text": "<small>1300</small>  032 032",
  ...
}
````

Usage in HTML:

**\*.component.html**

````html
<span [innerHTML]="'common.header.contact_no.text' | translate"></span>
````

### Localization in the component(.ts) File

If you want to get the translation for a key within a component file, you have to:

* Inject `TranslationService` in the component
* Use the `get` method of the translation service, e.g., `translate.get('ID')`
* Use `subscribe` to assign the translation to the data array  

**\*.component.ts**

````typescript
export class ProductTileComponent implements OnDestroy {
  ...
  destroy$ = new Subject();
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
  }
}
````

See also: https://github.com/ngx-translate/core/issues/835

### Localization of Text with HTML-Anchors (Links) & OnClickHandlers (Callback-Functions)

Translated texts can contain html-anchors (e.g. link to external page or internal route) or onclick handlers.

Here we need the `ServerHtmlDirective`. Pass the translated text and optional callbacks into `ishServerHtml`\-directive.

To open a modalDialog by click use the callback-handler (1st anchor in example).

Links with internal route-target will routed by angular (2nd anchor in example).

Links with external target will navigate by browser (3rd anchor in example).

Localization file:

**en.json**

````json
{ ...
  "registration.tac_privacy_policy.label": "I agree to the <a callback=\"callbackTAC\">Terms & Conditions</a>. <a href=\"/home\">Home</a> <a href=\"https://google.com\" target=\"_blank\">Google</a>"
  ...
}
````

Usage in View (.html):

**\*.component.html**

````html
<span
  [ishServerHtml]="'registration.tac_privacy_policy.label' | translate"
  [callbacks]="{
    callbackTAC: showModalDialog(modalDialogTAC)
  }"
></span>

<ish-modal-dialog #modalDialogTAC>
  <!-- modal content -->
</ish-modal-dialog>
````

Usage in ViewModel (.ts)

**\*.component.ts**

````typescript
/* attention: generate callback-function with closure */
showModalDialog(dialog) {
  return () => {
    dialog.show();
  };
}
````

## Localization Files Generation

The idea is to use the existing localization properties files of the current Responsive Starter Store cartridges (or the localization files of a project) and convert them into the proper JSON files that can be used by ngx-translate. For this purpose a [Gradle plugin](https://gitlab.intershop.de/ISPWA/ngx-translate-plugin) was implemented that can handle this conversion process.

Plugin source as zip file: [ngx-translate-plugin-master.zip](ngx-translate-plugin-master.zip)

In the current state of the Intershop Progressive Web App the converted localization properties from _a\_responsive_ (without _app\_sf\_responsive_\__b2b_ and _app\_sf\_responsive\_costcenter_) were added and should be used within the HTML templates.

## Extend Locales

To learn how languages other than English, German and French can be used in the progressive web app, see [Configuration - Extend Localization](./configuration.md#extend-locales).
