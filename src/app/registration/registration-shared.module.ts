import { NgModule } from '@angular/core';
import { FormsAddressModule } from '../forms/forms-address.module';
import { SharedModule } from '../shared/shared.module';
import { RegistrationCredentialsFormComponent } from './components/registration-credentials-form/registration-credentials-form.component';
import { RegistrationFormComponent } from './components/registration-form/registration-form.component';
import { RegistrationPersonalFormComponent } from './components/registration-personal-form/registration-personal-form.component';

const sharedComponents = [
  RegistrationCredentialsFormComponent,
  RegistrationFormComponent,
  RegistrationPersonalFormComponent,
];

@NgModule({
  imports: [SharedModule, FormsAddressModule],
  declarations: [...sharedComponents],
  exports: [...sharedComponents],
})
export class RegistrationSharedModule {}
