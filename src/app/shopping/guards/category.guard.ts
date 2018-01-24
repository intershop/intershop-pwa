import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { filter, map, take, tap } from 'rxjs/operators';

import * as fromStore from '../store';

@Injectable()
export class CategoryGuard implements CanActivate {

  constructor(
    private store: Store<fromStore.ShoppingState>
  ) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.checkStore(route.params.categoryUniqueId);
  }

  checkStore(categoryUniqueId: string): Observable<boolean> {
    return this.store.select(fromStore.getCategoryEntities).pipe(
      map((entities: { [key: number]: any }) => !!entities[categoryUniqueId]),
      tap(inStore => {
        if (!inStore) {
          this.store.dispatch(new fromStore.LoadCategory(categoryUniqueId));
        }
      }),
      filter(inStore => inStore),
      take(1)
    );
  }
}
