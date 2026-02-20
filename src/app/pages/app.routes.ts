import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';

import { featureToggleGuard } from 'ish-core/feature-toggle.module';
import { authGuard } from 'ish-core/guards/auth.guard';
import { errorStatusGuard } from 'ish-core/guards/error-status.guard';
import { identityProviderInviteGuard } from 'ish-core/guards/identity-provider-invite.guard';
import { identityProviderLoginGuard } from 'ish-core/guards/identity-provider-login.guard';
import { identityProviderLogoutGuard } from 'ish-core/guards/identity-provider-logout.guard';
import { identityProviderRegisterGuard } from 'ish-core/guards/identity-provider-register.guard';

import { coBrowsePageGuard } from './co-browse/co-browse-page.guard';
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
    loadChildren: () =>
      Promise.all([
        import('./account/account-page.module'),
        import('ish-shared/formly/formly.module'),
        import('ish-shared/formly-address-forms/formly-address-forms.module'),
      ]).then(
        ([
          { accountPageRoutes },
          { FormlyModule: ishFormlyModule },
          { FormlyAddressFormsModule: formlyAddressFormsModule },
        ]) => {
          const [rootRoute, ...nestedRoutes] = accountPageRoutes;
          const providers = importProvidersFrom(ishFormlyModule, formlyAddressFormsModule);
          return rootRoute
            ? [{ ...rootRoute, providers: [...(rootRoute.providers ?? []), providers] }, ...nestedRoutes]
            : [];
        }
      ),
    canActivate: [authGuard],
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
    loadChildren: () =>
      Promise.all([
        import('./checkout/checkout-page.module'),
        import('ish-shared/formly/formly.module'),
        import('ish-shared/formly-address-forms/formly-address-forms.module'),
      ]).then(
        ([
          { checkoutPageRoutes },
          { FormlyModule: ishFormlyModule },
          { FormlyAddressFormsModule: formlyAddressFormsModule },
        ]) => {
          const [rootRoute, ...nestedRoutes] = checkoutPageRoutes;
          const providers = importProvidersFrom(ishFormlyModule, formlyAddressFormsModule);
          return rootRoute
            ? [{ ...rootRoute, providers: [...(rootRoute.providers ?? []), providers] }, ...nestedRoutes]
            : [];
        }
      ),
  },
  {
    path: 'register',
    canActivate: [identityProviderRegisterGuard],
    loadChildren: () =>
      Promise.all([
        import('./registration/registration-page.module'),
        import('@ngx-formly/core'),
        import('ish-shared/formly/formly.module'),
        import('ish-shared/formly-address-forms/formly-address-forms.module'),
        import('ish-shared/formly/field-library/field-library.module'),
      ]).then(
        ([
          { registrationFormlyConfig, registrationPageRoutes },
          { FormlyModule: formlyModule },
          { FormlyModule: ishFormlyModule },
          { FormlyAddressFormsModule: formlyAddressFormsModule },
          { FieldLibraryModule: fieldLibraryModule },
        ]) => {
          const [rootRoute, ...nestedRoutes] = registrationPageRoutes;
          const providers = [
            RegistrationFormConfigurationService,
            importProvidersFrom(fieldLibraryModule, formlyAddressFormsModule, ishFormlyModule),
            importProvidersFrom(formlyModule.forChild(registrationFormlyConfig)),
          ];
          return rootRoute
            ? [{ ...rootRoute, providers: [...(rootRoute.providers ?? []), ...providers] }, ...nestedRoutes]
            : [];
        }
      ),
    data: {
      meta: {
        title: 'account.register.link',
        robots: 'noindex, nofollow',
      },
    },
  },
  {
    path: 'login',
    loadChildren: () =>
      Promise.all([import('./login/login-page.module'), import('ish-shared/formly/formly.module')]).then(
        ([{ loginPageRoutes }, { FormlyModule: ishFormlyModule }]) => {
          const [rootRoute, ...nestedRoutes] = loginPageRoutes;
          const providers = importProvidersFrom(ishFormlyModule);
          return rootRoute
            ? [{ ...rootRoute, providers: [...(rootRoute.providers ?? []), providers] }, ...nestedRoutes]
            : [];
        }
      ),
    canActivate: [identityProviderLoginGuard],
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
    loadChildren: () =>
      import('./data-request/data-request-page.module').then(({ dataRequestPageRoutes }) => dataRequestPageRoutes),
    data: {
      meta: {
        title: 'personal.data.request.title',
        robots: 'noindex, nofollow',
      },
    },
  },
  {
    path: 'cookies',
    loadChildren: () => import('./cookies/cookies-page.module').then(({ cookiesPageRoutes }) => cookiesPageRoutes),
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
      import('../extensions/punchout/pages/punchout-account.routes').then(m => m.punchoutAccountRoutes),
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
    loadChildren: () =>
      import('../extensions/contact-us/pages/contact/contact-page.routes').then(m => m.contactPageRoutes),
  },

  // Wishlist Sharing Extension
  {
    path: 'wishlists',
    loadChildren: () => import('../extensions/wishlists/pages/wishlist-sharing.routes').then(m => m.routes),
  },
];
