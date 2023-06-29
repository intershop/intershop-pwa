<!--
kb_concepts
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# CAPTCHA in the PWA

## Introduction

Both reCAPTCHA V2 and reCAPTCHA V3 are implemented in the PWA. Which CAPTCHA version is used depends on which CAPTCHA service is created in the ICM. The pure implementation of the CAPTCHA functionality is stored in an extensions folder. A common lazy component is generated from these basic components. This in turn is made available in a _shared module_ for any web forms located in the PWA.

The PWA uses the [Angular Formly framework](https://formly.dev/docs/guide/getting-started) to process web forms. With the framework you have the possibility to define types which can be used by the fields of the form. A separate type was implemented for the integration of the CAPTCHA functionality. In the following, you can bind a field of this type to any _formly_ form, so that this form is validated according to CAPTCHA.

# High Level Overview

The following class diagram shows the major classes of the CAPTCHA workflow that are relevant for the most use cases.

![Captcha Class Diagram](captcha-class-diagram.png)

The overview diagram shows:

- CAPTCHA Basic Components contains the recommended necessary UI components to integrate the Google reCAPTCHA service.
- The generated lazy components serve to ensure that this component is reloaded asynchronously.
- The CAPTCHA facade contains methods for determining the sitekey and the reCAPTCHA version used.
- The PWA uses the formly framework for web forms. This allows you to create specific types for the input fields. The types can be used to define the properties of the input field. A separate type was created for the reCAPTCHA functionality.
- The three components (registration-page.component.ts, request-reminder-form.component.ts, contact-form.component.ts) contain formly forms that contain a field of the CAPTCHA type.
- When these forms are submitted, the CAPTCHA token is set as a header parameter to the subsequent REST request. (In case CAPTCHA V3 is used then also the CAPTCHA action is set as header parameter.)
- The captcha validation takes place on the ICM side. If the threshold value configured in the managed service for the score is exceeded, the request is rejected.

# Integration of the CAPTCHA Components

As mentioned above, a special CAPTCHA field type has been created. This makes it very easy to protect any web form by using the CAPTCHA functionality. The following example shows how to attach a CAPTCHA type _‘ish-captcha-field’_ field to any formly form.

First the TypeScript file of the component:

```
export class ExamplePageComponent implements OnInit {
  ...
  fields: FormlyFieldConfig[];
  exampleFormGroup = new UntypedFormGroup({});
  ...
  ngOnInit() {
    ...
    this.fields = [
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

The type ‘ish-captcha-field’ is registered in the src.app.shared.formly.types.types.module.ts. Additionally, the module binds the corresponding field component to this type. The topic which is to set corresponds to the ICM selectable CAPTCHA channel preferences. If this preferences are disable in the ICM than the CAPTCHA validation for this topic is also disabled in the PWA.

The table shows the mapping between the existing PWA CAPTCHA topic names and the CAPTCHA channel preferences in the ICM:

| **CaptchaTopic**                     | **ICM Settings**                        |
| ------------------------------------ | --------------------------------------- |
| contactUs                            | Contact Us                              |
| emailShoppingCart                    | E-mail Shopping Cart                    |
| forgotPassword                       | Forgot password                         |
| redemptionOfGiftCardsAndCertificates | Redemption of Gift Cards & Certificates |
| register                             | Registration                            |

> :bulb: This topic value will also append to the header of the request who is triggered by submitting of the web form. This is necessary to support the [actions concept of Google reCAPTCHA v3](https://developers.google.com/recaptcha/docs/v3#actions).

For the sake of completeness, also the HTML file of the component:

```
<form name="ExampleForm" [formGroup]="exampleFormGroup" (ngSubmit)="submitForm()">
  <formly-form [form]="exampleFormGroup" [fields]="fields"></formly-form>

  <div class="row form-group">
    <div class="offset-md-4 col-md-8">
      <button
        type="submit"
        value="exampleButtonValue"
        name="exampleButtonName"
        class="btn btn-primary"
        [disabled]="buttonDisabled"
      >
        {{ 'example.form.send.button.label' | translate }}
      </button>
    </div>
  </div>
</form>
```

# Basic Components

As you can see in the high level overview, there are components that represent the actual CAPTCHA functionality. Depending on the version used, either widgets provided by google or the reCAPTCHA token functionality are implemented in these components. The [ng-recaptcha](https://github.com/DethAriel/ng-recaptcha) library was used for the implementation.

The table shows all the basic components provided by the PWA:

| **reCAPTCHA V2**                                                             | **reCAPTCHA V3**                                                             |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| _src.app.extensions.captcha.shared.captcha-v2.**captcha-v2.component.ts**_   | _src.app.extensions.captcha.shared.captcha-v3.**captcha-v3.component.ts**_   |
| _src.app.extensions.captcha.shared.captcha-v2.**captcha-v2.component.html**_ | _src.app.extensions.captcha.shared.captcha-v3.**captcha-v3.component.html**_ |

# CAPTCHA V2

| **captcha-v2.component.ts**                             | **captcha-v2.component.html**                               |
| ------------------------------------------------------- | ----------------------------------------------------------- |
| ![captcha-v2.component.ts](captcha-v2-component-ts.png) | ![captcha-v2.component.html](captcha-v2-component-html.png) |

To add the widgets provided by Google, the **RecaptchaModule** of the _ng-recaptcha_ library has to be imported. Furthermore the determination of the _captcha site key_ is necessary for the initialization of the widget. This site key is a required option on the reCAPTCHA HTML element. Furthermore, it is necessary that the token determined by the CAPTCHA event is saved as a form control parameter, see resolved function. This makes it possible to validate the response and handle it accordingly. In the event of an error, an error message is displayed; in the event of success, the entire form is processed further.

# CAPTCHA V3

| **captcha-v3.component.ts**                             | **captcha-v3.component.html**                           |
| ------------------------------------------------------- | ------------------------------------------------------- |
| ![captcha-v3.component.ts](captcha-v3-component-ts.png) | ![captcha-v3.component.ts](captcha-v3-component-ts.png) |

To implement a callback function to handle the token it is necessary to import the **RecaptchaV3Module** of the _ng-recaptcha_ library. For this component every 2 minutes the callback will triggered to get a current reCAPTCHA token. This token is then attached to the request triggered by the transmitted form. The ICM backend then validates the token.

# Further References

- [Intershop Knowledge Base | Concept - ReCaptcha v3](https://support.intershop.com/kb/index.php/Display/29X281)
- [Intershop Knowledge Base | Concept - ReCaptcha v2](https://support.intershop.com/kb/index.php/Display/2794B3)
- [Getting Started | Formly](https://formly.dev/docs/guide/getting-started)
- [GitHub - DethAriel/ng-recaptcha: Angular component for Google reCAPTCHA](https://github.com/DethAriel/ng-recaptcha)
- [Developer's Guide | reCAPTCHA | Google for Developers](https://developers.google.com/recaptcha/intro)
