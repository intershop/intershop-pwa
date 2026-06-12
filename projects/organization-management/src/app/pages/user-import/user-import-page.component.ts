import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, combineLatest, map, of } from 'rxjs';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { B2bUser } from '../../models/b2b-user/b2b-user.model';

@Component({
  selector: 'ish-user-import-page',
  templateUrl: './user-import-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserImportPageComponent implements OnInit {
  importedUsers$: Observable<{ user: B2bUser; status: string }[]> = of([]);
  importProgress$: Observable<{
    total: number;
    current: number;
    percentage: number;
  }>;
  loading$: Observable<boolean>;

  columnsToDisplay = ['userName', 'userRoles', 'userBudget', 'status'];

  constructor(private organizationManagementFacade: OrganizationManagementFacade) {}

  ngOnInit(): void {
    this.importedUsers$ = this.organizationManagementFacade.usersImportResults$;

    this.importProgress$ = combineLatest([
      this.organizationManagementFacade.usersImportTotal$,
      this.importedUsers$,
    ]).pipe(
      map(([totalUsersToImport, importedUsers]) => ({
        total: totalUsersToImport,
        current: importedUsers.length,
        percentage: totalUsersToImport > 0 ? Math.round((importedUsers.length / totalUsersToImport) * 100) : 0,
      }))
    );

    this.loading$ = this.organizationManagementFacade.usersLoading$;
  }
}
