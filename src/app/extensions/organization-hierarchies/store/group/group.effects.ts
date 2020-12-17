import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';

import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { mapErrorToAction } from 'ish-core/utils/operators';

import { OrganizationHierarchiesService } from '../../services/organization-hierarchies/organization-hierarchies.service';

import { loadGroups, loadGroupsFail, loadGroupsSuccess } from './group.actions';

@Injectable()
export class GroupEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private organizationService: OrganizationHierarchiesService
  ) {}

  loadGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadGroups),
      withLatestFrom(this.store.pipe(select(getLoggedInCustomer))),
      switchMap(([, customer]) =>
        this.organizationService.getGroups(customer).pipe(
          map(groups => loadGroupsSuccess({ groups })),
          mapErrorToAction(loadGroupsFail)
        )
      )
    )
  );
}
