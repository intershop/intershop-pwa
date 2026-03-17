import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { SearchNoResultComponent } from './search-no-result/search-no-result.component';
import { SearchResultComponent } from './search-result/search-result.component';

@Component({
  selector: 'ish-search-page',
  templateUrl: './search-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ AsyncPipe, LoadingComponent, SearchResultComponent, SearchNoResultComponent],
})
export class SearchPageComponent implements OnInit {
  searchTerm$: Observable<string>;
  numberOfItems$: Observable<number>;
  searchLoading$: Observable<boolean>;
  deviceType$: Observable<DeviceType>;
  filterParams$: Observable<string>;

  constructor(
    private shoppingFacade: ShoppingFacade,
    private appFacade: AppFacade,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.searchTerm$ = this.shoppingFacade.searchTerm$;
    this.numberOfItems$ = this.shoppingFacade.searchItemsCount$;
    this.searchLoading$ = this.shoppingFacade.searchLoading$;
    this.deviceType$ = this.appFacade.deviceType$;
    this.filterParams$ = this.activatedRoute.queryParamMap.pipe(map(x => x.get('filters')));
  }
}
