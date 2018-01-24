import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { AccountPageComponent } from './account-page.component';
import { accountPageRoutes } from './account-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(accountPageRoutes),
    SharedModule
  ],
  declarations: [
    AccountPageComponent
  ]
})

export class AccountPageModule { }
