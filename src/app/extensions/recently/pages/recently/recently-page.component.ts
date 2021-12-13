import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { RecentlyFacade } from '../../facades/recently.facade';

@Component({
  selector: 'ish-recently-page',
  templateUrl: './recently-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentlyPageComponent implements OnInit {
  products$: Observable<string[]>;

  constructor(private recentlyFacade: RecentlyFacade) {}

  ngOnInit() {
    this.products$ = this.recentlyFacade.recentlyViewedProducts$;
  }

  clearAll() {
    this.recentlyFacade.clearRecentlyViewedProducts();
  }
}
