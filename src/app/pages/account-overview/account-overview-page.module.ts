import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { AccountOverviewPageContainerComponent } from './account-overview-page.container';
import { AccountOverviewComponent } from './components/account-overview/account-overview.component';

@NgModule({
  imports: [SharedModule],
  declarations: [AccountOverviewComponent, AccountOverviewPageContainerComponent],
})
export class AccountOverviewPageModule {
  static component = AccountOverviewPageContainerComponent;
}
