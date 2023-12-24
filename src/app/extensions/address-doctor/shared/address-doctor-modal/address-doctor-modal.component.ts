import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';

import { Address } from 'ish-core/models/address/address.model';
import { ModalOptions } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

@Component({
  selector: 'ish-address-doctor-modal',
  templateUrl: './address-doctor-modal.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AddressDoctorModalComponent {
  @Input() options: ModalOptions;
  @Output() confirmAddress = new EventEmitter<Address>();
  @Output() hidden = new EventEmitter<boolean>();
  @ViewChild('template', { static: true }) modalDialogTemplate: TemplateRef<unknown>;

  private ngbModal = inject(NgbModal);
  private translateService = inject(TranslateService);
  private destroyRef = inject(DestroyRef);

  ngbModalRef: NgbModalRef;

  form: FormGroup = new FormGroup({});
  fields: FormlyFieldConfig[];
  model: {
    defaultText: string;
    suggestionText: string;
    address: Address;
  };

  openModal(address: Address, suggestions: Address[]) {
    this.fields = this.getFields(address, suggestions);
    this.model = {
      defaultText: `
        ${this.translateService.instant('address.doctor.suggestion.text')}
        <h3 class="mb-0">${this.translateService.instant('address.doctor.suggestion.address')}</h3>`,
      suggestionText: `<h3 class="mb-0">${this.translateService.instant('address.doctor.suggestion.proposals')}</h3>`,
      address,
    };

    this.ngbModalRef = this.ngbModal.open(this.modalDialogTemplate, this.options || { size: 'lg' });
    this.ngbModalRef.hidden.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.hidden.emit(true);
    });
  }

  hide() {
    this.ngbModalRef.close();
  }

  confirm() {
    this.ngbModalRef.close();
    this.confirmAddress.emit(this.model.address);
  }

  getFields(address: Address, suggestions: Address[]): FormlyFieldConfig[] {
    return [
      {
        type: 'ish-html-text-field',
        key: 'defaultText',
        wrappers: [],
        props: {
          fieldClass: 'col-12',
        },
      },
      {
        type: 'ish-radio-field',
        key: 'address',
        props: {
          fieldClass: 'col-12',
          id: address.id,
          value: address,
          label: this.formatAddress(address),
        },
      },
      {
        type: 'ish-html-text-field',
        key: 'suggestionText',
        wrappers: [],
        props: {
          fieldClass: 'col-12',
        },
      },
      ...suggestions.map(suggestion => ({
        type: 'ish-radio-field',
        key: 'address',
        props: {
          fieldClass: 'col-12',
          id: suggestion.id,
          value: suggestion,
          label: this.formatAddress(suggestion),
        },
      })),
    ];
  }

  private formatAddress(address: Address): string {
    return `${address.addressLine1}, ${address.postalCode}, ${address.city}`;
  }
}
