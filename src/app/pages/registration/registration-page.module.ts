import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigOption, FormlyModule } from '@ngx-formly/core';

import { SharedModule } from 'ish-shared/shared.module';

import { disablePrefilledExtension } from './formly/disable-prefilled.extension';
import { RegistrationAddressFieldComponent } from './formly/registration-address-field/registration-address-field.component';
import { RegistrationHeadingFieldComponent } from './formly/registration-heading-field/registration-heading-field.component';
import { RegistrationTacFieldComponent } from './formly/registration-tac-field/registration-tac-field.component';
import { RegistrationPageComponent } from './registration-page.component';

const registrationPageRoutes: Routes = [{ path: '', component: RegistrationPageComponent }];

const registrationFormlyConfig: ConfigOption = {
  types: [
    {
      name: 'ish-registration-address-field',
      component: RegistrationAddressFieldComponent,
    },
    { name: 'ish-registration-heading-field', component: RegistrationHeadingFieldComponent },
    { name: 'ish-registration-tac-field', component: RegistrationTacFieldComponent },
  ],
  extensions: [{ name: 'disable-prefilled', extension: disablePrefilledExtension }],
};

@NgModule({
  imports: [
    FormlyModule.forChild(registrationFormlyConfig),
    RouterModule.forChild(registrationPageRoutes),
    SharedModule,
  ],
  declarations: [
    RegistrationAddressFieldComponent,
    RegistrationHeadingFieldComponent,
    RegistrationPageComponent,
    RegistrationTacFieldComponent,
  ],
})
export class RegistrationPageModule {}
