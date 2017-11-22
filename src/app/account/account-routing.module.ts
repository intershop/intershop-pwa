import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  { path: 'wishlist', loadChildren: 'app/account/pages/wishlists-page/wishlists-page.module#WishlistPageModule', canActivate: [AuthGuard] },
  { path: 'accountOverview', loadChildren: 'app/account/pages/account-overview/account-overview.module#AccountOverviewModule', canActivate: [AuthGuard] },
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
