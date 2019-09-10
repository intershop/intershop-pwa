import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ActivationStart, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { debounce, filter, map, takeUntil } from 'rxjs/operators';

import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { VariationProductMasterView } from 'ish-core/models/product-view/product-view.model';

@Component({
  selector: 'ish-product-master-variations',
  templateUrl: './product-master-variations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductMasterVariationsComponent implements OnInit {
  @Input() product: VariationProductMasterView;
  @Input() category: CategoryView;

  constructor(private router: Router, private scroller: ViewportScroller) {}

  ngOnInit() {
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
      .subscribe(position => {
        this.scroller.scrollToPosition(position);
      });
  }
}
