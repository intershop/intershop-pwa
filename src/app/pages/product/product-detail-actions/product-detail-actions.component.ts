import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ProductContextDisplayProperties, ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';

@Component({
  selector: 'ish-product-detail-actions',
  standalone: false,
  templateUrl: './product-detail-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailActionsComponent implements OnInit {
  channelName$: Observable<string>;
  product$: Observable<ProductView>;

  constructor(
    @Inject(DOCUMENT) public document: Document,
    private context: ProductContextFacade,
    private appFacade: AppFacade
  ) {}

  ngOnInit() {
    this.product$ = this.context.select('product');
    this.channelName$ = this.appFacade.channelName$;
  }

  configuration$(key: keyof ProductContextDisplayProperties) {
    return this.context.select('displayProperties', key);
  }
}
