import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class RequisitionManagementFacade {
  constructor(private store: Store) {
    // tslint:disable-next-line: no-console
    console.log(this.store);
  }
}
