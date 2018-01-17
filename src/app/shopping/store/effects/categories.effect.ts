import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap } from 'rxjs/operators';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import * as categoriesActions from '../actions/categories.action';




@Injectable()
export class CategoriesEffects {
  constructor(
    private actions$: Actions,
    private categoryService: CategoriesService
  ) { }

  @Effect()
  loadCategory$ = this.actions$.ofType(categoriesActions.LOAD_CATEGORY)
    .pipe(
    map((action: categoriesActions.LoadCategory) => action.payload),
    switchMap(categoryId => {
      return this.categoryService
        .getCategory(categoryId)
        .pipe(
        map(category => new categoriesActions.LoadCategorySuccess(category)),
        catchError(error => of(new categoriesActions.LoadCategoryFail(error)))
        );
    })
    );
}
