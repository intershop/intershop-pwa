import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
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

  constructor(private returnRequestFacade: ReturnRequestFacade) {}

  ngOnInit() {
    this.form = new FormGroup({
      checkAll: new FormControl(false),
      items: new FormGroup({}),
      comment: new FormControl(''),
    });

    this.returnableItems$ = this.returnRequestFacade.getOrderReturnableItems$(this.order?.id);
  }

  get selectionCount() {
    return this.positions?.reduce((acc, nxt) => acc + nxt.quantity, 0) ?? 0;
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

  private request(): CreateReturnRequestPayload {
    return {
      type: 'RETURN',
      positions: this.positions,
      customAttributes: [],
    };
  }

  submit() {
    this.returnRequestFacade.createRequest(this.order.id, this.request());
    this.hideModal();
  }
}
