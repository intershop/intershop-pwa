import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { AccountOverviewPageContainerComponent } from './account-overview-page.container';
import { AccountOverviewPageComponent } from './components/account-overview-page/account-overview-page.component';

@NgModule({
  imports: [SharedModule],
  declarations: [AccountOverviewPageComponent, AccountOverviewPageContainerComponent],
})
export class AccountOverviewPageModule {
  static component = AccountOverviewPageContainerComponent;
}
