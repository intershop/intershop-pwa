import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { AccountSharedModule } from '../../account-shared.module';
import { AccountPageComponent } from '../../components/account-page/account-page.component';
import { AccountPageContainerComponent } from './account-page.container';
import { accountPageRoutes } from './account-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(accountPageRoutes),
    SharedModule,
    AccountSharedModule
  ],
  declarations: [
    AccountPageComponent,
    AccountPageContainerComponent,
  ]
})
export class AccountPageModule { }
