<!--
kb_concepts
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# CAPTCHA in the PWA

## Introduction

The PWA supports reCAPTCHA V2 as well as reCAPTCHA V3.
Which CAPTCHA version is used depends on which CAPTCHA service is created and running in the ICM.
The pure CAPTCHA functionality is implemented as a PWA extension and can be found in the _extensions_ folder.
There are two basic CAPTCHA components (one for each CAPTCHA version) and a lazy CAPTCHA component that decides which one to use.

The PWA uses the [Angular Formly framework](https://formly.dev/docs/guide/getting-started) to process web forms, see also [The Formly Guide](../guides/formly.md).
This framework allows you to automatically generate your forms using predefined form field types.
A special type `ish-captcha-field` has been implemented to support the CAPTCHA functionality.
You can define a field of this type in any _Formly_ form, so that this form is validated according to CAPTCHA.

## High Level Overview

The following class diagram shows the major classes of the CAPTCHA workflow that are relevant for most use cases:

![Captcha Class Diagram](captcha-class-diagram.png)

- _CAPTCHA Basic Components_ contains the recommended necessary UI components to integrate the Google reCAPTCHA service.
- The lazy component ensures that the component for the corresponding version is reloaded asynchronously.
- The CAPTCHA facade contains methods to retrieve the sitekey and the reCAPTCHA version used.
- The PWA uses the Formly framework for web forms. A separate type `ish-captcha-field` is available for the reCAPTCHA functionality.
- The three components (_registration-page.component.ts_, _request-reminder-form.component.ts_, _contact-form.component.ts_) contain Formly forms that contain a field of type CAPTCHA.
- When these forms are submitted, the CAPTCHA token is set as a header parameter for the subsequent REST request. (When using CAPTCHA V3, the CAPTCHA action is also set as a header parameter).
- The CAPTCHA validation takes place on the ICM side. If the score exceeds the threshold configured in the managed service, the request is rejected.

## Integration of the CAPTCHA Components

There is a special CAPTCHA field type that makes it very easy to protect any web form using the CAPTCHA functionality.
The following example shows how to add a CAPTCHA field of type `ish-captcha-field` to any Formly form.

The component's TypeScript file looks like this:

```ts
export class ExamplePageComponent implements OnInit {
  ...
  fields: FormlyFieldConfig[];
  exampleFormGroup = new UntypedFormGroup({});
  ...
  ngOnInit() {
    ...
    this.fields = [
        ...
        {
          type: 'ish-captcha-field',
          props: {
            topic: 'forgotPassword',
          },
        },
      ];
  }
 ...
}
```

The `ish-captcha-field` type is registered in the _src.app.shared.formly.types.**types.module.ts**_.
Additionally, the module binds the corresponding field component to this type.
The topic to be set corresponds to the CAPTCHA channel preferences available in ICM.
If these preferences are disabled in ICM, CAPTCHA validation for this topic is also disabled in the PWA.

The following table shows the mapping between existing PWA CAPTCHA topic names and the CAPTCHA channel preferences in the ICM:

| **CaptchaTopic**                     | **ICM Settings**                        |
| ------------------------------------ | --------------------------------------- |
| contactUs                            | Contact Us                              |
| emailShoppingCart                    | E-mail Shopping Cart                    |
| forgotPassword                       | Forgot password                         |
| redemptionOfGiftCardsAndCertificates | Redemption of Gift Cards & Certificates |
| register                             | Registration                            |

> :exclamation: The topic value is also appended to the header of the request triggered by submitting the web form. This is necessary to support the [actions concept of Google reCAPTCHA v3](https://developers.google.com/recaptcha/docs/v3#actions).

## Basic Components

As you can see in the high-level overview, there are components that represent the actual CAPTCHA functionality.
Depending on the version used, these components implement either widgets provided by Google or the reCAPTCHA token functionality.
The [ng-recaptcha](https://github.com/DethAriel/ng-recaptcha) library was used for the implementation.

### CAPTCHA V2 (captcha-v2.component.ts)

To add the widgets provided by Google, you need to import the **ReCAPTCHAModule** of the _ng-recaptcha_ library.
Furthermore, _captcha site key_ must be set to initialize the widget.
This site key is a required option on the reCAPTCHA HTML element.
It is also necessary to store the token determined by the CAPTCHA event as a form control parameter.
This allows the response to be validated and handled accordingly.
In case of an error, an error message is displayed; in case of success, the entire form is processed further.

### CAPTCHA V3 (captcha-v3.component.ts)

To implement a callback function to handle the token, you need to import the **RecaptchaV3Module** of the _ng-recaptcha_ library.
This component will trigger a callback every two minutes to retrieve a current reCAPTCHA token.
This token is then appended to the request triggered by the submitted form.
The ICM backend will then validate the token.

## Further References

- [Intershop Knowledge Base | Concept - ReCaptcha v3](https://support.intershop.com/kb/index.php/Display/29X281)
- [Intershop Knowledge Base | Concept - ReCaptcha v2](https://support.intershop.com/kb/index.php/Display/2794B3)
- [Getting Started | Formly](https://formly.dev/docs/guide/getting-started)
- [GitHub - DethAriel/ng-recaptcha: Angular component for Google reCAPTCHA](https://github.com/DethAriel/ng-recaptcha)
- [Developer's Guide | reCAPTCHA | Google for Developers](https://developers.google.com/recaptcha/intro)
