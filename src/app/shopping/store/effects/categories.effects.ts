import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { catchError, delay, filter, map, switchMap } from 'rxjs/operators';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import * as categoriesReducers from '../../store/reducers/categories.reducer';
import * as categoriesActions from '../actions/categories.actions';
import * as categoriesSelectors from '../selectors/categories.selectors';

@Injectable()
export class CategoriesEffects {
  constructor(
    private actions$: Actions,
    private store: Store<categoriesReducers.CategoriesState>,
    private categoryService: CategoriesService
  ) { }

  @Effect()
  loadCategory$ = this.actions$.pipe(
    ofType(categoriesActions.LOAD_CATEGORY),
    map((action: categoriesActions.LoadCategory) => action.payload),
    switchMap(categoryUniqueId => {
      return this.categoryService.getCategory(categoryUniqueId).pipe(
        delay(2000), // DEBUG
        map(category => new categoriesActions.LoadCategorySuccess(category)),
        catchError(error => of(new categoriesActions.LoadCategoryFail(error)))
      );
    })
  );

  @Effect()
  selectedCategory$ = this.store.select(categoriesSelectors.getSelectedCategoryId).pipe(
    filter(id => !!id),
    map(id => new categoriesActions.LoadCategory(id)),
  );
}
