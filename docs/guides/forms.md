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
    - [Keep Templates Simple](#keep-templates-simple)
- [Further References](#further-references)

The Intershop PWA has switched to using [formly](https://formly.dev) to define and build forms.
Refer to our [Formly Documentation](./formly.md) for information.
The overwhelming majority of old components and directives has been deprecated as of release 1.0.
If you are looking for documentation, refer to [older documentation](https://github.com/intershop/intershop-pwa/blob/0.27.0/docs/guides/forms.md).

## File and Naming Conventions

### Reusable Form Components

- Form components are available as Formly field types that come with wrappers and extensions. You can find them in: _app/shared/formly/_ or _app/shared/formly-address-forms/components_. Refer to our [Formly Documentation](./formly.md) for more information.
- It is possible to define formly field configurations that can be reused anywhere in the PWA. You can find them in: _app/shared/formly/field-library_. Refer to the [Field Library docs](./field-library.md) for more information.
- These forms can be used as (sub)forms on arbitrary pages, e.g., there are address forms on registration page, checkout and _My Account_ pages.

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

### Keep Templates Simple

Formly allows moving almost all logic from the template to the component file.

Most form behavior like displaying validation messages and status is already defined within the [`FormlyModule`](../../src/app/shared/formly/formly.module.ts).
Use the available field types and wrappers to construct your form in the component (see [Formly](./formly.md)).

# Further References

- [Formly documentation](./formly.md)
- [Field Library documentation](./field-library.md)
