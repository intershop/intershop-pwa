import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, switchMap } from 'rxjs/operators';

import { FilterService } from 'ish-core/services/filter/filter.service';
import { personalizationStatusDetermined } from 'ish-core/store/customer/user';
import { delayUntil, mapErrorToAction, mapToPayload } from 'ish-core/utils/operators';

import {
  applyFilter,
  applyFilterFail,
  applyFilterSuccess,
  loadFilterFail,
  loadFilterForCategory,
  loadFilterForMaster,
  loadFilterForSearch,
  loadFilterSuccess,
} from './filter.actions';

@Injectable()
export class FilterEffects {
  constructor(private actions$: Actions, private filterService: FilterService) {}

  loadAvailableFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFilterForCategory, loadFilterForSearch, loadFilterForMaster),
      delayUntil(this.actions$.pipe(ofType(personalizationStatusDetermined))),
      map(action => {
        switch (action.type) {
          case loadFilterForCategory.type:
            return this.filterService.getFilterForCategory(action.payload.uniqueId);
          case loadFilterForSearch.type:
            return this.filterService.getFilterForSearch(action.payload.searchTerm);
          case loadFilterForMaster.type:
            return this.filterService.getFilterForMaster(action.payload.masterSKU);
        }
      }),
      switchMap(observable$ =>
        observable$.pipe(
          map(filterNavigation => loadFilterSuccess({ filterNavigation })),
          mapErrorToAction(loadFilterFail)
        )
      )
    )
  );

  applyFilter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(applyFilter),
      mapToPayload(),
      mergeMap(({ searchParameter }) =>
        this.filterService.applyFilter(searchParameter).pipe(
          map(availableFilter => applyFilterSuccess({ availableFilter, searchParameter })),
          mapErrorToAction(applyFilterFail)
        )
      )
    )
  );
}
