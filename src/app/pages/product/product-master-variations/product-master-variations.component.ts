import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivationStart, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounce, filter, map, takeUntil } from 'rxjs/operators';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

@Component({
  selector: 'ish-product-master-variations',
  templateUrl: './product-master-variations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductMasterVariationsComponent implements OnInit {
  sku$: Observable<string>;
  categoryId$: Observable<string>;
  variationCount$: Observable<number>;

  constructor(private router: Router, private scroller: ViewportScroller, private context: ProductContextFacade) {}

  ngOnInit() {
    this.sku$ = this.context.select('product', 'sku');
    this.categoryId$ = this.context.select('categoryId');
    this.variationCount$ = this.context.select('variationCount');

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
      // tslint:disable-next-line: rxjs-prefer-angular-takeuntil
      .subscribe(position => {
        this.scroller.scrollToPosition(position);
      });
  }
}
