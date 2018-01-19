import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, filter, switchMap, take, tap } from 'rxjs/operators';

import * as fromStore from '../store';

@Injectable()
export class CategoryGuard implements CanActivate {
  constructor(private store: Store<fromStore.ShoppingState>) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.checkStore(route.url.map(x => x.path).join('/')).pipe(
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }

  checkStore(categoryId: string): Observable<boolean> {
    return this.store.select(fromStore.getCategoryLoaded).pipe(
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(new fromStore.LoadCategory(categoryId));
        }
      }),
      filter(loaded => loaded),
      take(1)
    );
  }
}
