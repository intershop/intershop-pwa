import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeatureToggleGuard } from 'ish-core/feature-toggle.module';
import { AuthGuard } from 'ish-core/guards/auth.guard';
import { LoginGuard } from 'ish-core/guards/login.guard';
import { LogoutGuard } from 'ish-core/guards/logout.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
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
    path: 'compare',
    loadChildren: () => import('./compare/compare-page.module').then(m => m.ComparePageModule),
    canActivate: [FeatureToggleGuard],
    data: {
      feature: 'compare',
      meta: {
        title: 'product.compare.link',
        robots: 'noindex, nofollow',
      },
    },
  },
  {
    path: 'recently',
    loadChildren: () => import('./recently/recently-page.module').then(m => m.RecentlyPageModule),
    canActivate: [FeatureToggleGuard],
    data: {
      feature: 'recently',
      meta: {
        title: 'application.recentlyViewed.heading',
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
    path: 'page',
    loadChildren: () => import('./content/content-page.module').then(m => m.ContentPageModule),
  },
  {
    path: 'register',
    loadChildren: () => import('./registration/registration-page.module').then(m => m.RegistrationPageModule),
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
    canActivate: [LoginGuard],
    data: {
      meta: {
        title: 'account.login.link',
        robots: 'noindex, nofollow',
      },
    },
  },
  {
    path: 'logout',
    loadChildren: () => import('./home/home-page.module').then(m => m.HomePageModule),
    canActivate: [LogoutGuard],
    data: {
      meta: {
        title: 'account.logout.link',
        robots: 'noindex, nofollow',
      },
    },
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
    path: 'contact',
    loadChildren: () => import('./contact/contact-page.module').then(m => m.ContactPageModule),
    data: {
      meta: {
        title: 'helpdesk.contact_us.heading',
        robots: 'index, nofollow',
      },
    },
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
