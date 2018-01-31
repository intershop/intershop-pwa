import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RecaptchaModule } from 'ng-recaptcha';

import { AddressFormModule } from '../../../shared/address-form';
import { SharedModule } from '../../../shared/shared.module';
import { RegistrationSharedModule } from '../../registration-shared.module';
import { CustomerRegistrationService } from '../../services/customer-registration.service';
import { CaptchaComponent } from './captcha/captcha.component';
import { RegistrationCredentialsFormComponent } from './registration-credentials-form/registration-credentials-form.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { RegistrationPageComponent } from './registration-page.component';
import { RegistrationPersonalFormComponent } from './registration-personal-form/registration-personal-form.component';

import { registrationPageRoutes } from './registration-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(registrationPageRoutes),
    RecaptchaModule,
    SharedModule,
    RegistrationSharedModule,
    AddressFormModule
  ],
  declarations: [
    RegistrationPageComponent,
    CaptchaComponent,
    RegistrationCredentialsFormComponent,
    RegistrationPersonalFormComponent,
    RegistrationFormComponent
  ],
  providers: [
    CustomerRegistrationService
  ]
})

export class RegistrationPageModule { }
