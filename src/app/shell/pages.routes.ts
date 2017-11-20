import { NgModule } from '@angular/core';
import { Route, Router, RouterModule, Routes } from '@angular/router';
import { GlobalConfiguration } from '../configurations/global.configuration';
import { AuthGuard } from '../services/auth-guard.service';

const routes: Routes = [
  { path: 'category', loadChildren: 'app/pages/category-page/category-page.module#CategoryPageModule' },
  { path: 'compare', loadChildren: 'app/pages/compare-page/compare-page.module#ComparePageModule' },
  { path: 'login', loadChildren: 'app/pages/account-login/account-login.module#AccountLoginModule' },
  { path: 'register', loadChildren: 'app/pages/registration-page/registration-page.module#RegistrationPageModule' },
  { path: 'wishlist', loadChildren: 'app/pages/wishlists-page/wishlists-page.module#WishlistPageModule', canActivate: [AuthGuard] },
  { path: 'accountOverview', loadChildren: 'app/pages/account-overview/account-overview.module#AccountOverviewModule', canActivate: [AuthGuard] },
  { path: 'error', loadChildren: 'app/pages/error-page/error-page.module#ErrorPageModule', data: { className: 'errorpage' } },
  { path: '**', redirectTo: '/error' }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PagesRoutingModule {

  constructor(
    globalConfiguration: GlobalConfiguration,
    router: Router
  ) {
    globalConfiguration.getApplicationSettings().toPromise().then(settings => {
      if (settings.useSimpleAccount) {
        const registerRoute: Route = router.config.find(r => r.path === 'register');
        registerRoute.loadChildren = 'app/pages/account-login/account-login.module#AccountLoginModule';
      }
    });
  }
}
