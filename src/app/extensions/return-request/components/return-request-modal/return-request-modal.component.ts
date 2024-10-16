import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { Order } from 'ish-core/models/order/order.model';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { ReturnRequestFacade } from '../../facades/return-request.facade';
import {
  CreateReturnRequestPayload,
  CreateReturnRequestPosition,
  ReturnablePosition,
} from '../../models/return-request/return-request.model';
import { allowedStatus } from '../../util';

@Component({
  selector: 'ish-return-request-modal',
  templateUrl: './return-request-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnRequestModalComponent implements OnInit, OnChanges {
  @Input() order: Order;
  @Input() isOpenModal: boolean;
  @Input() isGuest: boolean;
  @Output() closeModal = new EventEmitter<void>();
  @ViewChild('returnRequestDialog') returnRequestDialog: ModalDialogComponent<unknown>;

  form: UntypedFormGroup;
  returnableItems$: Observable<ReturnablePosition[]>;

  positions: CreateReturnRequestPosition[];
  returnItemsLoaded = false;
  selectedQuantity = 0;

  constructor(private returnRequestFacade: ReturnRequestFacade, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.form = new FormGroup({
      checkAll: new FormControl(false),
      items: new FormGroup({}),
      comment: new FormControl(''),
    });
    this.returnableItems$ = this.returnRequestFacade.getOrderReturnableItems$({
      email: this.order?.email,
      documentNo: this.order?.documentNo,
      orderId: this.order?.id,
      isGuest: this.isGuest,
    });
  }

  ngOnChanges() {
    if (this.isOpenModal) {
      this.showModal();
    }
  }

  showModal() {
    this.returnRequestDialog.show();
  }

  hideModal() {
    this.returnRequestDialog.hide();
    this.closeModal.emit();
  }

  onItemsUpdate(data: CreateReturnRequestPosition[]) {
    this.positions = data;
  }

  onQuantityUpdate(data: number) {
    this.selectedQuantity = data;
    this.cdr.markForCheck();
  }

  private getRequest(): CreateReturnRequestPayload {
    const customAttributes = [];
    if (this.form.get('comment').value) {
      customAttributes.push({
        key: 'comment',
        value: this.form.get('comment').value,
      });
    }

    return {
      type: 'RETURN',
      positions: this.positions,
      customAttributes,
      isGuest: this.isGuest,
      orderId: this.order.id,
      email: this.order.email,
      documentNo: this.order.documentNo,
    };
  }

  hasStatusCode(status: string) {
    return allowedStatus(status);
  }

  submit() {
    this.returnRequestFacade.createRequest(this.getRequest());
    this.form.reset();
    this.hideModal();
  }
}
