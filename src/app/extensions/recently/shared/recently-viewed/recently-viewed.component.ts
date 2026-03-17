import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { BrowserLazyViewDirective } from 'ish-core/directives/browser-lazy-view.directive';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { SkipContentLinkComponent } from 'ish-shared/components/common/skip-content-link/skip-content-link.component';
import { ProductsListComponent } from 'ish-shared/components/product/products-list/products-list.component';

import { RecentlyFacade } from '../../facades/recently.facade';

@Component({
  selector: 'ish-recently-viewed',
  templateUrl: './recently-viewed.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    BrowserLazyViewDirective,
    ProductsListComponent,
    RouterLink,
    SkipContentLinkComponent,
    TranslatePipe],
})
export class RecentlyViewedComponent implements OnInit {
  recentlyProducts$: Observable<string[]>;

  constructor(private recentlyFacade: RecentlyFacade, private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.recentlyProducts$ = this.shoppingFacade.excludeFailedProducts$(
      this.recentlyFacade.mostRecentlyViewedProducts$
    );
  }
}
