import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { RegistrationCompanyFormComponent } from './registration-company-form/registration-company-form.component';
import { RegistrationCredentialsFormComponent } from './registration-credentials-form/registration-credentials-form.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { RegistrationPageComponent } from './registration-page.component';
import { RegistrationPersonalFormComponent } from './registration-personal-form/registration-personal-form.component';

const registrationPageRoutes: Routes = [{ path: '', component: RegistrationPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(registrationPageRoutes), SharedModule],
  declarations: [
    RegistrationCompanyFormComponent,
    RegistrationCredentialsFormComponent,
    RegistrationFormComponent,
    RegistrationPageComponent,
    RegistrationPersonalFormComponent,
  ],
})
export class RegistrationPageModule {}
