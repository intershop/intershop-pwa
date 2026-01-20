import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { FormlyModule } from '@ngx-formly/core';

import { featureToggleGuard } from 'ish-core/feature-toggle.module';
import { authGuard } from 'ish-core/guards/auth.guard';
import { errorStatusGuard } from 'ish-core/guards/error-status.guard';
import { identityProviderInviteGuard } from 'ish-core/guards/identity-provider-invite.guard';
import { identityProviderLoginGuard } from 'ish-core/guards/identity-provider-login.guard';
import { identityProviderLogoutGuard } from 'ish-core/guards/identity-provider-logout.guard';
import { identityProviderRegisterGuard } from 'ish-core/guards/identity-provider-register.guard';
import { noServerSideRenderingGuard } from 'ish-core/guards/no-server-side-rendering.guard';
import { FormlyAddressFormsModule } from 'ish-shared/formly-address-forms/formly-address-forms.module';
import { FieldLibraryModule } from 'ish-shared/formly/field-library/field-library.module';
import { FormlyModule as IshFormlyModule } from 'ish-shared/formly/formly.module';

import { CaptchaExportsModule } from '../extensions/captcha/exports/captcha-exports.module';
import { ContactUsStoreModule } from '../extensions/contact-us/store/contact-us-store.module';
import { RecentlyStoreModule } from '../extensions/recently/store/recently-store.module';

