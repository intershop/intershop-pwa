import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { AccountLoginComponent } from './account-login.component';
import { accountLoginRoutes } from './account-login.routes';
import { SimpleRegistrationComponent } from './simple-registration/simple-registration.component';

@NgModule({
  imports: [
    RouterModule.forChild(accountLoginRoutes),
    SharedModule
  ],
  declarations: [AccountLoginComponent, SimpleRegistrationComponent],
  providers: []
})

export class AccountLoginModule {

}

