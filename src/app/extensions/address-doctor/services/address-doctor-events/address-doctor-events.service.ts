import { inject } from '@angular/core';
import { filter, take, takeUntil } from 'rxjs/operators';

import { FeatureEventResultListener, FeatureEventService } from 'ish-core/utils/feature-event/feature-event.service';
import { whenTruthy } from 'ish-core/utils/operators';

import { AddressDoctorEvents } from '../../models/address-doctor/address-doctor-event.model';

export class AddressDoctorEventsService {
  static checkAddressResultListenerFactory(): FeatureEventResultListener {
    const featureEventService = inject(FeatureEventService);
    return {
      feature: 'addressDoctor',
      event: AddressDoctorEvents.CheckAddress,
      resultListener$: (id: string) => {
        if (!id) {
          return;
        }

        return featureEventService.eventResults$.pipe(
          whenTruthy(),
          // respond only when CheckAddressSuccess event is emitted for specific notification id
          filter(
            result => result.id === id && result.event === AddressDoctorEvents.CheckAddressSuccess && result.successful
          ),
          take(1),
          takeUntil(
            featureEventService.eventResults$.pipe(
              whenTruthy(),
              // close event stream when CheckAddressCancelled event is emitted for specific notification id
              filter(result => result.id === id && result.event === AddressDoctorEvents.CheckAddressCancelled)
            )
          )
        );
      },
    };
  }
}
