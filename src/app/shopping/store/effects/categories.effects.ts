import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap } from 'rxjs/operators';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import * as categoriesActions from '../actions/categories.actions';

@Injectable()
export class CategoriesEffects {
  constructor(
    private actions$: Actions,
    private categoryService: CategoriesService
  ) { }

  @Effect()
  loadCategory$ = this.actions$.pipe(
    ofType(categoriesActions.LOAD_CATEGORY),
    map((action: categoriesActions.LoadCategory) => action.payload),
    switchMap(categoryUniqueId => {
      return this.categoryService.getCategory(categoryUniqueId).pipe(
        map(category => new categoriesActions.LoadCategorySuccess(category)),
        catchError(error => of(new categoriesActions.LoadCategoryFail(error)))
      );
    })
  );
}
