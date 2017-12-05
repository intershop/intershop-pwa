import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RecaptchaModule } from 'ng-recaptcha';
import { FormsModule } from '../../../shared/forms.module';
import { SharedModule } from '../../../shared/shared.module';
import { AddressComponent } from './address/address.component';
import { CaptchaComponent } from './captcha/captcha.component';
import { EmailPasswordComponent } from './email-password/email-password.component';
import { RegistrationCredentialsFormComponent } from './registration-credentials-form/registration-credentials-form.component';
import { RegistrationPageComponent } from './registration-page.component';
import { registrationPageRoutes } from './registration-page.routes';
import { RegistrationPersonalFormComponent } from './registration-personal-form/registration-personal-form.component';


@NgModule({
  imports: [
    RouterModule.forChild(registrationPageRoutes),
    RecaptchaModule.forRoot(),
    SharedModule,
    FormsModule
  ],
  declarations: [RegistrationPageComponent, CaptchaComponent, EmailPasswordComponent, AddressComponent, RegistrationCredentialsFormComponent, RegistrationPersonalFormComponent],
  providers: []
})

export class RegistrationPageModule {

}
