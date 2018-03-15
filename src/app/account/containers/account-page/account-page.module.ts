import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { AccountShareModule } from '../../account-share.module';
import { AccountPageComponent } from '../../components/account-page/account-page.component';
import { AccountPageContainerComponent } from './account-page.container';
import { accountPageRoutes } from './account-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(accountPageRoutes),
    SharedModule,
    AccountShareModule
  ],
  declarations: [
    AccountPageComponent,
    AccountPageContainerComponent,
  ]
})

export class AccountPageModule { }
