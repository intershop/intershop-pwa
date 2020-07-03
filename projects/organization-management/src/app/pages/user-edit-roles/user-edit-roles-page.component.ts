import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subject, combineLatest, of } from 'rxjs';
import { map, shareReplay, switchMap, take, takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { whenTruthy } from 'ish-core/utils/operators';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { B2bUser } from '../../models/b2b-user/b2b-user.model';

@Component({
  selector: 'ish-user-edit-roles-page',
  templateUrl: './user-edit-roles-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEditRolesPageComponent implements OnInit, OnDestroy {
  selectedUser$: Observable<B2bUser>;
  loading$: Observable<boolean>;
  error$: Observable<HttpError>;

  staticRoles$: Observable<string[]>;

  form$: Observable<FormGroup>;
  private destroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private organizationManagementFacade: OrganizationManagementFacade,
    private accountFacade: AccountFacade
  ) {}

  ngOnInit() {
    this.loading$ = this.organizationManagementFacade.usersLoading$;
    this.error$ = this.organizationManagementFacade.usersError$;
    this.selectedUser$ = this.organizationManagementFacade.selectedUser$;

    this.staticRoles$ = combineLatest([this.selectedUser$, this.accountFacade.user$]).pipe(
      map(([selectedUser, currentUser]) => selectedUser?.login === currentUser?.login),
      switchMap(isCurrentUser => (isCurrentUser ? of(['APP_B2B_ACCOUNT_OWNER']) : of([])))
    );

    this.form$ = this.selectedUser$.pipe(
      whenTruthy(),
      map(user =>
        this.fb.group({
          roleIDs: [user.roleIDs],
        })
      ),
      shareReplay(1)
    );
  }

  submitForm() {
    this.form$.pipe(take(1), takeUntil(this.destroy$)).subscribe(form => {
      this.organizationManagementFacade.setSelectedUserRoles(form.value.roleIDs);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
