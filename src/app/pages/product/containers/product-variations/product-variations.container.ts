import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { VariationProductMaster } from 'ish-core/models/product/product-variation-master.model';
import { VariationProduct } from 'ish-core/models/product/product-variation.model';
import { getSelectedMasterProduct, getSelectedProductVariations } from 'ish-core/store/shopping/products';

@Component({
  selector: 'ish-product-variations-container',
  templateUrl: './product-variations.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductVariationsContainerComponent {
  @Input() product: VariationProduct | VariationProductMaster;

  masterProduct$ = this.store.pipe(select(getSelectedMasterProduct));
  variations$ = this.store.pipe(select(getSelectedProductVariations));

  constructor(private store: Store<{}>) {}
}
