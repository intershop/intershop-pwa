import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountOverviewComponent } from './account-overview.component';
import { RouterModule } from '@angular/router';
import { AccountOverviewRoute } from './account-overview.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AccountOverviewRoute)
  ],
  declarations: [AccountOverviewComponent]
})

export class AccountOverviewModule {

}
