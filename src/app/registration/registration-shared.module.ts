import { NgModule } from '@angular/core';
import { AddressFormModule } from '../forms/address-form';
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
  imports: [
    SharedModule,
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
