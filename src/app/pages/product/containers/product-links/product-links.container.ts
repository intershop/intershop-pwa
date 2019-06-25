import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ProductLinksView } from 'ish-core/models/product-links/product-links.model';
import { LoadProductLinks, getProductLinks } from 'ish-core/store/shopping/products';

@Component({
  selector: 'ish-product-links-container',
  templateUrl: './product-links.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductLinksContainerComponent implements OnChanges {
  @Input() sku: string;

  links$: Observable<ProductLinksView>;

  constructor(private store: Store<{}>) {}

  ngOnChanges() {
    if (this.sku) {
      this.store.dispatch(new LoadProductLinks({ sku: this.sku }));
      this.links$ = this.store.pipe(select(getProductLinks, { sku: this.sku }));
    }
  }
}
