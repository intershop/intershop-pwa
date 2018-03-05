import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { RegistrationSharedModule } from '../../registration-shared.module';
import { RegistrationPageComponent } from './registration-page.container';

import { registrationPageRoutes } from './registration-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(registrationPageRoutes),
    SharedModule,
    RegistrationSharedModule
  ],
  declarations: [
    RegistrationPageComponent
  ],
  providers: [
  ]
})

export class RegistrationPageModule { }