import { accountPageRoutes } from './account/account-page.module';
import { checkoutChildRoutes } from './checkout/checkout-page.module';
import { coBrowsePageGuard } from './co-browse/co-browse-page.guard';
import { cookiesPageRoutes } from './cookies/cookies-page.module';
import { dataRequestPageRoutes } from './data-request/data-request-page.module';
import { loginPageRoutes } from './login/login-page.module';
import { registrationFormlyConfig, registrationPageRoutes } from './registration/registration-page.module';
import { RegistrationFormConfigurationService } from './registration/services/registration-form-configuration/registration-form-configuration.service';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'loading',
    children: [
      {
        path: '',
        loadComponent: () => import('./loading/loading-page.component').then(c => c.LoadingPageComponent),
        data: {
          wrapperClass: 'errorpage',
          headerType: 'simple',
        },
      },
      {
        path: 'checkout',
        loadComponent: () => import('./loading/loading-page.component').then(c => c.LoadingPageComponent),
        data: {
          headerType: 'checkout',
        },
      },
    ],
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home-page.component').then(c => c.HomePageComponent),
    data: {
      preload: 'eager',
      meta: {
        title: 'seo.title.home',
        description: 'seo.description.home',
      },
    },
  },
  {
    path: 'error',
    loadComponent: () => import('./error/error-page.component').then(c => c.ErrorPageComponent),
    data: {
      meta: {
        title: 'seo.title.error',
        robots: 'noindex, nofollow',
      },
    },
  },
  {
    path: 'maintenance',
    loadComponent: () => import('./maintenance/maintenance-page.component').then(c => c.MaintenancePageComponent),
    canActivate: [errorStatusGuard],
    data: {
      wrapperClass: 'errorpage',
      headerType: 'error',
      meta: {
        title: 'seo.title.maintenance',
        robots: 'noindex, nofollow',
      },
    },
  },
  {
    path: 'account',
    children: accountPageRoutes,
    canActivate: [authGuard],
    providers: [importProvidersFrom(IshFormlyModule, FormlyAddressFormsModule)],
    data: {
      meta: {
        title: 'account.my_account.heading',
        robots: 'noindex, nofollow',
      },
    },
  },
  {
    path: 'search/:searchTerm',
    loadComponent: () => import('./search/search-page.component').then(c => c.SearchPageComponent),
    data: {
      preload: 'eager',
      breadcrumbData: [{ key: 'search.breadcrumbs.your_search.label' }],
    },
  },
  {
    path: 'basket',
    loadComponent: () => import('./basket/basket-page.component').then(c => c.BasketPageComponent),
    data: {
      preload: 'lazy',
      meta: {
        title: 'shopping_cart.heading',
        robots: 'noindex, nofollow',
      },
    },
  },
  {
    path: 'checkout',
    canActivate: [noServerSideRenderingGuard],
    loadComponent: () => import('./checkout/checkout-page.component').then(c => c.CheckoutPageComponent),
    data: {
      headerType: 'checkout',
      meta: {
        title: 'seo.title.checkout',
        robots: 'noindex, nofollow',
      },
    },
    children: checkoutChildRoutes,
  },
  {
    path: 'register',
    canActivate: [identityProviderRegisterGuard],
    providers: [
      RegistrationFormConfigurationService,
      importProvidersFrom(FieldLibraryModule, FormlyAddressFormsModule, IshFormlyModule),
      importProvidersFrom(FormlyModule.forChild(registrationFormlyConfig)),
    ],
    children: registrationPageRoutes,
    data: {
      meta: {
        title: 'account.register.link',
        robots: 'noindex, nofollow',
      },
    },
  },
  {
    path: 'login',
    children: loginPageRoutes,
    canActivate: [identityProviderLoginGuard],
    providers: [importProvidersFrom(IshFormlyModule)],
  },
  {
    path: 'logout',
    canActivate: [identityProviderLogoutGuard],
    children: [],
  },
  {
    path: 'invite',
    canActivate: [identityProviderInviteGuard],
    children: [],
  },
  {
    path: 'forgotPassword',
    loadChildren: () => import('./forgot-password/forgot-password-page.routes').then(m => m.forgotPasswordPageRoutes),
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
    children: dataRequestPageRoutes,
    data: {
      meta: {
        title: 'personal.data.request.title',
        robots: 'noindex, nofollow',
      },
    },
  },
  {
    path: 'cookies',
    children: cookiesPageRoutes,
  },
  {
    path: 'cobrowse',
    canActivate: [coBrowsePageGuard],
    children: [],
  },

  // ============================================
  // Extension Routes - Lazy Loaded
  // ============================================

  // Compare Extension
  {
    path: 'compare',
    loadComponent: () =>
      import('../extensions/compare/pages/compare/compare-page.component').then(c => c.ComparePageComponent),
    canActivate: [featureToggleGuard],
    data: {
      feature: 'compare',
      meta: {
        title: 'product.compare.link',
        robots: 'noindex, nofollow',
      },
    },
  },

  // Quickorder Extension
  {
    path: 'quick-order',
    loadComponent: () =>
      import('../extensions/quickorder/pages/quickorder/quickorder-page.component').then(
        c => c.QuickorderPageComponent
      ),
    canActivate: [featureToggleGuard],
    data: {
      feature: 'quickorder',
      breadcrumbData: [{ key: 'quickorder.page.breadcrumb' }],
      meta: {
        title: 'quickorder.page.breadcrumb',
        robots: 'noindex, nofollow',
      },
    },
  },

  // Quoting Extension
  {
    path: 'addProductToQuoteRequest',
    loadChildren: () => import('../extensions/quoting/pages/add-to-quote.routes').then(m => m.addToQuoteRoutes),
  },

  // Punchout Extension
  {
    path: 'punchout',
    canActivate: [featureToggleGuard],
    data: { feature: 'punchout' },
    loadChildren: () =>
      import('../extensions/punchout/pages/punchout-account-routing.module').then(m => m.PunchoutAccountRoutingModule),
  },

  // Store Locator Extension
  {
    path: 'store-finder',
    canActivate: [featureToggleGuard],
    loadComponent: () =>
      import('../extensions/store-locator/pages/store-locator/store-locator-page.component').then(
        m => m.StoreLocatorPageComponent
      ),
    data: {
      feature: 'storeLocator',
      meta: {
        title: 'store_locator.title',
        robots: 'noindex, nofollow',
      },
    },
  },

  // Recently Extension
  {
    path: 'recently',
    loadComponent: () =>
      import('../extensions/recently/pages/recently/recently-page.component').then(m => m.RecentlyPageComponent),
    canActivate: [featureToggleGuard],
    providers: [importProvidersFrom(RecentlyStoreModule)],
    data: {
      feature: 'recently',
      meta: {
        title: 'application.recentlyViewed.heading',
        robots: 'noindex, nofollow',
      },
      breadcrumbData: [{ key: 'application.recentlyViewed.breadcrumb.label' }],
    },
  },

  // Contact Us Extension
  {
    path: 'contact',
    loadComponent: () =>
      import('../extensions/contact-us/pages/contact/contact-page.component').then(m => m.ContactPageComponent),
    canActivate: [featureToggleGuard],
    providers: [importProvidersFrom(ContactUsStoreModule, CaptchaExportsModule)],
    data: {
      feature: 'contactUs',
      meta: {
        title: 'helpdesk.contact_us.heading',
        robots: 'index, nofollow',
      },
      breadcrumbData: [{ key: 'helpdesk.contact_us.link' }],
    },
  },

  // Wishlist Sharing Extension
  {
    path: 'wishlists',
    loadChildren: () => import('../extensions/wishlists/pages/wishlist-sharing.routes').then(m => m.routes),
  },
];
