import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountLoginRoute } from './account-login.routes';
import { AccountLoginComponent } from './account-login.component';
import { FormGroupComponent } from "../../components/form-control-messages";
import { SharedModule } from '../../modules/shared.module';

@NgModule({
  imports: [
    RouterModule.forChild(AccountLoginRoute),
    SharedModule
  ],
  declarations: [AccountLoginComponent,FormGroupComponent],
  providers: []
})

export class AccountLoginModule {

}

