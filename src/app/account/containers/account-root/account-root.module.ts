import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { SharedModule } from '../../../shared/shared.module';
import { AccountSharedModule } from '../../account-shared.module';
import { AccountNavigationComponent } from '../../components/account-navigation/account-navigation.component';
import { AccountRootContainerComponent } from './account-root.container';
import { accountRootRoutes } from './account-root.routes';

@NgModule({
  imports: [RouterModule.forChild(accountRootRoutes), SharedModule, AccountSharedModule],
  declarations: [AccountRootContainerComponent],
  exports: [AccountNavigationComponent],
  providers: [AuthGuard],
})
export class AccountRootModule {}
