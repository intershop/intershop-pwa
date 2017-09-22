import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../modules/shared.module';
import { AccountLoginComponent } from './account-login.component';
import { AccountLoginRoute } from './account-login.routes';
import { SimpleRegistrationComponent } from './simple-registration/simple-registration.component';

@NgModule({
  imports: [
    RouterModule.forChild(AccountLoginRoute),
    SharedModule
  ],
  declarations: [AccountLoginComponent, SimpleRegistrationComponent],
  providers: []
})

export class AccountLoginModule {

}

