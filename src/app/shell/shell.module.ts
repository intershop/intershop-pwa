import { NgModule } from '@angular/core';
import { AccountModule } from '../account/account.module';
import { RegistrationModule } from '../registration/registration.module';
import { ShoppingModule } from '../shopping/shopping.module';
import { ShellRoutingModule } from './shell-routing.module';

@NgModule({
  imports: [
    ShellRoutingModule,
    ShoppingModule,
    RegistrationModule,
    AccountModule
  ],
  providers: []
})

export class ShellModule { }
