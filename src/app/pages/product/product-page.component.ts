import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { SelectedProductContextFacade } from 'ish-core/facades/selected-product-context.facade';

@Component({
  selector: 'ish-product-page',
  templateUrl: './product-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: ProductContextFacade, useClass: SelectedProductContextFacade }],
})
export class ProductPageComponent implements OnInit {
  productLoading$: Observable<boolean>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.productLoading$ = this.context.select('loading');
  }
}
