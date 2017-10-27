import { NgModule } from '@angular/core';
import { AuthGuard } from '../services/auth-guard.service';
import { PagesRoutingModule } from './pages.routes';
import { RegistrationGuard } from './registration-page/registration.guard.service';

@NgModule({
  imports: [
    PagesRoutingModule
  ],
  declarations: [],
  providers: [AuthGuard, RegistrationGuard]
})

export class PageModule {

}
