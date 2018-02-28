import { NgModule } from '@angular/core';
import { RecaptchaModule } from 'ng-recaptcha';
import { AddressFormModule } from '../shared/address-form';
import { SharedModule } from '../shared/shared.module';
import { CaptchaComponent } from './components/captcha/captcha.component';
import { InputBirthdayComponent } from './components/form-controls/input-birthday/input-birthday.component';
import { RegistrationCredentialsFormComponent } from './components/registration-credentials-form/registration-credentials-form.component';
import { RegistrationFormComponent } from './components/registration-form/registration-form.component';
import { RegistrationPersonalFormComponent } from './components/registration-personal-form/registration-personal-form.component';

const sharedComponents = [
  InputBirthdayComponent,
  CaptchaComponent,
  RegistrationCredentialsFormComponent,
  RegistrationFormComponent,
  RegistrationPersonalFormComponent,
];

@NgModule({
  imports: [
    SharedModule,
    RecaptchaModule,
    AddressFormModule
  ],
  declarations: [
    ...sharedComponents
  ],
  exports: [
    ...sharedComponents
  ]
})
export class RegistrationSharedModule { }
