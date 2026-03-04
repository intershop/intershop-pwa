/* eslint-disable ish-custom-rules/ban-imports-file-pattern */
import {
  APP_ID,
  APP_INITIALIZER,
  ApplicationConfig,
  EnvironmentProviders,
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

import { provideAddressDoctorFeature } from './extensions/address-doctor/address-doctor-feature.providers';
import { provideCaptchaFeature } from './extensions/captcha/captcha-feature.providers';
import { provideCompareFeature } from './extensions/compare/compare-feature.providers';
import { provideCopilotFeature } from './extensions/copilot/copilot-feature.providers';
import { provideOrderTemplatesFeature } from './extensions/order-templates/order-templates-feature.providers';
import { provideProductNotificationsFeature } from './extensions/product-notifications/product-notifications-feature.providers';
import { providePunchoutFeature } from './extensions/punchout/punchout-feature.providers';
import { provideQuotingFeature } from './extensions/quoting/quoting-feature.providers';
import { provideRatingFeature } from './extensions/rating/rating-feature.providers';
import { provideRecentlyFeature } from './extensions/recently/recently-feature.providers';
import { provideSeoFeature } from './extensions/seo/seo-feature.providers';
import { provideStoreLocatorFeature } from './extensions/store-locator/store-locator-feature.providers';
import { provideTrackingFeature } from './extensions/tracking/tracking-feature.providers';
import { provideWishlistsFeature } from './extensions/wishlists/wishlists-feature.providers';
import { appLastRoutes, appRoutes } from './pages/app-routing.module';

function initializeCookieConsent(transferState: TransferState) {
  return () => {
    if (!transferState.hasKey<number>(COOKIE_CONSENT_VERSION)) {
      transferState.set(COOKIE_CONSENT_VERSION, environment.cookieConsentVersion);
    }
  };
}

function initializeModuleLoader(moduleLoader: ModuleLoaderService) {
  return () => {
    moduleLoader.init();
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
      deps: [ModuleLoaderService],
      multi: true,
    },
    // Import providers from existing NgModules during migration
    importProvidersFrom(
      CoreModule,
      StateManagementModule,
      // Formly root providers must be registered once globally
      FormlyBaseModule.forRoot()
    ),
    ...provideAddressDoctorFeature(),
    ...provideCaptchaFeature(),
    ...provideCopilotFeature(),
    ...provideCompareFeature(),
    ...provideOrderTemplatesFeature(),
    ...providePunchoutFeature(),
    ...provideProductNotificationsFeature(),
    ...provideQuotingFeature(),
    ...provideRatingFeature(),
    ...provideRecentlyFeature(),
    ...provideSeoFeature(),
    ...provideStoreLocatorFeature(),
    ...provideTrackingFeature(),
    ...provideWishlistsFeature(),
    ...provideFeatureStores(),
  ],
};
