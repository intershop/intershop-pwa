import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeatureToggleGuard } from 'ish-core/feature-toggle.module';
import { AuthGuard } from 'ish-core/guards/auth.guard';
import { LogoutGuard } from 'ish-core/guards/logout.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home-page.module').then(m => m.HomePageModule) },
  { path: 'error', loadChildren: () => import('./error/error-page.module').then(m => m.ErrorPageModule) },
  { path: 'product', loadChildren: () => import('./product/product-page.module').then(m => m.ProductPageModule) },
  { path: 'category', loadChildren: () => import('./category/category-page.module').then(m => m.CategoryPageModule) },
  {
    path: 'account',
    loadChildren: () => import('./account/account-page.module').then(m => m.AccountPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'compare',
    loadChildren: () => import('./compare/compare-page.module').then(m => m.ComparePageModule),
    canActivate: [FeatureToggleGuard],
    data: { feature: 'compare' },
  },
  {
    path: 'recently',
    loadChildren: () => import('./recently/recently-page.module').then(m => m.RecentlyPageModule),
    canActivate: [FeatureToggleGuard],
    data: { feature: 'recently' },
  },
  { path: 'search', loadChildren: () => import('./search/search-page.module').then(m => m.SearchPageModule) },
  { path: 'basket', loadChildren: () => import('./basket/basket-page.module').then(m => m.BasketPageModule) },
  {
    path: 'checkout',
    loadChildren: () => import('./checkout/checkout-page.module').then(m => m.CheckoutPageModule),
    data: { headerType: 'checkout' },
  },
  { path: 'page', loadChildren: () => import('./content/content-page.module').then(m => m.ContentPageModule) },
  {
    path: 'register',
    loadChildren: () => import('./registration/registration-page.module').then(m => m.RegistrationPageModule),
  },
  { path: 'login', loadChildren: () => import('./login/login-page.module').then(m => m.LoginPageModule) },
  {
    path: 'logout',
    loadChildren: () => import('./home/home-page.module').then(m => m.HomePageModule),
    canActivate: [LogoutGuard],
  },
  {
    path: 'forgotPassword',
    loadChildren: () => import('./forgot-password/forgot-password-page.module').then(m => m.ForgotPasswordPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      paramsInheritanceStrategy: 'always',
      scrollPositionRestoration: 'enabled',
      initialNavigation: 'enabled',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
