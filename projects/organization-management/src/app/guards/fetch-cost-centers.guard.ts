import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import { loadCostCenters } from '../store/cost-centers';

@Injectable({ providedIn: 'root' })
export class FetchCostCentersGuard implements CanActivate {
  constructor(private store: Store) {}

  canActivate(_: ActivatedRouteSnapshot): boolean | Observable<boolean> {
    this.store.dispatch(loadCostCenters());
    return of(true);
  }
}
