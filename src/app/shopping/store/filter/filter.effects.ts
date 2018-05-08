import { FilterService } from './../../services/filter/filter.service';
import { FilterActions, LoadFilterForCategory, LoadFilterForCategorySuccess } from './filter.actions';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { RouteNavigation, ROUTER_NAVIGATION_TYPE } from 'ngrx-router';
import { of } from 'rxjs/observable/of';
import {
  catchError,
  concatMap,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  skip,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { CoreState } from '../../../core/store/core.state';
import { LocaleActionTypes } from '../../../core/store/locale';
import { ProductsService } from '../../services/products/products.service';
import * as filterActions from '../filter/filter.actions';
import { ShoppingState } from '../shopping.state';
import * as fromViewconf from '../viewconf';
import { log } from '../../../utils/dev/operators';

@Injectable()
export class FilterEffects {
  constructor(
    private actions$: Actions,
    private store: Store<ShoppingState | CoreState>,
    private filterService: FilterService,
    private router: Router
  ) {}

  @Effect()
  loadAvailableFilterForCategories$ = this.actions$.pipe(
    ofType(filterActions.FilterActionTypes.LoadFilterForCategory),
    log("w"),
    mergeMap((action: LoadFilterForCategory) =>
      this.filterService.changeToFilterForCategory(action.payload.parent, action.payload.category)
    ),
    map(filter => {
      console.log(filter);
      return new LoadFilterForCategorySuccess(filter);
    })
  );
}
