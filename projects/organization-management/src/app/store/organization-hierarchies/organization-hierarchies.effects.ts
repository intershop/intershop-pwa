import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { mapErrorToAction, mapToPayload } from 'ish-core/utils/operators';

import { OrganizationHierarchiesService } from '../../services/organization-hierarchies/organization-hierarchies.service';

import {
  createGroup,
  createGroupFail,
  createGroupSuccess,
  loadGroups,
  loadGroupsFail,
  loadGroupsSuccess,
} from './organization-hierarchies.actions';

@Injectable()
export class OrganizationHierarchiesEffects {
  constructor(
    private actions$: Actions,
    private organizationService: OrganizationHierarchiesService,
    private store: Store,
    private router: Router
  ) {}

  loadOrganizationHierarchies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadGroups),
      withLatestFrom(this.store.pipe(select(getLoggedInCustomer))),
      switchMap(([, customer]) =>
        this.organizationService.getNodes(customer).pipe(
          map(nodeTree => loadGroupsSuccess({ nodeTree })),
          mapErrorToAction(loadGroupsFail)
        )
      )
    )
  );

  createNewGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createGroup),
      mapToPayload(),
      concatMap(newGroup =>
        this.organizationService.createNode(newGroup.parent, newGroup.child).pipe(
          map(nodeTree => createGroupSuccess({ nodeTree })),
          mapErrorToAction(createGroupFail)
        )
      )
    )
  );

  redirectAfterCreateNewGroup$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createGroupSuccess),
        tap(() => {
          this.navigateTo('../');
        })
      ),
    { dispatch: false }
  );

  private navigateTo(path: string): void {
    // find current ActivatedRoute by following first activated children
    let currentRoute = this.router.routerState.root;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }
    this.router.navigate([path], { relativeTo: currentRoute });
  }
}
