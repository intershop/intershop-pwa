import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'ish-core/guards/auth.guard';
import { ErrorStatusGuard } from 'ish-core/guards/error-status.guard';
import { IdentityProviderInviteGuard } from 'ish-core/guards/identity-provider-invite.guard';
import { IdentityProviderLoginGuard } from 'ish-core/guards/identity-provider-login.guard';
import { IdentityProviderLogoutGuard } from 'ish-core/guards/identity-provider-logout.guard';
import { IdentityProviderRegisterGuard } from 'ish-core/guards/identity-provider-register.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'loading', loadChildren: () => import('./loading/loading-page.module').then(m => m.LoadingPageModule) },
  {
    path: 'home',
    loadChildren: () => import('./home/home-page.module').then(m => m.HomePageModule),
    data: {
      meta: {
        title: 'seo.title.home',
        description: 'seo.description.home',
      },
    },
  },
  {
    path: 'error',
    loadChildren: () => import('./error/error-page.module').then(m => m.ErrorPageModule),
    data: {
      meta: {
        title: 'seo.title.error',
        robots: 'noindex, nofollow',
      },
    },
  },
  {
    path: 'maintenance',
    loadChildren: () => import('./maintenance/maintenance-page.module').then(m => m.MaintenancePageModule),
    canActivate: [ErrorStatusGuard],
    data: {
      meta: {
        title: 'seo.title.maintenance',
        robots: 'noindex, nofollow',
      },
    },
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account-page.module').then(m => m.AccountPageModule),
    canActivate: [AuthGuard],
    data: {
      meta: {
        title: 'account.my_account.heading',
        robots: 'noindex, nofollow',
      },
    },
  },
  {
    path: 'search',
    loadChildren: () => import('./search/search-page.module').then(m => m.SearchPageModule),
  },
  {
    path: 'basket',
    loadChildren: () => import('./basket/basket-page.module').then(m => m.BasketPageModule),
    data: {
      meta: {
        title: 'shopping_cart.heading',
        robots: 'noindex, nofollow',
      },
    },
  },
  {
    path: 'checkout',
    loadChildren: () => import('./checkout/checkout-page.module').then(m => m.CheckoutPageModule),
    data: {
      headerType: 'checkout',
      meta: {
        title: 'seo.title.checkout',
        robots: 'noindex, nofollow',
      },
    },
  },
  {
    path: 'register',
    loadChildren: () => import('./registration/registration-page.module').then(m => m.RegistrationPageModule),
    canActivate: [IdentityProviderRegisterGuard],
    data: {
      meta: {
        title: 'account.register.link',
        robots: 'noindex, nofollow',
      },
    },
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login-page.module').then(m => m.LoginPageModule),
    canActivate: [IdentityProviderLoginGuard],
  },
  {
    path: 'logout',
    canActivate: [IdentityProviderLogoutGuard],
    children: [],
  },
  {
    path: 'invite',
    canActivate: [IdentityProviderInviteGuard],
    children: [],
  },
  {
    path: 'forgotPassword',
    loadChildren: () => import('./forgot-password/forgot-password-page.module').then(m => m.ForgotPasswordPageModule),
    data: {
      meta: {
        title: 'account.forgotdata.password_retrieval.heading',
        robots: 'noindex, nofollow',
      },
    },
  },
  {
    // route for handling confirmation of user data and account deletion requests
    path: 'gdpr-requests',
    loadChildren: () => import('./data-request/data-request-page.module').then(m => m.DataRequestPageModule),
    data: {
      meta: {
        title: 'personal.data.request.title',
        robots: 'noindex, nofollow',
      },
    },
  },
  { path: 'cookies', loadChildren: () => import('./cookies/cookies-page.module').then(m => m.CookiesPageModule) },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      paramsInheritanceStrategy: 'always',
      scrollPositionRestoration: 'enabled',
      initialNavigation: 'enabledBlocking',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
