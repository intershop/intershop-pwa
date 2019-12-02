import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { RegistrationCompanyFormComponent } from './components/registration-company-form/registration-company-form.component';
import { RegistrationCredentialsFormComponent } from './components/registration-credentials-form/registration-credentials-form.component';
import { RegistrationFormComponent } from './components/registration-form/registration-form.component';
import { RegistrationPersonalFormComponent } from './components/registration-personal-form/registration-personal-form.component';
import { RegistrationPageContainerComponent } from './registration-page.container';

const registrationPageRoutes: Routes = [{ path: '', component: RegistrationPageContainerComponent }];

@NgModule({
  imports: [RouterModule.forChild(registrationPageRoutes), SharedModule],
  declarations: [
    RegistrationCompanyFormComponent,
    RegistrationCredentialsFormComponent,
    RegistrationFormComponent,
    RegistrationPageContainerComponent,
    RegistrationPersonalFormComponent,
  ],
})
export class RegistrationPageModule {}
