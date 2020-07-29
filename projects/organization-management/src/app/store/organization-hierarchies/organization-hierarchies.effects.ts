import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { loadGroups, loadGroupsSuccess, loadGroupsFail } from './organization-hierarchies.actions';
import { OrganizationHierarchiesService } from '../../services/organization-hierarchies/organization-hierarchies.service';
import { mapErrorToAction } from 'ish-core/utils/operators';
import { Store, select } from '@ngrx/store';

@Injectable()
export class OrganizationHierarchiesEffects {
  constructor(
    private actions$: Actions,
    private organizationService: OrganizationHierarchiesService,
    private store: Store
  ) { }

  loadOrganizationHierarchies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadGroups),
      withLatestFrom(this.store.pipe(select(getLoggedInCustomer))),
      switchMap(([, customer]) =>
        this.organizationService.getNodes(customer.customerNo).pipe(
          map(nodeTree => loadGroupsSuccess({ nodeTree })),
          mapErrorToAction(loadGroupsFail)
        )
      )
    )
  );
}
