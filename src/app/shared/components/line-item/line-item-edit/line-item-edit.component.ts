import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

/**
 * The Line Item Edit Component displays an edit-link and edit-dialog.
 */
@Component({
  selector: 'ish-line-item-edit',
  templateUrl: './line-item-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineItemEditComponent implements OnInit {
  @ViewChild('modalDialog') modalDialogRef: ModalDialogComponent<unknown>;

  @Input({ required: true }) itemId: string;
  @Output() updateItem = new EventEmitter<LineItemUpdate>();

  product$: Observable<ProductView>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.product$ = this.context.select('product');
  }

  show() {
    this.modalDialogRef.show();

    this.context.hold(this.context.select('product'), product => {
      this.modalDialogRef.options.confirmDisabled = !product.available;
    });

    this.context.hold(this.modalDialogRef.confirmed, () =>
      this.updateItem.emit({
        itemId: this.itemId,
        sku: this.context.get('sku'),
        quantity: this.context.get('quantity'),
      })
    );
  }
}
