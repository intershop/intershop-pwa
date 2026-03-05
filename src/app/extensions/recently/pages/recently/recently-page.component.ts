import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { BreadcrumbComponent } from 'ish-shared/components/common/breadcrumb/breadcrumb.component';
import { ProductsListComponent } from 'ish-shared/components/product/products-list/products-list.component';

import { RecentlyFacade } from '../../facades/recently.facade';

@Component({
  selector: 'ish-recently-page',
  templateUrl: './recently-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, BreadcrumbComponent, NgIf, ProductsListComponent, TranslatePipe],
})
export class RecentlyPageComponent implements OnInit {
  products$: Observable<string[]>;

  constructor(private recentlyFacade: RecentlyFacade, private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.products$ = this.shoppingFacade.excludeFailedProducts$(this.recentlyFacade.recentlyViewedProducts$);
  }

  clearAll() {
    this.recentlyFacade.clearRecentlyViewedProducts();
  }
}
