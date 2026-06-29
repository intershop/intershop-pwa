import { Routes } from '@angular/router';
import { ConfigOption } from '@ngx-formly/core';

import { disablePrefilledExtension } from './formly/disable-prefilled.extension';
import { RegistrationAddressFieldComponent } from './formly/registration-address-field/registration-address-field.component';
import { RegistrationHeadingFieldComponent } from './formly/registration-heading-field/registration-heading-field.component';
import { RegistrationNewsletterFieldComponent } from './formly/registration-newsletter-field/registration-newsletter-field.component';
import { RegistrationTacFieldComponent } from './formly/registration-tac-field/registration-tac-field.component';
import { RegistrationApprovalComponent } from './registration-approval/registration-approval.component';
import { RegistrationPageComponent } from './registration-page.component';
import { canDeactivateRegistrationPage, registrationPageGuard } from './registration-page.guard';

export const registrationPageRoutes: Routes = [
  {
    path: '',
    component: RegistrationPageComponent,
    canActivate: [registrationPageGuard],
    canDeactivate: [canDeactivateRegistrationPage],
  },
  {
    path: 'sso',
    component: RegistrationPageComponent,
    canDeactivate: [canDeactivateRegistrationPage],
  },
  {
    path: 'approval',
    component: RegistrationApprovalComponent,
  },
];

export const registrationFormlyConfig: ConfigOption = {
  types: [
    {
      name: 'ish-registration-address-field',
      component: RegistrationAddressFieldComponent,
    },
    { name: 'ish-registration-heading-field', component: RegistrationHeadingFieldComponent },
    { name: 'ish-registration-tac-field', component: RegistrationTacFieldComponent },
    { name: 'ish-registration-newsletter-field', component: RegistrationNewsletterFieldComponent },
  ],
  extensions: [{ name: 'disable-prefilled', extension: disablePrefilledExtension }],
};
