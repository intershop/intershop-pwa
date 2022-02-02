import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { SelectedProductContextFacade } from 'ish-core/facades/selected-product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';

@Component({
  selector: 'ish-product-page',
  templateUrl: './product-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: ProductContextFacade, useClass: SelectedProductContextFacade }],
})
export class ProductPageComponent implements OnInit {
  productLoading$: Observable<boolean>;
  product$: Observable<ProductView>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.productLoading$ = this.context.select('loading');
    this.product$ = this.context.select('product');
  }
}
