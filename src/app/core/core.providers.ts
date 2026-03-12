import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {
  EnvironmentProviders,
  ErrorHandler,
  Optional,
  Provider,
  SkipSelf,
  importProvidersFrom,
  makeEnvironmentProviders,
} from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppearanceModule } from './appearance.module';
import { ConfigurationModule } from './configuration.module';
import { FeatureToggleModule } from './feature-toggle.module';
import { IdentityProviderModule } from './identity-provider.module';
import { ICMErrorMapperInterceptor } from './interceptors/icm-error-mapper.interceptor';
import { IdentityProviderInterceptor } from './interceptors/identity-provider.interceptor';
import { MockInterceptor } from './interceptors/mock.interceptor';
import { PaymentPayoneInterceptor } from './interceptors/payment-payone.interceptor';
import { PGIDChangeInterceptor } from './interceptors/pgid-change.interceptor';
import { PreviewInterceptor } from './interceptors/preview.interceptor';
import { InternationalizationModule } from './internationalization.module';
import { provideStateManagement } from './state-management.providers';
import { DefaultErrorHandler } from './utils/default-error-handler';

const coreImports = [
  AppearanceModule,
  ConfigurationModule,
  FeatureToggleModule,
  IdentityProviderModule,
  InternationalizationModule,
  ServiceWorkerModule.register('ngsw-worker.js', { enabled: SERVICE_WORKER }),
];

const coreProviders: (Provider | EnvironmentProviders)[] = [
  // include the ICMCompatibilityInterceptor to add support for REST API changes (e.g. messageToMerchant)
  // { provide: HTTP_INTERCEPTORS, useClass: ICMCompatibilityInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: PGIDChangeInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ICMErrorMapperInterceptor, multi: true },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: IdentityProviderInterceptor,
    multi: true,
  },
  { provide: HTTP_INTERCEPTORS, useClass: PaymentPayoneInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: MockInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: PreviewInterceptor, multi: true },
  { provide: ErrorHandler, useClass: DefaultErrorHandler },
  {
    provide: APP_BASE_HREF,
    useFactory: (s: PlatformLocation, baseHref: string) => baseHref || s.getBaseHrefFromDOM(),
    deps: [PlatformLocation, [new Optional(), new SkipSelf(), APP_BASE_HREF]],
  },
  provideHttpClient(withInterceptorsFromDi()),
];

export function provideCore(): EnvironmentProviders {
  return makeEnvironmentProviders([importProvidersFrom(...coreImports), provideStateManagement(), ...coreProviders]);
}
