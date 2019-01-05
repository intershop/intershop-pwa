import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';

import { FeatureToggleGuard } from 'ish-core/feature-toggle.module';
import { AuthGuard } from 'ish-core/guards/auth.guard';
import { InitialNavigationGuard } from 'ish-core/guards/initial-navigation.guard';
import { LogoutGuard } from 'ish-core/guards/logout.guard';

function insertIntoArray<T>(array: T[], object: T): T[] {
  return array ? [object, ...array] : [object];
}

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full', runGuardsAndResolvers: 'always' },
  { path: 'home', loadChildren: './home/home-page.module#HomePageModule' },
  { path: 'error', loadChildren: './error/error-page.module#ErrorPageModule' },
  { path: 'product', loadChildren: './product/product-page.module#ProductPageModule' },
  { path: 'category', loadChildren: './category/category-page.module#CategoryPageModule' },
  {
    path: 'account',
    loadChildren: './account/account-page.module#AccountPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'compare',
    loadChildren: './compare/compare-page.module#ComparePageModule',
    canActivate: [FeatureToggleGuard],
    data: { feature: 'compare' },
  },
  {
    path: 'recently',
    loadChildren: './recently/recently-page.module#RecentlyPageModule',
    canActivate: [FeatureToggleGuard],
    data: { feature: 'recently' },
  },
  { path: 'search', loadChildren: './search/search-page.module#SearchPageModule' },
  { path: 'basket', loadChildren: './basket/basket-page.module#BasketPageModule' },
  {
    path: 'checkout',
    loadChildren: './checkout/checkout-page.module#CheckoutPageModule',
    data: { headerType: 'checkout' },
    canActivate: [AuthGuard],
  },
  { path: 'page', loadChildren: './content/content-page.module#ContentPageModule' },
  {
    path: 'register',
    loadChildren: './registration/registration-page.module#RegistrationPageModule',
  },
  { path: 'login', loadChildren: './login/login-page.module#LoginPageModule' },
  {
    path: 'logout',
    loadChildren: './home/home-page.module#HomePageModule',
    canActivate: [LogoutGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      paramsInheritanceStrategy: 'always',
      scrollPositionRestoration: 'enabled',
      initialNavigation: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
  constructor(router: Router) {
    // add guard to all routes
    router.config.forEach(route => {
      route.canActivate = insertIntoArray(route.canActivate, InitialNavigationGuard);
      route.canActivateChild = insertIntoArray(route.canActivateChild, InitialNavigationGuard);
    });
  }
}
