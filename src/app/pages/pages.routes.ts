import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../services/auth-guard.service';
import { BreadcrumbService } from '../components/breadcrumb/breadcrumb.service';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadChildren: 'app/pages/home-page/home-page.module#HomePageModule', data: { className: 'homepage' } },
  { path: 'category/:category-name', loadChildren: 'app/pages/category-page/category-page.module#CategoryPageModule' },
  { path: 'compare', loadChildren: 'app/pages/compare-page/compare-page.module#ComparePageModule' },
  { path: 'login', loadChildren: 'app/pages/account-login/account-login.module#AccountLoginModule' },
  { path: 'register', loadChildren: 'app/pages/registration-page/registration-page.module#RegistrationPageModule' },
  { path: 'wishlist', loadChildren: 'app/pages/wishlists-page/wishlists-page.module#WishlistPageModule', canActivate: [AuthGuard] },
  { path: 'accountOverview', loadChildren: 'app/pages/account-overview/account-overview.module#AccountOverviewModule', canActivate: [AuthGuard] },
  { path: 'error', loadChildren: 'app/pages/error-page/error-page.module#ErrorPageModule', data: { className: 'errorpage' } },
  { path: '**', redirectTo: 'error' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {
  constructor(private breadcrumbService: BreadcrumbService) {
    breadcrumbService.hideRouteRegex('/family$'); // Hide breadrumb string for which path ends with "/family"
    breadcrumbService.hideRouteRegex('/category$'); // Hide breadrumb string for which path ends with "/category"

    // Replace 'white space' and '&' in breadcrumb string
    this.breadcrumbService.addCallbackForRouteRegex('.*%.*', (route) => {
      return route.replace(/%20/g, ' ').replace(/%26/g, '&');
    });

  }
}
