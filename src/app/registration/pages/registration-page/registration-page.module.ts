import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RecaptchaModule } from 'ng-recaptcha';
import { ExtraFormsModule } from '../../../shared/extra-forms.module';
import { SharedModule } from '../../../shared/shared.module';
import { RegistrationSharedModule } from '../../registration-shared.module';
import { CaptchaComponent } from './captcha/captcha.component';
import { RegistrationCredentialsFormComponent } from './registration-credentials-form/registration-credentials-form.component';
import { RegistrationPageComponent } from './registration-page.component';
import { registrationPageRoutes } from './registration-page.routes';
import { RegistrationPersonalFormComponent } from './registration-personal-form/registration-personal-form.component';

@NgModule({
  imports: [
    RouterModule.forChild(registrationPageRoutes),
    RecaptchaModule,
    SharedModule,
    RegistrationSharedModule,
    ExtraFormsModule
  ],
  declarations: [
    RegistrationPageComponent,
    CaptchaComponent,
    RegistrationCredentialsFormComponent,
    RegistrationPersonalFormComponent
  ]
})

export class RegistrationPageModule { }
