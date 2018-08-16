import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { RegistrationSharedModule } from '../../registration-shared.module';

import { RegistrationPageContainerComponent } from './registration-page.container';
import { registrationPageRoutes } from './registration-page.routes';

@NgModule({
  imports: [RouterModule.forChild(registrationPageRoutes), SharedModule, RegistrationSharedModule],
  declarations: [RegistrationPageContainerComponent],
})
export class RegistrationPageModule {}
