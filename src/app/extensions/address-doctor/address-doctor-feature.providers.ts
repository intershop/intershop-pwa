import { EnvironmentProviders, Provider } from '@angular/core';

import { FEATURE_EVENT_RESULT_LISTENER } from 'ish-core/utils/feature-event/feature-event.service';
import { LAZY_FEATURE_PROVIDER } from 'ish-core/utils/module-loader/module-loader.service';

import { AddressDoctorEventsService } from './services/address-doctor-events/address-doctor-events.service';

export function provideAddressDoctorFeature(): (EnvironmentProviders | Provider)[] {
  return [
    {
      provide: LAZY_FEATURE_PROVIDER,
      useValue: {
        feature: 'addressDoctor',
        providers: () => import('./store/address-doctor-store.providers').then(m => m.provideAddressDoctorStore()),
      },
      multi: true,
    },
    {
      provide: FEATURE_EVENT_RESULT_LISTENER,
      useFactory: AddressDoctorEventsService.checkAddressResultListenerFactory,
      multi: true,
    },
  ];
}

export const ADDRESS_DOCTOR_FEATURE_PROVIDERS = provideAddressDoctorFeature();
