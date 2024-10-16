<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Formly

<!-- cSpell: disable -->

- [Formly](#formly)
  - [Overview](#overview)
    - [Formly-Form Component](#formly-form-component)
    - [FormlyFieldConfig](#formlyfieldconfig)
  - [Customizing Form Logic](#customizing-form-logic)
    - [Custom Field Types](#custom-field-types)
    - [Custom Wrappers](#custom-wrappers)
    - [Custom Extensions](#custom-extensions)
    - [Validation](#validation)
    - [Extras](#extras)
    - [Formly Config Service](#formly-config-service)
  - [Testing Formly](#testing-formly)
    - [Testing Custom Types](#testing-custom-types)
    - [Testing Wrappers](#testing-wrappers)
  - [How to Configure Formly](#how-to-configure-formly)
  - [Intershop's Custom Formly Parts](#intershops-custom-formly-parts)
    - [Field Types](#field-types)
    - [Wrappers](#wrappers)
    - [Extensions](#extensions)

<!-- cSpell: enable -->

## Overview

[Formly](https://formly.dev) is a dynamic form library.
In Formly, forms are defined as an array of field configurations and a corresponding model which is two-way bound and contains the form values.

### Formly-Form Component

To render a form using Formly, the `<formly-form>` component is used.
Insert it into your template and pass the following inputs:

- **fields**: An array of type `FormlyFieldConfig[]`
- **model**: An object containing key-value-pairs for each form field
- **form**: An optional `FormGroup` or `FormArray` that Formly will automatically populate according to the provided configuration
- **options**: An optional parameter with some special, useful properties

Your template should look something like this:

```html
<formly-form [form]="form" [fields]="fields" [model]="model"> </formly-form>
```

### FormlyFieldConfig

The `FormlyFieldConfig` class allows you to define a number of parameters that change the way a Formly field behaves.
For a comprehensive overview of properties, refer to the [official documentation](https://formly.dev/docs/guide/properties-options).
A configuration for a form containing only a basic input field could be defined like this:

```typescript
const fields: FormlyFieldConfig[] = [
  {
    type: 'ish-text-input-field',
    key: 'example-input',
    props: {
      required: true,
      label: 'Input Field Label',
    },
  },
];
```

## Customizing Form Logic

There are many ways to change the behavior of a form and its fields.
Custom field types, wrappers, extensions and extras are registered in [formly.module.ts](../../src/app/shared/formly/formly.module.ts) using the `forChild()` function.
For more information about what can be done in the `forChild()` function, refer to the official documentation and [`ConfigOption`](https://github.com/ngx-formly/ngx-formly/blob/main/src/core/src/lib/models/config.ts#L49) type definition.
Note that we use the `forChild` method here instead of the normal `forRoot` approach.
This is because the only difference between the two approaches is that `forRoot` additionally provides the `FormlyConfig` service which is provided in root anyways.
Using `forChild` allows us to solve some injection issues in lazy loaded modules.

If you need to - for some reason - completely override the Formly configuration in a module lower in the injection tree, feel free to use the `forRoot` method and thus provide a fresh instance of the `FormlyConfig` service.

### Custom Field Types

To define a custom field type, create a component that extends `FieldType`.
Hook up the form element with the `formControl` and `formlyAttributes` inputs.
An example field type could look like this:

```typescript
// example-input-field.component.ts
@Component({
  selector: 'example-input-field',
  templateUrl: './example-input-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleInputFieldComponent extends FieldType {
  formControl: FormControl;
}
```

```html
<!--  example-input-field.component.html -->
<input [type]="props.type" [formControl]="formControl" [formlyAttributes]="field" />
```

Register the custom type in the `formly.module.ts` `forChild()` function:

```typescript
FormlyModule.forChild({
  types: [{ name: 'example-input-field', component: ExampleInputFieldComponent }],
  // ...
});
```

### Custom Wrappers

Formly allows fields to be wrapped in any number of wrapper components.
These wrappers are components that extend `FieldWrapper` and contain a `<ng-template #fieldComponent></ng-template>` tag where the field (or further, nested wrappers) will be inserted.
A simple example wrapper that adds a label to the field could look like this:

```typescript
@Component({
  selector: 'example-label-wrapper',
  template: `
    <label [attr.for]="id">
      {{ props.label | translate }}
    </label>
    <ng-template #fieldComponent></ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ExampleLabelWrapperComponent extends FieldWrapper {}
```

Register the custom wrapper in the `forChild()` function.
It is possible to supply field types with default wrappers that will always be applied, even if the corresponding `FormlyFieldConfig` does not contain any wrappers:

```typescript
FormlyModule.forChild({
  wrappers: [{ name: 'example-label-wrapper', component: ExampleLabelWrapperComponent }],
  types: [
    {
      name: 'example-input-field',
      component: ExampleInputFieldComponent,
      wrappers: ['example-label-wrapper'],
    },
  ],
  // ...
});
```

### Custom Extensions

Formly extensions is an experimental feature to implement cross-cutting logic in your forms.
A Formly extension is an object of type [`FormlyExtension`](https://github.com/ngx-formly/ngx-formly/blob/main/src/core/src/lib/models/config.ts#L7) that contains one or multiple functions that will automatically be called during the construction of the Formly form, once for each field.
This way, you can implement certain behaviors that are shared by all fields without repeating yourself.
A simple extension that ensures a `label` attribute is always set could look like this:

```typescript
export const labelDefaultValueExtension: FormlyExtension = {
  prePopulate(field: FormlyFieldConfig): void {
    field.props = {
      ...field.props,
      label: field.props.label ?? 'Default Label',
    };
  },
};
```

Register the custom extension in the `forChild()` function:

```typescript
FormlyModule.forChild({
  extensions: [{ name: 'labelDefaultValueExtension', extension: labelDefaultValueExtension }],
  // ...
});
```

### Validation

There are many options when it comes to [adding custom validation to formly forms](https://formly.dev/docs/guide/validation).

The PWA comes with some predefined custom validators which can be found in [special-validators.ts](../../src/app/shared/forms/validators/special-validators.ts).
These can be added directly to the `validators.validation` property of a `FormlyFieldConfig`.
Make sure to also add the corresponding error message to the `validation` property.

Alternatively, validation can be defined as a key-value pair directly in the `validation` property.
However, adding validators here requires a different format:

```typescript
(control: AbstractControl, field: FormlyFieldConfig) => boolean) |
  {
    expression: (control: AbstractControl, field: FormlyFieldConfig) => boolean,
    message: ValidationMessageOption['message'],
  };
```

To automatically convert the special validators to this format, you can import and use the [`formlyValidation`](../../src/app/shared/forms/validators/special-validators.ts) helper function.
It is a higher order function that takes an error name and a validator function and returns a formly-usable function.

### Extras

The `extras` argument is passed to the `forChild()` function to customize additional Formly behavior.
Refer to the [type definition](https://github.com/ngx-formly/ngx-formly/blob/fe2314d5f50ff61d46af01175b158dc3f9fd4e4e/src/core/src/lib/models/config.ts#L55) for more information.

### Formly Config Service

You can inject the `FormlyConfigService` to change different Formly configurations on the fly as well as get information about the current configuration.

## Testing Formly

Since Formly types and wrappers do not function independently, they have to be tested in conjunction with the Formly library.
To facilitate this, the `formly/dev/testing` folder contains a `FormlyTestingComponents` module with multiple components to be imported in tests.

- `FormlyTestingContainerComponent` contains a `<formly-form>` component and a setter method that enables easy configuration of the test configuration.
- `FormlyTestingExampleComponent` is a type that contains an empty input field and can be used as an example field type.
- `FormlyTestingFieldgroupExampleComponent` is a type that renders all configs in the `fieldGroup` attribute of the field.

In addition, **to test components or pages that use Formly, import the `FormlyTestingModule`**.
It defines and exports a FormlyModule with pre-configured dummy field types and wrappers that match the `FormlyModule`.

### Testing Custom Types

To test a custom type, you need to create a `FormlyTestingContainerComponent`, configure `FormlyModule` for testing and set an appropriate testing configuration.
You can find a simple example of a custom type test in [text-input.field.component.spec.ts](../../src/app/shared/formly/types/text-input-field/text-input-field.component.spec.ts).

### Testing Wrappers

To test custom wrappers, create a `FormlyTestingContainerComponent` component, configure the `FormlyModule` with an example type (for example `FormlyTestingExampleComponent`) and the wrapper, and set an appropriate testing configuration.

You can find a simple example of a wrapper test in [maxlength-description-wrapper.component.spec.ts](../../src/app/shared/formly/wrappers/maxlength-description-wrapper/maxlength-description-wrapper.component.spec.ts).

## How to Configure Formly

There are multiple ways to adapt Formly for projects or development on the main repository.

If you implement widely used functionality that can be used in multiple components and different pages, add your field types, wrappers, or extensions to `src/app/shared/formly` and register them in the `formly.module.ts`.

If you need specific fields or behavior that is not used everywhere, it would not be a good idea to pollute `formly.module.ts`.
Instead, register your logic in the relevant module using `FormlyModule.forChild()`.
This will first configure Formly according to the standard module and then add your local configuration.
This way, it is easy to wrap locally used components in field types and program specific behaviors that are not required anywhere else.
Refer to the [`registration.page.module`](../../src/app/pages/registration/registration-page.module.ts) for an example of a local Formly configuration.

## Intershop's Custom Formly Parts

A lot of functionality is already implemented in the Intershop PWA's `FormlyModule`.
Refer to the tables below for an overview of these parts.

### Field Types

- Template option `inputClass`: These CSS class(es) will be added to all input/select/textarea/text tags.
- Template option `ariaLabel`: Adds an aria-label to all input/select/textarea tags.

| Name                        | Description                                                                                                                                | Relevant properties                                                                                                                                                                                                                                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ish-text-input-field        | Basic input field, supports all text types                                                                                                 | `type`: 'text (default),'email','tel','password'. `mask`: input mask for a needed pattern (see [ngx-mask](https://www.npmjs.com/package/ngx-mask) for more information)                                                                                                                                             |
| ish-select-field            | Basic select field                                                                                                                         | `options`: `{ value: any; label: string}[]` or Observable. `placeholder`: Translation key or string for the default selection                                                                                                                                                                                       |
| ish-textarea-field          | Basic textarea field                                                                                                                       | `cols` & `rows`: Specifies the dimensions of the textarea                                                                                                                                                                                                                                                           |
| ish-checkbox-field          | Basic checkbox input                                                                                                                       | `title`: Title for a checkbox                                                                                                                                                                                                                                                                                       |
| ish-email-field             | E-mail input field that automatically adds an e-mail validator and error messages                                                          | ----                                                                                                                                                                                                                                                                                                                |
| ish-password-field          | Password input field that automatically adds a password validator and error messages                                                       | ----                                                                                                                                                                                                                                                                                                                |
| ish-phone-field             | Phone number input field that automatically adds a phone number validator and error messages                                               | ----                                                                                                                                                                                                                                                                                                                |
| ish-fieldset-field          | Wraps fields in a `<fieldset>` tag for styling                                                                                             | `fieldsetClass`: Class that will be added to the fieldset tag. `childClass`: Class that will be added to the child div. `legend`: Legend element that will be added to the fieldset. Use the value as the legend text. `legendClass`: Class that will be added to the legend tag.                                   |
| ish-captcha-field           | Includes the `<ish-lazy-captcha>` component and adds the relevant `formControls` to the form                                               | `topic`: Topic that will be passed to the Captcha component                                                                                                                                                                                                                                                         |
| ish-radio-field             | Basic radio input                                                                                                                          | ----                                                                                                                                                                                                                                                                                                                |
| ish-plain-text-field        | Only display the form value                                                                                                                | ----                                                                                                                                                                                                                                                                                                                |
| ish-html-text-field         | Only display the form value as html                                                                                                        | ----                                                                                                                                                                                                                                                                                                                |
| ish-date-picker-field       | Basic datepicker                                                                                                                           | `minDays`: Computes the minDate by adding the minimum number of days allowed to the current date. `maxDays`: Computes the maxDate by adding the maximum number of days allowed to the current date. `isSatExcluded`: Specifies if Saturdays can be disabled. `isSunExcluded`: Specifies if Sundays can be disabled. |
| ish-date-range-picker-field | Datepicker with range                                                                                                                      | `minDays`: Computes the minDate by adding the minimum number of days allowed to the current date. `maxDays`: Computes the maxDate by adding the maximum number of days allowed to the current date. `startDate`: The start date. `placeholder`: Placeholder that displays the date format in the input field.       |
| ish-number-field            | Basic number input field for smaller Integer numbers, with `+` and `-` buttons (use `ish-text-input-field` with `mask` for larger numbers) | `min`, `max` and `step` input configuration is considered by the in-/decrease buttons                                                                                                                                                                                                                               |
| ish-information-field       | Include any freestyle text within a Formly generated form (HTML content is supported)                                                      | Provide text via `localizationKey` or just plain `text` and adapt the styling via `containerClass`                                                                                                                                                                                                                  |

### Wrappers

| Name                           | Functionality                                                                                                                                                                                                                                                                                        | Relevant properties                                                                                                                                                                                                                                                                                           |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| form-field-horizontal          | Adds a label next to the field, adds a `required` marker, and adds red styling for invalid fields.                                                                                                                                                                                                   | `labelClass` & `fieldClass`: Classes that will be added to the label or field `<div>`. `labelNoTranslate`: Prevents the label from being translated (e.g., if it is not a translation key). `hideRequiredMarker`: Hides the required marker while still validating a `required` field.                        |
| form-field-checkbox-horizontal | Adds a label for a checkbox or radio field, adds a `required` marker, adds red styling and error messages for invalid fields. Adds a title for a checkbox if provided. Uses `validators.validation` and `validation.messages` properties. Adds a tooltip behind the label, see also tooltip wrapper  | `labelClass`, `titleClass` & `fieldClass`: Classes that will be added to the label, title, or the outer field `<div>`. `labelNoTranslate`, `titleNoTranslate`: Prevents the label or title from being translated. `hideRequiredMarker`: Hides the required marker while still validating a `required` field.  |
| validation                     | Adds validation icons and error messages to the field. Uses `validators.validation` and `validation.messages` properties.                                                                                                                                                                            | `showValidation`: `(field: FormlyFieldConfig) => boolean`: optional, used to determine whether to show validation check marks                                                                                                                                                                                 |
| maxlength-description          | Adds a description to textarea fields, including the amount of remaining characters (added to textarea by default, can be used for other fields as well).                                                                                                                                            | `maxLength`: Specifies the maximum length to be displayed in the message (required). `maxLengthDescription`: Translation key for the maxlength description (default: 'textarea.max_limit' ).                                                                                                                  |
| description                    | Adds a custom description to any field                                                                                                                                                                                                                                                               | `customDescription`: `string` or `{key: string; args: any}` that will be translated                                                                                                                                                                                                                           |
| tooltip                        | Adds a tooltip to a field. Includes `<ish-field-tooltip>` component.                                                                                                                                                                                                                                 | `tooltip`: `{ title?: string; text: string; link: string }` that defines the different tooltip texts                                                                                                                                                                                                          |
| input-addon                    | Adds a prepended or appended text to a field, e.g., a currency or unit.                                                                                                                                                                                                                              | `addonLeft?`: `{ text: string \| Observable<string>; }, addonRight?: {text: string \| Observable<string>}` that defines the addon texts                                                                                                                                                                       |

### Extensions

| Name                     | Functionality                                                                   | Relevant properties                                                                                                                                                                            |
| ------------------------ | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| hide-if-empty            | Hides fields of type `ish-select-field` that have an empty `options` attribute. | `options`: used to determine emptiness.                                                                                                                                                        |
| translate-select-options | Automatically translates option labels and adds a placeholder option.           | `options`: options whose labels will be translated. `placeholder`: used to determine whether to set placeholder and its text.                                                                  |
| translate-placeholder    | Automatically translates the placeholder value.                                 | `placeholder`: value to be translated.                                                                                                                                                         |
| post-wrappers            | Appends wrappers to the default ones defined in the `FormlyModule`              | `postWrappers`: `<string \| { wrapper: string, index: number}>[]` of extensions to append to the default wrappers, optional index to specify at which position the wrapper should be inserted. |
