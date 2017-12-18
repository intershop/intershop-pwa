import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountPageComponent } from './account-page.component';
import { accountPageRoutes } from './account-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(accountPageRoutes)
  ],
  declarations: [
    AccountPageComponent
  ]
})

export class AccountPageModule { }
