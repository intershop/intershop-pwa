/* eslint-disable ish-custom-rules/ban-imports-file-pattern */
import {
  APP_ID,
  ApplicationConfig,
  EnvironmentProviders,
  TransferState,
  inject,
  provideAppInitializer,
} from '@angular/core';
import {
  UrlSerializer,
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
  withPreloading,
} from '@angular/router';
import { provideFormlyCore } from '@ngx-formly/core';
import { provideOrganizationManagementStore } from 'organization-management';
import { provideRequisitionManagementStore } from 'requisition-management';

import { COOKIE_CONSENT_VERSION } from 'ish-core/configurations/state-keys';
import { provideCore } from 'ish-core/core.providers';
import { PWAUrlSerializer } from 'ish-core/routing/pwa-url.serializer';
import { SelectivePreloadingStrategy } from 'ish-core/routing/selective-preloading-strategy';
import { ModuleLoaderService } from 'ish-core/utils/module-loader/module-loader.service';
import { provideCMS } from 'ish-shared/cms/cms.providers';

import { environment } from '../environments/environment';

import { provideAddressDoctorFeature } from './extensions/address-doctor/address-doctor-feature.providers';
import { provideCaptchaFeature } from './extensions/captcha/captcha-feature.providers';
import { provideCompareFeature } from './extensions/compare/compare-feature.providers';
import { provideContactUsFeature } from './extensions/contact-us/contact-us-feature.providers';
import { provideCopilotFeature } from './extensions/copilot/copilot-feature.providers';
import { provideOrderTemplatesFeature } from './extensions/order-templates/order-templates-feature.providers';
import { provideProductNotificationsFeature } from './extensions/product-notifications/product-notifications-feature.providers';
import { providePunchoutFeature } from './extensions/punchout/punchout-feature.providers';
import { provideQuotingFeature } from './extensions/quoting/quoting-feature.providers';
import { provideRatingFeature } from './extensions/rating/rating-feature.providers';
import { provideRecentlyFeature } from './extensions/recently/recently-feature.providers';
import { provideSeoFeature } from './extensions/seo/seo-feature.providers';
import { provideTrackingFeature } from './extensions/tracking/tracking-feature.providers';
import { provideWishlistsFeature } from './extensions/wishlists/wishlists-feature.providers';
import { appLastRoutes } from './pages/app-last.routes';
import { appRoutes } from './pages/app.routes';

function initializeCookieConsent() {
  const transferState = inject(TransferState);
  if (!transferState.hasKey<number>(COOKIE_CONSENT_VERSION)) {
    transferState.set(COOKIE_CONSENT_VERSION, environment.cookieConsentVersion);
  }
}

function initializeModuleLoader() {
  const moduleLoader = inject(ModuleLoaderService);
  moduleLoader.init();
}

function provideFeatureStores(): EnvironmentProviders[] {
  return [
    // Feature stores needed by widgets outside their dedicated feature routes
    provideOrganizationManagementStore(),
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
    { provide: UrlSerializer, useClass: PWAUrlSerializer },
    { provide: APP_ID, useValue: 'intershop-pwa' },
    provideAppInitializer(initializeCookieConsent),
    provideAppInitializer(initializeModuleLoader),
    provideCore(),
    provideCMS(),
    provideFormlyCore(),
    ...provideAddressDoctorFeature(),
    ...provideCaptchaFeature(),
    ...provideCopilotFeature(),
    ...provideCompareFeature(),
    ...provideContactUsFeature(),
    ...provideOrderTemplatesFeature(),
    ...providePunchoutFeature(),
    ...provideProductNotificationsFeature(),
    ...provideQuotingFeature(),
    ...provideRatingFeature(),
    ...provideRecentlyFeature(),
    ...provideSeoFeature(),
    ...provideTrackingFeature(),
    ...provideWishlistsFeature(),
    ...provideFeatureStores(),
  ],
};
