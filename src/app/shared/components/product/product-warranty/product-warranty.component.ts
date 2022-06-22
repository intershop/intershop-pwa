import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, map } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { Warranty } from 'ish-core/models/warranty/warranty.model';

@Component({
  selector: 'ish-product-warranty',
  templateUrl: './product-warranty.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductWarrantyComponent implements OnInit {
  // preselection for the radio buttons
  @Input() selected = 'noWarranty';
  @Input() viewType: 'radio' | 'select' = 'radio';

  @Output() submitWarranty = new EventEmitter<string>();

  uuid: string = uuid();

  warranties$: Observable<Warranty[]>;

  constructor(private productContext: ProductContextFacade) {}

  ngOnInit(): void {
    this.warranties$ = this.productContext.select('product').pipe(map(product => product.availableWarranties));
  }

  submitSelectedWarranty(selectedWarranty: string | EventTarget | undefined) {
    if (typeof selectedWarranty === 'string') {
      this.submitWarranty.emit(selectedWarranty);
    } else {
      this.submitWarranty.emit(
        selectedWarranty === undefined ? undefined : (selectedWarranty as HTMLDataElement).value
      );
    }
  }
}
