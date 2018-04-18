import { NgModule } from '@angular/core';
import { RegistrationRoutingModule } from './registration-routing.module';
import { RegistrationService } from './services/registration/registration.service';

@NgModule({
  imports: [RegistrationRoutingModule],
  providers: [RegistrationService],
})
export class RegistrationModule {}
