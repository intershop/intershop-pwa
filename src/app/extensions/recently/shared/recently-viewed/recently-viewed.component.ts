import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

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

  constructor(private recentlyFacade: RecentlyFacade) {}

  ngOnInit() {
    this.recentlyProducts$ = this.recentlyFacade.mostRecentlyViewedProducts$;
  }
}
