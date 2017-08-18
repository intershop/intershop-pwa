import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountLoginRoute } from './account-login.routes';
import { AccountLoginComponent } from './account-login.component';
import { SharedModule } from './../../shared/shared-modules/shared.module';

@NgModule({
  imports: [
    RouterModule.forChild(AccountLoginRoute),
    SharedModule
  ],
  declarations: [AccountLoginComponent],
  providers: []
})

export class AccountLoginModule {

};

