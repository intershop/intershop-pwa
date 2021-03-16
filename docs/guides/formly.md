<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Formly

- [Formly](#formly)
  - [Overview](#overview)
    - [Formly-Form Component](#formly-form-component)
    - [FormlyFieldConfig](#formlyfieldconfig)
  - [Customizing Form Logic](#customizing-form-logic)
    - [Custom Field Types](#custom-field-types)
    - [Custom Wrappers](#custom-wrappers)
    - [Custom Extensions](#custom-extensions)
    - [Extras](#extras)
    - [Formly Config Service](#formly-config-service)
  - [Testing Formly](#testing-formly)
    - [Testing Custom Types](#testing-custom-types)
    - [Testing Wrappers](#testing-wrappers)
  - [How to Configure Formly](#how-to-configure-formly)
  - [Intershops Custom Formly Parts](#intershops-custom-formly-parts)
    - [Field Types](#field-types)
    - [Wrappers](#wrappers)
    - [Extensions](#extensions)

## Overview

[Formly](https://formly.dev) is a dynamic form library.
In Formly, forms are defined as an array of field configurations and a corresponding model which is two-way bound and contains the form values.

### Formly-Form Component

To render a form using Formly, the `<formly-form>` component is used.
Simply insert it into your template and pass the following inputs:

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
For a comprehensive overview of properties, refer to the [official documentation](https://formly.dev/guide/properties-options).
A configuration for a form containing only a basic input field could be defined like this:

```typescript
const fields: FormlyFieldConfig[] = [
  {
    type: 'ish-input-field',
    key: 'example-input',
    templateOptions: {
      required: true,
      label: 'Input Field Label',
    },
  },
];
```

## Customizing Form Logic

There are many ways to change the behaviour of a form and its fields.
Custom field types, wrappers, extensions and extras are registered in [formly.module.ts](../../src/app/shared/formly/formly.module.ts) using the `forRoot()` function.
For more information about what can be done in the `forRoot()` function, refer to the official documentation and [`ConfigOption`](https://github.com/ngx-formly/ngx-formly/blob/main/src/core/src/lib/models/config.ts#L49) type definition.

### Custom Field Types

To define a custom field type, create a component that extends `FieldType`.
This component will have full access to all information related to the field and form - access the fields `templateOptions` via the `to` attribute.
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
<input [type]="to.type" [formControl]="formControl" [formlyAttributes]="field" />
```

Register the custom type in the `forRoot()` function:

```typescript
FormlyModule.forRoot({
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
      {{ to.label | translate }}
    </label>
    <ng-template #fieldComponent></ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ExampleLabelWrapperComponent extends FieldWrapper {}
```

Register the custom wrapper in the `forRoot()` function.
It is possible to supply field types with default wrappers that will always be applied, even if the corresponding `FormlyFieldConfig` does not contain any wrappers:

```typescript
FormlyModule.forRoot({
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
This way, you can implement certain behaviours that are shared by all fields without repeating yourself.
A simple extension that ensures a `label` attribute is always set could look like this:

```typescript
export const labelDefaultValueExtension: FormlyExtension = {
  prePopulate(field: FormlyFieldConfig): void {
    field.templateOptions = {
      ...field.templateOptions,
      label: field.templateOptions.label ?? 'Default Label',
    };
  },
};
```

Register the custom extension in the `forRoot()` function:

```typescript
FormlyModule.forRoot({
  extensions: [{ name: 'labelDefaultValueExtension', extension: labelDefaultValueExtension }],
  // ...
});
```

### Extras

The `extras` argument is passed to the `forRoot()` function to customize additional Formly behaviour.
Refer to the [type definition](https://github.com/ngx-formly/ngx-formly/blob/fe2314d5f50ff61d46af01175b158dc3f9fd4e4e/src/core/src/lib/models/config.ts#L55) for more information.

### Formly Config Service

You can inject the `FormlyConfigService` to change different Formly configurations on the fly as well as get information about the current configuration.

## Testing Formly

Since Formly types and wrappers do not function independently, they have to be tested in conjunction with the Formly library.
To facilitate this, the `formly/dev/testing` folder contains a `FormlyTestingComponents` module with multiple components to be imported in tests.

- `FormlyTestingContainerComponent` contains a `<formly-form>` component and a setter method that enables easy configuration of the test configuration.
- `FormlyTestingExampleComponent` is a type that contains an empty input field and can be used as an example field type.
- `FormlyTestingFieldgroupExampleComponent` is a type that renders all configs in the `fieldGroup` attribute of the field.

In addition, to test components or pages that use Formly, import the `FormlyTestingModule`.
It defines and exports a FormlyModule with preconfigured dummy field types and wrappers that match the `FormlyModule`.

### Testing Custom Types

To test a custom type, you need to create a `FormlyTestingContainerComponent`, configure `FormlyModule` for testing and set an appropriate testing configuration.
You can find a simple example of a custom type test in [text-input.field.component.spec.ts](../../src/app/shared/formly/types/text-input-field/text-input-field.component.spec.ts).

### Testing Wrappers

To test custom wrappers, create a `FormlyTestingContainerComponent` component, configure the `FormlyModule` with an example type (for example `FormlyTestingExampleComponent`) and the wrapper and set an appropriate testing configuration.

You can find a simple example of a wrapper test in [textarea-description-wrapper.component.spec.ts](../../src/app/shared/formly/wrappers/textarea-description-wrapper/textarea-description-wrapper.component.spec.ts).

## How to Configure Formly

There are multiple ways to adapt Formly for projects or development on the main repository.

If you implement widely used functionality that can be used in multiple components and different pages, add your field types, wrappers or extensions to `src/app/shared/formly` and register them in the `formly.module.ts`.

If you need specific fields or behaviour that is not used everywhere, it would not be a good idea to pollute `formly.module.ts`.
Instead, register your logic in the relevant module using `FormlyModule.forChild()`.
This will first configure Formly according to the standard module and then add your local configuration.
This way, it is easy to wrap locally used components in field types and program specific behaviours that are not required anywhere else.
Refer to the [`registration.page.module`](../../src/app/pages/registration/registration-page.module.ts) for an example of a local Formly configuration.

## Intershops Custom Formly Parts

A lot of functionality is already implemented in the Intershop PWAs `FormlyModule`.
Refer to the tables below for an overview of these parts.

### Field Types

| Name                 | Description                                                                                  | Relevant templateOptions                                                                                                      |
| -------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| ish-text-input-field | Basic input field, supports text type                                                        | ----                                                                                                                          |
| ish-select-field     | Basic select field                                                                           | `options`: `{ value: any; label: string}[]` or Observable. `placeholder`: Translation key or string for the default selection |
| ish-textarea-field   | Basic textarea field                                                                         | `cols`& `rows`: Specifies the textareas dimensions                                                                            |
| ish-checkbox-field   | Basic checkbox input                                                                         | ----                                                                                                                          |
| ish-email-field      | Text input field that automatically adds an e-mail validator and error message               | ----                                                                                                                          |
| ish-password-field   | Password input field that automatically adds a password validator and error message          | ----                                                                                                                          |
| ish-fieldset-field   | Wraps fields in a `<fieldset>` tag for styling                                               | `fieldsetClass`: Class that will be added to the fieldset tag. `childClass`: Class that will be added to the child div.       |
| ish-captcha-field    | Includes the `<ish-lazy-captcha>` component and adds the relevant `formControls` to the form | `topic`: Topic that will be passed to the Captcha component.                                                                  |

### Wrappers

| Name                           | Functionality                                                                                                                                                 | Relevant templateOptions                                                                                                     |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| form-field-horizontal          | Adds a label next to the field and adds red styling for invalid fields.                                                                                       | `labelClass`& `fieldClass`: Classes that will be added to the label or field `<div>`                                         |
| form-field-checkbox-horizontal | Adds a label for a checkbox field, adds red styling and error messages for invalid fields. Uses `validators.validation` and `validation.messages` properties. | `labelClass`& `fieldClass`: Classes that will be added to the label or the outer field `<div>`                               |
| validation                     | Adds validation icons and error messages to the field. Uses `validators.validation` and `validation.messages` properties.                                     | `showValidation`: `(field: FormlyFieldConfig) => boolean`: optional, used to determine whether to show validation checkmarks |
| textarea-description           | Adds a description to textarea fields, including the amount of remaining characters.                                                                          | `maxLength`: Specifies the maximum length to be displayed in the message.                                                    |
| decription                     | Adds a custom description to any field                                                                                                                        | `customDescription`: `string` or `{key: string; args: any}` that will be translated                                          |
| tooltip                        | Adds a tooltip to a field. Includes `<ish-field-tooltip>` component.                                                                                          | `tooltip`: `{ title?: string; text: string; link: string }` that defines the different tooltip texts.                        |
| input-addon                    | Adds a prepend or append text to a field, e.g. a currency or unit.                                                                                            | `addonLeft?`: `{ text: string; }, addonRight?: {text: string}` that defines the addon texts.                                 |

### Extensions

| Name                     | Functionality                                                                   | Relevant templateOptions                                                   |
| ------------------------ | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| critical-default-values  | Sets required attributes on `FormlyFieldConfigs` that are missing them.         | ----                                                                       |
| hide-if-empty            | Hides fields of type `ish-select-field` that have an empty `options` attribute. | `options`: Used to determine emptiness.                                    |
| translate-select-options | Automatically translates option labels and adds a placeholder option.           | `placeholder`: used to determine whether to set placeholder and its text   |
| post-wrappers            | Appends wrappers to the default ones defined in the `FormlyModule`              | `postWrappers`: `string[]` of extensions to append to the default wrappers |
