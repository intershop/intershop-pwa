import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

@Injectable()
export class CategoryPathGuard implements CanActivate {

  constructor() { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.checkStore(route.params.categoryUniqueId);
  }

  checkStore(categoryUniqueId: string): Observable<boolean> {
    console.log('CategoryPathGuard for:', categoryUniqueId);

    // for (const categoryId of categoryUniqueId.split('.')) {
    //   console.log(categoryId);
    // }

    return of(true);

    // return this.store.select(fromStore.getCategoryEntities).pipe(
    //   map((entities: { [key: number]: any }) => !!entities[categoryUniqueId]),
    //   tap(inStore => {
    //     if (!inStore) {
    //       this.store.dispatch(new fromStore.LoadCategory(categoryUniqueId));
    //     }
    //   }),
    //   filter(inStore => inStore),
    //   take(1)
    // );
  }
}
