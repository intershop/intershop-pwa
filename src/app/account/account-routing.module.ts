import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'account',
    loadChildren: 'app/account/containers/account-page/account-page.module#AccountPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'account/profile',
    loadChildren: 'app/account/containers/profile-settings-page/profile-settings-page.module#ProfileSettingsPageModule'
  },
  {
    path: 'account/orders',
    loadChildren: 'app/account/containers/order-history-page/order-history-page.module#OrderHistoryPageModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthGuard
  ]
})

export class AccountRoutingModule { }
