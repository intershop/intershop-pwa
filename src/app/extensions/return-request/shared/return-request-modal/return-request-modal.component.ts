import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { Order } from 'ish-core/models/order/order.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';
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
@GenerateLazyComponent()
export class ReturnRequestModalComponent implements OnInit {
  @Input() order: Order;
  @Input() cssClass = 'text-right';
  @ViewChild('returnRequestDialog') returnRequestDialog: ModalDialogComponent<unknown>;

  form: UntypedFormGroup;
  returnableItems$: Observable<ReturnablePosition[]>;

  positions: CreateReturnRequestPosition[];
  selectedQuantity = 0;

  constructor(private returnRequestFacade: ReturnRequestFacade, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.form = new FormGroup({
      checkAll: new FormControl(false),
      items: new FormGroup({}),
      comment: new FormControl(''),
    });

    this.returnableItems$ = this.returnRequestFacade.getOrderReturnableItems$(this.order?.id);
  }

  showModal() {
    this.returnRequestDialog.show();
  }

  hideModal() {
    this.returnRequestDialog.hide();
  }

  onItemsUpdate(data: CreateReturnRequestPosition[]) {
    this.positions = data;
  }

  onQuantityUpdate(data: number) {
    this.selectedQuantity = data;
    this.cdr.markForCheck();
  }

  private request(): CreateReturnRequestPayload {
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
    };
  }

  hasStatusCode(status: string) {
    return allowedStatus(status);
  }

  submit() {
    this.returnRequestFacade.createRequest(this.order.id, this.request());
    this.hideModal();
  }
}
