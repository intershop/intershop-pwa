import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatomoTracker } from '@ngx-matomo/tracker';
import { Observable, Subject } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';

@Component({
  selector: 'ish-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent implements OnInit {
  private destroy = new Subject<void>();
  product$: Observable<ProductView>;

  constructor(private context: ProductContextFacade, private readonly tracker: MatomoTracker) {}
  ngOnInit() {
    this.product$ = this.context.select('product');
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
