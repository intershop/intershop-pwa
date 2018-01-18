import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { LogoutGuard } from '../core/guards/logout.guard';

const routes: Routes = [
  { path: 'account', loadChildren: 'app/account/pages/account-page/account-page.module#AccountPageModule', canActivate: [AuthGuard] },
  { path: 'logout', loadChildren: 'app/shopping/pages/home-page/home-page.module#HomePageModule', canActivate: [LogoutGuard] }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthGuard,
    LogoutGuard
  ]
})

export class AccountRoutingModule { }
