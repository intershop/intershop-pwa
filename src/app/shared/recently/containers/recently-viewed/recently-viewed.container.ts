import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';

@Component({
  selector: 'ish-recently-viewed-container',
  templateUrl: './recently-viewed.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentlyViewedContainerComponent implements OnInit {
  recentlyProducts$: Observable<string[]>;

  constructor(private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.recentlyProducts$ = this.shoppingFacade.mostRecentlyViewedProducts$;
  }
}
