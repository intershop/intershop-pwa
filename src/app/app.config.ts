/* eslint-disable ish-custom-rules/ban-imports-file-pattern */
import {
  APP_ID,
  APP_INITIALIZER,
  ApplicationConfig,
  EnvironmentProviders,
  Injector,
  TransferState,
  importProvidersFrom,
} from '@angular/core';
import { provideClientHydration, withNoHttpTransferCache } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  UrlSerializer,
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
  withPreloading,
} from '@angular/router';
import { FormlyModule as FormlyBaseModule } from '@ngx-formly/core';
import { provideRequisitionManagementStore } from 'requisition-management';

import { COOKIE_CONSENT_VERSION } from 'ish-core/configurations/state-keys';
import { CoreModule } from 'ish-core/core.module';
import { PWAUrlSerializer } from 'ish-core/routing/pwa-url.serializer';
import { SelectivePreloadingStrategy } from 'ish-core/routing/selective-preloading-strategy';
import { StateManagementModule } from 'ish-core/state-management.module';
import { ModuleLoaderService } from 'ish-core/utils/module-loader/module-loader.service';

import { environment } from '../environments/environment';

import { CompareExportsModule } from './extensions/compare/exports/compare-exports.module';
import { CopilotExportsModule } from './extensions/copilot/exports/copilot-exports.module';
import { OrderTemplatesExportsModule } from './extensions/order-templates/exports/order-templates-exports.module';
import { ProductNotificationsExportsModule } from './extensions/product-notifications/exports/product-notifications-exports.module';
import { QuickorderExportsModule } from './extensions/quickorder/exports/quickorder-exports.module';
import { RecentlyStoreModule } from './extensions/recently/store/recently-store.module';
import { SeoExportsModule } from './extensions/seo/exports/seo-exports.module';
import { StoreLocatorExportsModule } from './extensions/store-locator/exports/store-locator-exports.module';
import { TrackingExportsModule } from './extensions/tracking/exports/tracking-exports.module';
import { WishlistsExportsModule } from './extensions/wishlists/exports/wishlists-exports.module';
import { appLastRoutes, appRoutes } from './pages/app-routing.module';

function initializeCookieConsent(transferState: TransferState) {
  return () => {
    if (!transferState.hasKey<number>(COOKIE_CONSENT_VERSION)) {
      transferState.set(COOKIE_CONSENT_VERSION, environment.cookieConsentVersion);
    }
  };
}

function initializeModuleLoader(moduleLoader: ModuleLoaderService, injector: Injector) {
  return () => {
    moduleLoader.init(injector);
  };
}

function provideFeatureStores(): EnvironmentProviders[] {
  return [
    // Requisition feature store is needed by requisition widgets outside the feature route
    provideRequisitionManagementStore(),
  ];
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      [...appRoutes, ...appLastRoutes],
      withEnabledBlockingInitialNavigation(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
      withPreloading(SelectivePreloadingStrategy)
    ),
    provideAnimations(),
    provideClientHydration(withNoHttpTransferCache()),
    { provide: UrlSerializer, useClass: PWAUrlSerializer },
    { provide: APP_ID, useValue: 'intershop-pwa' },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeCookieConsent,
      deps: [TransferState],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeModuleLoader,
      deps: [ModuleLoaderService, Injector],
      multi: true,
    },
    // Import providers from existing NgModules during migration
    // Extension export modules must be imported to register LAZY_FEATURE_MODULE providers
    importProvidersFrom(
      CoreModule,
      StateManagementModule,
      // Formly root providers must be registered once globally
      FormlyBaseModule.forRoot(),
      // Recently feature store is needed on product pages for recently viewed tracking
      RecentlyStoreModule,
      CopilotExportsModule,
      CompareExportsModule,
      OrderTemplatesExportsModule,
      ProductNotificationsExportsModule,
      QuickorderExportsModule,
      SeoExportsModule,
      StoreLocatorExportsModule,
      TrackingExportsModule,
      WishlistsExportsModule
    ),
    ...provideFeatureStores(),
  ],
};
