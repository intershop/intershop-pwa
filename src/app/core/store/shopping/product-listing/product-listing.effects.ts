import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { mapTo, take } from 'rxjs/operators';

import { ENDLESS_SCROLLING_ITEMS_PER_PAGE } from 'ish-core/configurations/injection-keys';

import * as actions from './product-listing.actions';

@Injectable()
export class ProductListingEffects {
  constructor(@Inject(ENDLESS_SCROLLING_ITEMS_PER_PAGE) private itemsPerPage: number, private actions$: Actions) {}

  @Effect()
  initializePageSize$ = this.actions$.pipe(
    take(1),
    mapTo(new actions.SetEndlessScrollingPageSize({ itemsPerPage: this.itemsPerPage }))
  );
}
