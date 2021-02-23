import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormlyModule } from '@ngx-formly/core';

import { SharedModule } from 'ish-shared/shared.module';

import { RegistrationAddressFieldComponent } from './registration-address-field/registration-address-field.component';
import { RegistrationButtonsFieldComponent } from './registration-buttons-field/registration-buttons-field.component';
import { RegistrationHeadingFieldComponent } from './registration-heading-field/registration-heading-field.component';
import { RegistrationPageComponent } from './registration-page.component';
import { RegistrationTacFieldComponent } from './registration-tac-field/registration-tac-field.component';

const registrationPageRoutes: Routes = [{ path: '', component: RegistrationPageComponent }];

@NgModule({
  imports: [
    FormlyModule.forChild({
      types: [
        {
          name: 'ish-registration-address-field',
          component: RegistrationAddressFieldComponent,
        },
        { name: 'ish-registration-heading-field', component: RegistrationHeadingFieldComponent },
        { name: 'ish-registration-tac-field', component: RegistrationTacFieldComponent },
        { name: 'ish-registration-buttons-field', component: RegistrationButtonsFieldComponent },
      ],
    }),
    RouterModule.forChild(registrationPageRoutes),
    SharedModule,
  ],
  declarations: [
    RegistrationAddressFieldComponent,
    RegistrationButtonsFieldComponent,
    RegistrationHeadingFieldComponent,
    RegistrationPageComponent,
    RegistrationTacFieldComponent,
  ],
})
export class RegistrationPageModule {}
