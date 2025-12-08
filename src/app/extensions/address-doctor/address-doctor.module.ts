import { NgModule } from '@angular/core';

import { FEATURE_EVENT_RESULT_LISTENER } from 'ish-core/utils/feature-event/feature-event.service';
import { SharedModule } from 'ish-shared/shared.module';

import { AddressDoctorEventsService } from './services/address-doctor-events/address-doctor-events.service';
import { AddressDoctorModalComponent } from './shared/address-doctor-modal/address-doctor-modal.component';
import { AddressDoctorComponent } from './shared/address-doctor/address-doctor.component';

@NgModule({
  imports: [SharedModule],
  declarations: [AddressDoctorComponent, AddressDoctorModalComponent],
  exports: [SharedModule],
  providers: [
    {
      provide: FEATURE_EVENT_RESULT_LISTENER,
      useFactory: AddressDoctorEventsService.checkAddressResultListenerFactory,
      multi: true,
    },
  ],
})
export class AddressDoctorModule {}
