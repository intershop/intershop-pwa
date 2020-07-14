import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getCompanyStructureState } from '../store/company-structure-store';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class CompanyStructureFacade {
  constructor(private store: Store) {}

  /**
   * example for debugging
   */
  companyStructureState$ = this.store.pipe(select(getCompanyStructureState));
}
