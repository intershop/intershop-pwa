import { Routes } from '@angular/router';
import { provideFormlyConfig } from '@ngx-formly/core';

import { featureToggleGuard } from 'ish-core/feature-toggle';
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
    loadChildren: () =>
      Promise.all([import('./home/home-page.component'), import('ish-shared/formly/formly')]).then(
        ([{ HomePageComponent }, { provideIshFormly }]) => [
          {
            path: '',
            component: HomePageComponent,
            providers: [...provideIshFormly()],
            data: { wrapperClass: 'homepage' },
          },
        ]
      ),
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
        import('./account/account-page.routes'),
        import('ish-shared/formly/formly'),
        import('ish-shared/formly-address-forms/formly-address-forms'),
        import('ish-core/store/customer/customer-account-store.providers'),
        import('ish-core/store/general/general-store.providers'),
      ]).then(
        ([
          { accountPageRoutes },
          { provideIshFormly },
          { provideIshFormlyAddressForms },
          { provideCustomerAccountStore },
          { provideGeneralStore },
        ]) => {
          const [rootRoute, ...nestedRoutes] = accountPageRoutes;
          const providers = [
            ...provideIshFormly(),
            ...provideIshFormlyAddressForms(),
            provideCustomerAccountStore(),
            provideGeneralStore(),
          ];
          return rootRoute
            ? [{ ...rootRoute, providers: [...(rootRoute.providers ?? []), ...providers] }, ...nestedRoutes]
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
    loadChildren: () =>
      Promise.all([import('./search/search-page.component'), import('ish-shared/formly/formly')]).then(
        ([{ SearchPageComponent }, { provideIshFormly }]) => [
          {
            path: '',
            component: SearchPageComponent,
            providers: [...provideIshFormly()],
          },
        ]
      ),
    data: {
      preload: 'eager',
      breadcrumbData: [{ key: 'search.breadcrumbs.your_search.label' }],
    },
  },
  {
    path: 'basket',
    loadChildren: () =>
      Promise.all([import('./basket/basket-page.component'), import('ish-shared/formly/formly')]).then(
        ([{ BasketPageComponent }, { provideIshFormly }]) => [
          {
            path: '',
            component: BasketPageComponent,
            providers: [...provideIshFormly()],
            data: {
              preload: 'lazy',
              meta: {
                title: 'shopping_cart.heading',
                robots: 'noindex, nofollow',
              },
            },
          },
        ]
      ),
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
        import('./checkout/checkout-page.routes'),
        import('ish-shared/formly/formly'),
        import('ish-shared/formly-address-forms/formly-address-forms'),
        import('ish-core/store/customer/customer-account-store.providers'),
        import('ish-core/store/general/general-store.providers'),
      ]).then(
        ([
          { checkoutPageRoutes },
          { provideIshFormly },
          { provideIshFormlyAddressForms },
          { provideCustomerAccountStore },
          { provideGeneralStore },
        ]) => {
          const [rootRoute, ...nestedRoutes] = checkoutPageRoutes;
          const providers = [
            ...provideIshFormly(),
            ...provideIshFormlyAddressForms(),
            provideCustomerAccountStore(),
            provideGeneralStore(),
          ];
          return rootRoute
            ? [{ ...rootRoute, providers: [...(rootRoute.providers ?? []), ...providers] }, ...nestedRoutes]
            : [];
        }
      ),
  },
  {
    path: 'register',
    canActivate: [identityProviderRegisterGuard],
    loadChildren: () =>
      Promise.all([
        import('./registration/registration-page.routes'),
        import('ish-shared/formly/formly'),
        import('ish-shared/formly-address-forms/formly-address-forms'),
        import('ish-core/store/customer/customer-account-store.providers'),
        import('ish-core/store/general/general-store.providers'),
      ]).then(
        ([
          { registrationFormlyConfig, registrationPageRoutes },
          { provideIshFormly },
          { provideIshFormlyAddressForms },
          { provideCustomerAccountStore },
          { provideGeneralStore },
        ]) => {
          const [rootRoute, ...nestedRoutes] = registrationPageRoutes;
          const providers = [
            RegistrationFormConfigurationService,
            ...provideIshFormly(),
            ...provideIshFormlyAddressForms(),
            provideCustomerAccountStore(),
            provideGeneralStore(),
            provideFormlyConfig(registrationFormlyConfig),
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
      Promise.all([import('./login/login-page.routes'), import('ish-shared/formly/formly')]).then(
        ([{ loginPageRoutes }, { provideIshFormly }]) => {
          const [rootRoute, ...nestedRoutes] = loginPageRoutes;
          return rootRoute
            ? [{ ...rootRoute, providers: [...(rootRoute.providers ?? []), ...provideIshFormly()] }, ...nestedRoutes]
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
    loadChildren: () =>
      Promise.all([import('./forgot-password/forgot-password-page.routes'), import('ish-shared/formly/formly')]).then(
        ([{ forgotPasswordPageRoutes }, { provideIshFormly }]) => {
          const [rootRoute, ...nestedRoutes] = forgotPasswordPageRoutes;
          return rootRoute
            ? [{ ...rootRoute, providers: [...(rootRoute.providers ?? []), ...provideIshFormly()] }, ...nestedRoutes]
            : [];
        }
      ),
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
      Promise.all([import('./data-request/data-request-page.routes'), import('ish-shared/formly/formly')]).then(
        ([{ dataRequestPageRoutes }, { provideIshFormly }]) => {
          const [rootRoute, ...nestedRoutes] = dataRequestPageRoutes;
          return rootRoute
            ? [{ ...rootRoute, providers: [...(rootRoute.providers ?? []), ...provideIshFormly()] }, ...nestedRoutes]
            : [];
        }
      ),
    data: {
      meta: {
        title: 'personal.data.request.title',
        robots: 'noindex, nofollow',
      },
    },
  },
  {
    path: 'cookies',
    loadChildren: () =>
      Promise.all([import('./cookies/cookies-page.routes'), import('ish-shared/formly/formly')]).then(
        ([{ cookiesPageRoutes }, { provideIshFormly }]) => {
          const [rootRoute, ...nestedRoutes] = cookiesPageRoutes;
          return rootRoute
            ? [{ ...rootRoute, providers: [...(rootRoute.providers ?? []), ...provideIshFormly()] }, ...nestedRoutes]
            : [];
        }
      ),
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
    loadChildren: () =>
      Promise.all([
        import('../extensions/compare/pages/compare/compare-page.component'),
        import('ish-shared/formly/formly'),
      ]).then(([{ ComparePageComponent }, { provideIshFormly }]) => [
        {
          path: '',
          component: ComparePageComponent,
          providers: [...provideIshFormly()],
        },
      ]),
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
        m => m.QuickorderPageComponent
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
      Promise.all([
        import('../extensions/punchout/pages/punchout-account.routes'),
        import('ish-shared/formly/formly'),
      ]).then(([{ punchoutAccountRoutes }, { provideIshFormly }]) => {
        const [rootRoute, ...nestedRoutes] = punchoutAccountRoutes;
        return rootRoute
          ? [{ ...rootRoute, providers: [...(rootRoute.providers ?? []), ...provideIshFormly()] }, ...nestedRoutes]
          : [];
      }),
  },

  // Store Locator Extension
  {
    path: 'store-finder',
    loadChildren: () =>
      Promise.all([
        import('../extensions/store-locator/pages/store-locator/store-locator-page.component'),
        import('../extensions/store-locator/store/store-locator-store.providers'),
        import('ish-core/store/general/general-store.providers'),
        import('ish-shared/formly/formly'),
      ]).then(
        ([
          { StoreLocatorPageComponent },
          { provideStoreLocatorStore },
          { provideGeneralStore },
          { provideIshFormly },
        ]) => [
          {
            path: '',
            component: StoreLocatorPageComponent,
            canActivate: [featureToggleGuard],
            providers: [...provideIshFormly(), provideGeneralStore(), provideStoreLocatorStore()],
            data: {
              feature: 'storeLocator',
              meta: {
                title: 'store_locator.title',
                robots: 'noindex, nofollow',
              },
            },
          },
        ]
      ),
  },

  // Recently Extension
  {
    path: 'recently',
    loadChildren: () =>
      Promise.all([
        import('../extensions/recently/pages/recently/recently-page.component'),
        import('ish-shared/formly/formly'),
      ]).then(([{ RecentlyPageComponent }, { provideIshFormly }]) => [
        {
          path: '',
          component: RecentlyPageComponent,
          providers: [...provideIshFormly()],
        },
      ]),
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
      Promise.all([
        import('../extensions/contact-us/pages/contact/contact-page.routes'),
        import('ish-shared/formly/formly'),
      ]).then(([{ contactPageRoutes }, { provideIshFormly }]) => {
        const [rootRoute, ...nestedRoutes] = contactPageRoutes;
        return rootRoute
          ? [{ ...rootRoute, providers: [...(rootRoute.providers ?? []), ...provideIshFormly()] }, ...nestedRoutes]
          : [];
      }),
  },

  // Wishlist Sharing Extension
  {
    path: 'wishlists',
    loadChildren: () =>
      Promise.all([
        import('../extensions/wishlists/pages/wishlist-sharing.routes'),
        import('ish-shared/formly/formly'),
      ]).then(([{ routes }, { provideIshFormly }]) => {
        const [rootRoute, ...nestedRoutes] = routes;
        return rootRoute
          ? [{ ...rootRoute, providers: [...(rootRoute.providers ?? []), ...provideIshFormly()] }, ...nestedRoutes]
          : [];
      }),
  },
];
