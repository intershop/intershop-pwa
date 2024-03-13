import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';

import { TREE_FACADE_IMPLEMENTOR } from 'ish-core/facades/common/tree.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { OrganizationHierarchiesFacade } from '../../facades/organization-hierarchies.facade';
import { OrganizationGroup } from '../../models/organization-group/organization-group.model';

@Component({
  selector: 'ish-hierarchies-page',
  templateUrl: './hierarchies-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: TREE_FACADE_IMPLEMENTOR, useClass: OrganizationHierarchiesFacade, multi: false }],
})
export class HierarchiesPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  error$: Observable<HttpError>;
  groups: OrganizationGroup[];

  constructor(private organizationHierarchiesFacade: OrganizationHierarchiesFacade) {}

  ngOnInit() {
    this.error$ = this.organizationHierarchiesFacade.groupsError$;
    this.organizationHierarchiesFacade
      .groupsOfCurrentUser$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(tree => (this.groups = tree));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
