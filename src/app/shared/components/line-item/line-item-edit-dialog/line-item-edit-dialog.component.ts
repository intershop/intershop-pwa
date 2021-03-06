import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { AnyProductViewType } from 'ish-core/models/product/product.helper';

/**
 * The Line Item Edit Dialog Component displays an edit-dialog of a line items to edit quantity and variation.
 */
@Component({
  selector: 'ish-line-item-edit-dialog',
  templateUrl: './line-item-edit-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineItemEditDialogComponent implements OnInit {
  variation$: Observable<AnyProductViewType>;
  loading$: Observable<boolean>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.variation$ = this.context.select('product');

    this.loading$ = this.context.select('loading');
  }
}
