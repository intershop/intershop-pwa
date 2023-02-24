import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, map } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { Warranty } from 'ish-core/models/warranty/warranty.model';

/**
 * The Product Warranty Component displays a form element (either select box or radio buttons), so the user can select a warranty.
 * The warranty options are provided by the product via the product context facade instance.
 * If the user selects a warranty a submitWarranty event is emitted.
 *
 * @example
 * <ish-product-warranty
 *   [selectedWarranty]="warranty"
 *   viewType="select"
 * ></ish-product-warranty>
 */

@Component({
  selector: 'ish-product-warranty',
  templateUrl: './product-warranty.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductWarrantyComponent implements OnInit {
  // preselect a warranty
  @Input() selectedWarranty: Warranty;
  @Input() viewType: 'radio' | 'select' = 'radio';

  @Output() submitWarranty = new EventEmitter<string>();

  uuid: string = uuid();

  warranties$: Observable<Warranty[]>;

  constructor(private productContext: ProductContextFacade) {}

  ngOnInit(): void {
    this.warranties$ = this.productContext.select('product').pipe(map(product => product.availableWarranties));
  }

  updateWarranty(warranty: string | EventTarget) {
    if (typeof warranty === 'string') {
      this.submitWarranty.emit(warranty);
    } else {
      this.submitWarranty.emit(warranty ? (warranty as HTMLDataElement).value : '');
    }
  }
}
