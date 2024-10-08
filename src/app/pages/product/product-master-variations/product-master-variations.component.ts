import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivationStart, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { debounce, filter, map, takeUntil } from 'rxjs/operators';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductHelper } from 'ish-core/models/product/product.model';

@Component({
  selector: 'ish-product-master-variations',
  templateUrl: './product-master-variations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// eslint-disable-next-line rxjs-angular/prefer-takeuntil
export class ProductMasterVariationsComponent implements OnInit {
  sku$: Observable<string>;
  categoryId$: Observable<string>;
  hasVariations$: Observable<boolean>;

  constructor(private router: Router, private scroller: ViewportScroller, private context: ProductContextFacade) {}

  ngOnInit() {
    this.sku$ = this.context.select('product', 'sku');
    this.categoryId$ = this.context.select('categoryId');
    this.hasVariations$ = combineLatest([
      this.context.select('product').pipe(map(product => ProductHelper.isMasterProduct(product))),
      this.context.select('variations').pipe(map(variations => variations?.length > 0)),
    ]).pipe(map(([isMaster, hasVariations]) => isMaster && hasVariations));

    this.router.events
      .pipe(
        // start when navigated
        filter(event => event instanceof NavigationStart),
        // remember current scroll position
        map(() => this.scroller.getScrollPosition()),
        // wait till navigation end
        debounce(() => this.router.events.pipe(filter(event => event instanceof NavigationEnd))),
        // take until routing away
        takeUntil(this.router.events.pipe(filter(event => event instanceof ActivationStart)))
      )
      // eslint-disable-next-line rxjs-angular/prefer-takeuntil
      .subscribe(position => {
        this.scroller.scrollToPosition(position);
      });
  }
}
