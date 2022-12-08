import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnDestroy, ViewChild, inject } from '@angular/core';
import { Subject, filter, map, takeUntil, tap } from 'rxjs';
import { concatMap, first } from 'rxjs/operators';

import { Address } from 'ish-core/models/address/address.model';
import { FeatureEventService } from 'ish-core/utils/feature-event/feature-event.service';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';
import { whenPropertyHasValue } from 'ish-core/utils/operators';
import { ModalOptions } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { AddressDoctorFacade } from '../../facades/address-doctor.facade';
import { AddressDoctorEvents } from '../../models/address-doctor/address-doctor-event.model';
import { AddressDoctorHelper } from '../../models/address-doctor/address-doctor.helper';
import { AddressDoctorModalComponent } from '../address-doctor-modal/address-doctor-modal.component';

@Component({
  selector: 'ish-address-doctor',
  templateUrl: './address-doctor.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
@GenerateLazyComponent()
export class AddressDoctorComponent implements OnDestroy, AfterViewInit {
  @Input() options: ModalOptions;
  // related address doctor modal
  @ViewChild('modal') modal: AddressDoctorModalComponent;

  private featureEventService = inject(FeatureEventService);
  private addressDoctorFacade = inject(AddressDoctorFacade);

  private eventId: string;
  private destroy$ = new Subject<void>();

  ngAfterViewInit(): void {
    // react on all CheckAddress event notifier for 'addressDoctor' feature
    this.featureEventService.eventNotifier$
      .pipe(
        filter(({ event }) => event === AddressDoctorEvents.CheckAddress),
        whenPropertyHasValue('feature', 'addressDoctor'),
        // save notifier id for event result
        tap(({ id }) => (this.eventId = id)),
        map(({ data }) => this.mapToAddress(data)),
        concatMap(address =>
          this.addressDoctorFacade.checkAddress(address).pipe(
            first(),
            map(suggestions => ({ address, suggestions }))
          )
        ),
        takeUntil(this.destroy$)
      )
      // open related address doctor modal with event notifier address data
      .subscribe(({ address, suggestions }) => {
        if (
          suggestions?.length &&
          !suggestions.find(suggestion => AddressDoctorHelper.equalityCheck(address, suggestion))
        ) {
          this.modal.openModal(address, suggestions);
        } else {
          this.sendAddress(address);
        }
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapToAddress(data: any): Address {
    if (this.isCheckAddressOptions(data)) {
      const { address } = data;
      return address;
    }
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private isCheckAddressOptions(object: any): object is {
    address: Address;
  } {
    return 'address' in object;
  }

  /**
   * Send event result for given address
   * @param address address callback
   */
  sendAddress(address: Address) {
    this.featureEventService.sendResult(this.eventId, AddressDoctorEvents.CheckAddressSuccess, true, address);
  }

  /**
   * Send event result when modal component was cancelled
   */
  onModalHidden(hidden: boolean) {
    if (hidden) {
      this.featureEventService.sendResult(this.eventId, AddressDoctorEvents.CheckAddressCancelled, true);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
