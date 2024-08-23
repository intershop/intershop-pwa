import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { RecentlyFacade } from '../../facades/recently.facade';

@Component({
  selector: 'ish-recently-viewed',
  templateUrl: './recently-viewed.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class RecentlyViewedComponent implements OnInit {
  recentlyProducts$: Observable<string[]>;

  constructor(private recentlyFacade: RecentlyFacade, private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.recentlyProducts$ = this.shoppingFacade.excludeFailedProducts$(
      this.recentlyFacade.mostRecentlyViewedProducts$
    );
  }
}
