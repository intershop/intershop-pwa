import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {RouterModule} from '@angular/router'
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RecaptchaModule} from 'ng-recaptcha';
import {CaptchaComponent} from './captcha/captcha.component';
import {EmailPasswordComponent} from './emailPassword/emailPassword.component';
import {AddressComponent} from './address/address.component';
import {registrationPageRoute} from './registrationPage.routes';
import {RegistrationPageComponent} from './registrationPage.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(registrationPageRoute),
    FormsModule,
    ReactiveFormsModule,
    RecaptchaModule.forRoot()
  ],
  declarations: [RegistrationPageComponent, CaptchaComponent, EmailPasswordComponent, AddressComponent],
  providers: []
})

export class RegistrationPageModule {

}
