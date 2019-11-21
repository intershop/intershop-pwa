import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MetaGuard } from '@ngx-meta/core';

import { FeatureToggleGuard } from 'ish-core/feature-toggle.module';
import { AuthGuard } from 'ish-core/guards/auth.guard';
import { LoginGuard } from 'ish-core/guards/login.guard';
import { LogoutGuard } from 'ish-core/guards/logout.guard';
import { categoryRouteMatcher } from 'ish-core/route-formats/category.route';
import { productRouteMatcher } from 'ish-core/route-formats/product.route';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('./home/home-page.module').then(m => m.HomePageModule),
    canActivate: [MetaGuard],
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
    canActivate: [MetaGuard],
    data: {
      meta: {
        title: 'seo.title.error',
        robots: 'noindex, nofollow',
      },
    },
  },
  {
    matcher: productRouteMatcher,
    loadChildren: () => import('./product/product-page.module').then(m => m.ProductPageModule),
    canActivate: [MetaGuard],
  },
  {
    matcher: categoryRouteMatcher,
    loadChildren: () => import('./category/category-page.module').then(m => m.CategoryPageModule),
    canActivate: [MetaGuard],
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account-page.module').then(m => m.AccountPageModule),
    canActivate: [MetaGuard, AuthGuard],
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
    canActivate: [MetaGuard, FeatureToggleGuard],
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
    canActivate: [MetaGuard, FeatureToggleGuard],
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
    canActivate: [MetaGuard],
  },
  {
    path: 'basket',
    loadChildren: () => import('./basket/basket-page.module').then(m => m.BasketPageModule),
    canActivate: [MetaGuard],
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
    canActivate: [MetaGuard],
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
    canActivate: [MetaGuard],
  },
  {
    path: 'register',
    loadChildren: () => import('./registration/registration-page.module').then(m => m.RegistrationPageModule),
    canActivate: [MetaGuard],
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
    canActivate: [LoginGuard, MetaGuard],
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
    canActivate: [MetaGuard, LogoutGuard],
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
    canActivate: [MetaGuard],
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
    canActivate: [MetaGuard],
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
