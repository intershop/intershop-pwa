import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RecaptchaModule } from 'ng-recaptcha';
import { CaptchaComponent } from './captcha/captcha.component';
import { EmailPasswordComponent } from './email-password/email-password.component';
import { AddressComponent } from './address/address.component';
import { RegistrationPageRoute } from './registration-page.routes';
import { RegistrationPageComponent } from './registration-page.component';
import { SharedModule } from 'app/modules/shared.module';


@NgModule({
  imports: [
    RouterModule.forChild(RegistrationPageRoute),
    RecaptchaModule.forRoot(),
    SharedModule
  ],
  declarations: [RegistrationPageComponent, CaptchaComponent, EmailPasswordComponent, AddressComponent],
  providers: []
})

export class RegistrationPageModule {

}
