import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbService } from '../components/breadcrumb/breadcrumb.service';
import { AuthGuard } from '../services/auth-guard.service';
import { LocalizeRouterModule } from '../services/routes-parser-locale-currency/localize-router.module';


const routes: Routes = [
  { path: 'family', loadChildren: 'app/pages/family-page/family-page.module#FamilyPageModule' },
  { path: 'category/:category', loadChildren: 'app/pages/category-page/category-page.module#CategoryPageModule' },
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
    RouterModule.forChild(routes),
    LocalizeRouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PagesRoutingModule {
  constructor(private breadcrumbService: BreadcrumbService) {
    breadcrumbService.hideRouteRegex('/family$'); // Hide breadrumb string for which path ends with "/family"
    breadcrumbService.hideRouteRegex('/category$'); // Hide breadrumb string for which path ends with "/category"
    breadcrumbService.hideRouteRegex('/en_US$'); // Hide breadrumb string for which path ends with "/category"
    breadcrumbService.hideRouteRegex('/USD$'); // Hide breadrumb string for which path ends with "/category"


    // Replace 'white space' and '&' in breadcrumb string
    this.breadcrumbService.addCallbackForRouteRegex('.*%.*', (route) => {
      return route.replace(/%20/g, ' ').replace(/%26/g, '&');
    });

  }
}
