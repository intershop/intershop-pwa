<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Field Library

<!-- cSpell: disable -->

- [Field Library](#field-library)
  - [Overview](#overview)
  - [The Field Library](#the-field-library)
    - [Retrieving Configurations](#retrieving-configurations)
    - [Retrieving Configuration Groups](#retrieving-configuration-groups)
    - [Defining Your Own Configurations \& Configuration Groups](#defining-your-own-configurations--configuration-groups)
      - [Defining a FieldLibraryConfiguration](#defining-a-fieldlibraryconfiguration)
      - [Defining a FieldLibraryConfigurationGroup](#defining-a-fieldlibraryconfigurationgroup)
  - [Automatic Field Replacement Using the '#' Pseudo-Type](#automatic-field-replacement-using-the--pseudo-type)
  - [Address Forms](#address-forms)
    - [Using the formly-address-form Component](#using-the-formly-address-form-component)
    - [Creating a New Country Specific Form](#creating-a-new-country-specific-form)
  - [Standard Reusable Form Configurations](#standard-reusable-form-configurations)
- [Further References](#further-references)

<!-- cSpell: enable -->

## Overview

Formly naturally facilitates the reuse of forms through its configuration-based, typescript-first approach.
In the Intershop PWA, there are a number of ways to enhance this reusability and provide developers with the ability to centrally define common form field configurations that can be used throughout the app.
This article showcases the different ways this can be done.

> [!NOTE]
> To understand this documentation, basic knowledge of [Formly](./formly.md) is required.

## The Field Library

To enable working with reusable form configurations, the `FieldLibrary` is an integral part of the PWA.
Imagine every configuration object to be a book in this library.
It can be injected anywhere you need to work with formly and provides a simple interface with which to retrieve standard `FormlyFieldConfig`s.

### Retrieving Configurations

To retrieve a predefined `FormlyFieldConfig`, use the `getConfiguration` method.
A basic example could look like this:

```typescript
constructor(private fieldLibrary: FieldLibrary){}
...

this.fields = [
  this.fieldLibrary.getConfiguration('firstName'),
  this.fieldLibrary.getConfiguration('lastName')
]
```

To use a predefined configuration but modify some properties, the `getConfiguration` method also takes an optional `override` argument.
Use it to define any changes you want to make to the configuration.
The properties defined in `override` will be deeply merged into the standard configuration, overwriting duplicate properties but not affecting others.

For example, you can use the standard `firstName` field but change the label like this:

```typescript
this.fieldLibrary.getConfiguration('firstName', {
  props: {
    label: 'New Label',
  },
});
```

### Retrieving Configuration Groups

Similar to configurations, _configuration groups_ are predefined groups of fields that will often be used together.
They are defined in the `field-library.module.ts` (refer to [the next section](#defining-your-own-configurations--configuration-groups) for details).

You can retrieve a configuration group with the `getConfigurationGroup` method, which returns a `FormlyFieldConfig[]`.

For example, the following code snippet will return an array of configurations containing `title`, `firstName`, `lastName` and `phoneHome` field configurations per default:

```typescript
this.fields = this.fieldLibrary.getConfigurationGroup('personalInfo');
```

Just like the singular `getConfiguration` method, it is possible to override any `FormlyFieldConfig`s provided by `getConfigurationGroup`. <br/> To do so, use the optional `overrides` property.
Because `getConfigurationGroup` returns multiple field configurations, you will have to specify which configurations to modify.

For example, the following code snippet will return the `personalInfo` configuration group but modify `firstName` to not be required anymore and update the `lastName` field's label:

```typescript
this.fieldLibrary.getConfigurationGroup('personalInfo', {
  firstName: {
    props: {
      required: false,
    },
  },
  lastName: {
    props: {
      label: 'new and improved label',
    },
  },
});
```

### Defining Your Own Configurations & Configuration Groups

Whether you are customizing the PWA in a project or contributing to the standard, you might need to expand the field library with further field configurations.
These provided configurations & configurations groups will be processed by the `FieldLibrary` and made accessible via the relevant methods.

All configurations are registered in the `field-library.module.ts`.

#### Defining a FieldLibraryConfiguration

To define a new reusable field configuration, use the `field-library-configuration` schematic.
It will generate a `.configuration.ts` file and register the configuration in the `providers` array of the module. <br/> Populate the file with whatever logic you need and let the `getConfiguration()` method return a `FormlyFieldConfig`.
You can return a static value or inject services and create a dynamic, smart configuration.

> [!NOTE]
> A field library configuration is a typescript file. If you need to adapt these configurations in a project, consider using a [theme-specific override](./customizations.md#theme-specific-overrides) for maximum flexibility.

#### Defining a FieldLibraryConfigurationGroup

To define a new reusable configuration group, provide a new value for the `FIELD_LIBRARY_CONFIGURATION_GROUP` injection token.
The value has to conform to the `ConfigurationGroup` type.<br/>

```typescript
// ConfigurationGroup type
type ConfigurationGroup = { id: string; shortcutFor: string[] };

// field-library.module.ts
...
{
  provide: FIELD_LIBRARY_CONFIGURATION_GROUP,
  useValue: { id: 'exampleGroup', shortcutFor: ['firstName', 'lastName', 'companyName'] },
  multi: true,
},
...
```

Use the `id` property to define the id through which developers will access the configuration group. <br/>
The `shortcutFor` property defines which configurations the group will be mapped to.
You can introduce dynamic behavior by using [factory providers](https://angular.io/guide/dependency-injection-providers#using-factory-providers) to generate `ConfigurationGroup` objects.

## Automatic Field Replacement Using the '#' Pseudo-Type

For an even cleaner development experience, it is possible to reuse formly field configurations without using the `FieldLibrary`, saving a lot of boiler-plate code.

To take advantage of this feature, you can use the pseudo-types prefixed by a `#`.
For example, if you want to use the `firstName` configuration in your form, add the following object to your `FormlyFieldConfig[]`:

```typescript
{
  type: '#firstName',
}
```

Behind the scenes, this will automatically be replaced by the `firstName` configuration.
To take advantage of override logic, add the modifications to the object.
For example, defining a new label text works like this:

```typescript
{
  type: '#firstName',
  props: {
    label: 'New Label',
  }
}
```

This is equivalent to the example given in [Retrieving configurations](#retrieving-configurations) but does not require you to inject the library.

> [!NOTE]
> Currently, it is not possible to use configuration groups with this shorthand syntax. This is a known limitation and might be addressed in future versions.

## Address Forms

Address forms are a special kind of reusable forms and as such are treated differently in the Intershop PWA.
Under the hood, they also use the functionality explained above, but the address configurations are declared in their own module and access to address forms is simplified via the `formly-address-form` component.

### Using the formly-address-form Component

The following steps describe how to use the formly-address-form component on your form (also see the example below):

Container component:

1. Create a `FormGroup`. It will be populated with an `address` control.

Container template:

1. Add a `<ish-formly-address-form>` component to your template.
2. Pass your `FormGroup` via the `parentForm` input.
3. Optional: Define whether you want to display business customer addresses via the `businessCustomer` input.
4. Optional: Define whether you want to have the address form pre-filled via the `prefilledAddress` input.

### Creating a New Country Specific Form

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

- Use the `addressesFieldConfiguration` helper method to quickly reuse common address field configurations (see `standardFields`).

## Standard Reusable Form Configurations

The following is a list of reusable field configurations available in the PWA.

<!-- Don't edit the following tables manually.
They are automatically updated using sync-formly-docs.ts -->
<!-- sync-start -->

| Configuration ID  | Type                  | Description                                                                                 |
| ----------------- | --------------------- | ------------------------------------------------------------------------------------------- |
| `title`           | ish-select-field      | Title/Salutation, automatically extracts options from FormsService, not required by default |
| `firstName`       | ish-text-input-field  | First name, special characters forbidden and required by default                            |
| `lastName`        | ish-text-input-field  | Last name, special characters forbidden and required by default                             |
| `phoneHome`       | ish-phone-field       | Phone, not required by default                                                              |
| `companyName1`    | ish-text-input-field  | Company Name 1, required by default                                                         |
| `companyName2`    | ish-text-input-field  | Company name 2, not required by default                                                     |
| `taxationID`      | ish-text-input-field  | Taxation ID, not required by default                                                        |
| `addressLine1`    | ish-text-input-field  | Address Line 1 (usually street & number), required by default                               |
| `addressLine2`    | ish-text-input-field  | Address Line 2, not required by default                                                     |
| `postalCode`      | ish-text-input-field  | Postal code, required by default                                                            |
| `city`            | ish-text-input-field  | City, required by default                                                                   |
| `budgetPriceType` | ish-budget-type-field | Taxation ID, not required by default                                                        |

| ConfigurationGroup ID | ShortcutFor Types                               |
| --------------------- | ----------------------------------------------- |
| `personalInfo`        | `'title', 'firstName', 'lastName', 'phoneHome'` |
| `companyInfo`         | `'companyName1', 'companyName2', 'taxationID'`  |

   <!-- sync-end -->

# Further References

- [Formly documentation](./formly.md)
- [General forms documentation](./forms.md)
