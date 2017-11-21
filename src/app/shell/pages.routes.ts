import { NgModule } from '@angular/core';
import { Route, Router, RouterModule, Routes } from '@angular/router';
import { GlobalConfiguration } from '../core/configurations/global.configuration';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  { path: 'category', loadChildren: 'app/shopping/pages/category-page/category-page.module#CategoryPageModule' },
  { path: 'compare', loadChildren: 'app/shopping/pages/compare-page/compare-page.module#ComparePageModule' },
  { path: 'login', loadChildren: 'app/registration/pages/account-login/account-login.module#AccountLoginModule' },
  { path: 'register', loadChildren: 'app/registration/pages/registration-page/registration-page.module#RegistrationPageModule' },
  { path: 'wishlist', loadChildren: 'app/account/pages/wishlists-page/wishlists-page.module#WishlistPageModule', canActivate: [AuthGuard] },
  { path: 'accountOverview', loadChildren: 'app/account/pages/account-overview/account-overview.module#AccountOverviewModule', canActivate: [AuthGuard] },
  { path: 'error', loadChildren: 'app/shell/pages/error-page/error-page.module#ErrorPageModule', data: { className: 'errorpage' } },
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
        registerRoute.loadChildren = 'app/registration/pages/account-login/account-login.module#AccountLoginModule';
      }
    });
  }
}
