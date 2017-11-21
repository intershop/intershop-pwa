import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RecaptchaModule } from 'ng-recaptcha';
import { FormsModule } from '../../../shared/forms.module';
import { SharedModule } from '../../../shared/shared.module';
import { AddressComponent } from './address/address.component';
import { CaptchaComponent } from './captcha/captcha.component';
import { EmailPasswordComponent } from './email-password/email-password.component';
import { RegistrationPageComponent } from './registration-page.component';
import { RegistrationPageRoute } from './registration-page.routes';


@NgModule({
  imports: [
    RouterModule.forChild(RegistrationPageRoute),
    RecaptchaModule.forRoot(),
    SharedModule,
    FormsModule
  ],
  declarations: [RegistrationPageComponent, CaptchaComponent, EmailPasswordComponent, AddressComponent],
  providers: []
})

export class RegistrationPageModule {

}
