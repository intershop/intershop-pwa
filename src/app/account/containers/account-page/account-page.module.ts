import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { AccountSharedModule } from '../../account-shared.module';
import { AccountNavigationComponent } from '../../components/account-navigation/account-navigation.component';
import { AccountOverviewPageComponent } from '../../components/account-overview-page/account-overview-page.component';
import { AccountPageComponent } from '../../components/account-page/account-page.component';
import { AccountOverviewPageContainerComponent } from '../account-overview-page/account-overview-page.container';

import { AccountPageContainerComponent } from './account-page.container';
import { accountPageRoutes } from './account-page.routes';

@NgModule({
  imports: [AccountSharedModule, RouterModule.forChild(accountPageRoutes), SharedModule],
  declarations: [
    AccountNavigationComponent,
    AccountOverviewPageComponent,
    AccountOverviewPageContainerComponent,
    AccountPageComponent,
    AccountPageContainerComponent,
  ],
})
export class AccountPageModule {}
