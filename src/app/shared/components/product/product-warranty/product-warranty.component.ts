import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, map, shareReplay, take } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { Warranty } from 'ish-core/models/warranty/warranty.model';

/**
 * The Product Warranty Component displays either a form element (select box or radio buttons), so the user can select a warranty or displays the selected warranty.
 * The available warranty options are provided by the product via the product context facade instance.
 * If the user selects a warranty a submitWarranty event is emitted.
 *
 * @example
 * <ish-product-warranty
 *   [selectedWarrantySku]="pli.warranty?.sku"
 *   viewType="select" />
 */

@Component({
  selector: 'ish-product-warranty',
  templateUrl: './product-warranty.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductWarrantyComponent implements OnInit {
  // preselect a warranty
  @Input() selectedWarrantySku: string;
  @Input() viewType: 'radio' | 'select' | 'display' = 'radio';

  @Output() submitWarranty = new EventEmitter<string>();

  uuid: string = uuid();

  warranties$: Observable<Warranty[]>;
  noWarranty: Warranty;

  constructor(private productContext: ProductContextFacade, private translateService: TranslateService) {}

  ngOnInit() {
    this.noWarranty = {
      id: '',
      name: this.translateService.instant('product.warranty.no_protection_plan'),
      price: undefined,
    };

    this.warranties$ = this.productContext.select('product').pipe(
      map(product => (product.availableWarranties?.length ? [...product.availableWarranties, this.noWarranty] : [])),
      shareReplay(1)
    );
  }

  updateWarranty(warranty: string | EventTarget) {
    if (typeof warranty === 'string') {
      this.submitWarranty.emit(warranty);
    } else {
      this.submitWarranty.emit(warranty ? (warranty as HTMLDataElement).value : '');
    }
  }

  getSelectedWarranty$(warrantySku: string) {
    return this.warranties$.pipe(
      map(warranties => warranties.find(warranty => warranty.id === warrantySku)),
      take(1)
    );
  }
}
