import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { filter, map, take, tap } from 'rxjs/operators';

import * as fromStore from '../store';

@Injectable()
export class ProductGuard implements CanActivate {

  constructor(
    private store: Store<fromStore.ShoppingState>
  ) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.checkStore(route.params.sku);
  }

  checkStore(sku: string): Observable<boolean> {
    return this.store.select(fromStore.getProductEntities).pipe(
      map((entities: { [key: number]: any }) => !!entities[sku]),
      tap(inStore => {
        if (!inStore) {
          this.store.dispatch(new fromStore.LoadProduct(sku));
        }
      }),
      filter(inStore => inStore),
      take(1)
    );
  }
}
