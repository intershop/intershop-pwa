<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Forms

- [Forms](#forms)
  - [File and Naming Conventions](#file-and-naming-conventions)
    - [Reusable Form Components](#reusable-form-components)
    - [Page Specific Form Components](#page-specific-form-components)
    - [Data Models](#data-models)
    - [Services](#services)
    - [Extensions](#extensions)
  - [Form Behavior](#form-behavior)
  - [General Rules](#general-rules)
    - [Usage of Formly, Template Driven and Reactive Forms](#usage-of-formly-template-driven-and-reactive-forms)
    - [Validators](#validators)
    - [Keep Templates and Type Script Code Simple](#keep-templates-and-type-script-code-simple)
  - [The Address Form as an Example of a Reusable Form](#the-address-form-as-an-example-of-a-reusable-form)
    - [How to Use the formly-address-form Component](#how-to-use-the-formly-address-form-component)
    - [How to Create a New Country Specific Form](#how-to-create-a-new-country-specific-form)

The Intershop PWA has switched to using [formly](https://formly.dev) to define and build forms.
We are still in the process of completely removing the old way of creating forms - if you are looking for documentation, refer to [older documentation](https://github.com/intershop/intershop-pwa/blob/0.27.0/docs/guides/forms.md).

## File and Naming Conventions

### Reusable Form Components

- Reusable form components are available as Formly field types that come with wrappers and extensions. You can find them in: _app/shared/formly/_ or _app/shared/formly-address-forms/components_
- These forms can be used as (sub)forms on arbitrary pages, e.g., there are address forms on registration page, checkout and _My Account_ pages.
- There are still some deprecated form components which you can find in _app/shared/forms/components/\<form-name>_ or _app/shared/address-forms/components/\<form-name>_

### Page Specific Form Components

- File location: _app/pages/\<page>/\<form-name>_
- Name: _\<form-name>-form.component.ts_
- These forms are only valid for a specific page. They are not reusable.
- Example: The credentials form on the registration page.

### Data Models

- File location for models and related classes: _app/core/models/\<object>_
- Model name: _\<object>.model.ts_
- Mapper file name: _\<object>.mapper.ts_
- Data (interface) file name: _\<object>.interface.ts_

### Services

- File location for global services: _core/services/\<object>_
- File location for module specific services: _\<module>/services/\<object>_
- Name: _\<object>.service.ts_

Usually, there should be no form specific data models.
If forms are related to persistent data, use/create generic data models for your forms, e.g., there should be only one data model for addresses.
Each model has its own service class(es).
In this class there are methods concerning the data model, e.g., updateAddress (address: Address)

### Extensions

If functionality is implemented as an extension, the form models and services can be found in the extensions folder:

- forms: _app/extensions/\<module>/pages/\<page>/\<form-name>_
- models: _app/extensions/\<module>/models/\<object>_
- services: _app/extensions/\<module>/services/\<object>_

## Form Behavior

- Labels of required form controls have to be marked with a red asterisk.
- After a form control is validated:
  - Its label gets green and a checked icon is displayed at the end of the control in case the input value is valid.
  - Its label gets red, an error icon is displayed at the end of the control and an error message is displayed below the control in case the input value is invalid.
- Form validation:
  - If a form is shown, there should not be any validation error messages.
  - If a user starts to enter data in an input field, this field will be validated immediately.
  - If the user presses the submit button, all form controls of the form are validated; the submit button will be disabled as long as there is any unhandled form error.

## General Rules

### Usage of Formly, Template Driven and Reactive Forms

In general, you should use Formly for creating your forms.
If a form is very simple (e.g. only one form input field without any special validation rules), it is also possible to use reactive or template driven forms as an exception.

### Validators

For the validation of the form input fields you can use Angular's [Built-in Validators](https://angular.io/api/forms/Validators).

If there is a need for special custom validators, use the class _app/shared/forms/validators/special-validators_ to write your own custom validators.

### Keep Templates and Type Script Code Simple

Formly allows to move almost all logic from the template to the component file.

Most form behaviour like displaying validation messages and status is already defined within the [`FormlyModule`](../../src/app/shared/formly/formly.module.ts).
Use the available field types and wrappers to construct your form in the component (see [Formly](./formly.md)).

## The Address Form as an Example of a Reusable Form

### How to Use the formly-address-form Component

The following steps describe how to use the formly-address-form component on your form (see also the example below):

Container component:

1. Create a `FormGroup`. It will be populated with an `address` control.

Container template:

1. Add a `<ish-formly-address-form>` component to your template
2. Pass your `FormGroup` via the `parentForm` input.
3. Optional: Define whether you want to display business customer addresses via the `businessCustomer` input.
4. Optional: Define whether you want to have the address form prefilled via the `prefilledAddress` input.

### How to Create a New Country Specific Form

Use the _address-form-configuration_ (or shortcut _afc_) schematic with your desired `countryCode` parameter.
This will create a new configuration under _src/app/shared/formly-address-forms/configurations_ and register it in the `formlyAddressFormsModule`.
An empty example configuration looks like this:

```typescript
...

@Injectable()
export class AddressFormEXConfiguration extends AddressFormConfiguration {
  countryCode = 'EX';

  constructor() {
    super();
  }

  getModel(model: Partial<Address> = {}): Partial<Address> {
    return {
      ...model,
    };
  }

  getFieldConfiguration(): FormlyFieldConfig[] {
    return [];
  }
}

```

- `getFieldConfiguration` and `getModel` will automatically be called by the `formly-address-form` component when a new country is selected. They are used to populate the address form. The `businessCustomer` attribute will be set automatically, based on what you passed to the `formly-address-form`. You can use it to adjust the configuration and model.

- Define the [field configuration](./formly.md) in `getFieldConfiguration`.

- Define the model for the country form in `getModel`. The method will be called with the previous model to make keeping field values between countries possible.

- use the `addressesFieldConfiguration` helper method to quickly reuse common address field configurations (see `standardFields`).
