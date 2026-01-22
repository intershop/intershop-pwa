import { NgModule } from '@angular/core';

import { FEATURE_EVENT_RESULT_LISTENER } from 'ish-core/utils/feature-event/feature-event.service';
import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

import { AddressDoctorEventsService } from '../services/address-doctor-events/address-doctor-events.service';

import { LazyAddressDoctorComponent } from './lazy-address-doctor/lazy-address-doctor.component';

@NgModule({
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'addressDoctor',
        location: () => import('../store/address-doctor-store.module').then(m => m.AddressDoctorStoreModule),
      },
      multi: true,
    },
    {
      provide: FEATURE_EVENT_RESULT_LISTENER,
      useFactory: AddressDoctorEventsService.checkAddressResultListenerFactory,
      multi: true,
    },
  ],
  exports: [LazyAddressDoctorComponent],
  declarations: [LazyAddressDoctorComponent],
})
export class AddressDoctorExportsModule {}
