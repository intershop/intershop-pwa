import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

import { PunchoutFacade } from '../../facades/punchout.facade';
import { PunchoutUser } from '../../models/punchout-user/punchout-user.model';

@Component({
  selector: 'ish-account-punchout-details-page',
  templateUrl: './account-punchout-details-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountPunchoutDetailsPageComponent implements OnInit, OnDestroy {
  selectedUser$: Observable<PunchoutUser>;
  loading$: Observable<boolean>;
  error$: Observable<HttpError>;

  user: PunchoutUser;
  form: FormGroup;
  submitted = false;

  private destroy$ = new Subject();

  constructor(private fb: FormBuilder, private punchoutFacade: PunchoutFacade) {}

  ngOnInit() {
    this.selectedUser$ = this.punchoutFacade.selectedPunchoutUser$;
    this.loading$ = this.punchoutFacade.punchoutLoading$;
    this.error$ = this.punchoutFacade.punchoutError$;

    this.selectedUser$.pipe(whenTruthy(), take(1), takeUntil(this.destroy$)).subscribe(user => {
      this.user = user;
      this.createForm();
    });
  }

  createForm() {
    this.form = this.fb.group(
      {
        login: [this.user.login, [Validators.required, SpecialValidators.punchoutLogin]],
        active: [this.user.active],
        password: ['', [SpecialValidators.password]],
        passwordConfirmation: ['', [SpecialValidators.password]],
      },
      {
        validators: [SpecialValidators.equalTo('passwordConfirmation', 'password')],
      }
    );
  }

  submitForm() {
    if (this.form.invalid) {
      markAsDirtyRecursive(this.form);
      return;
    }

    const formValue = this.form.value;

    const user: PunchoutUser = {
      ...this.user,
      active: formValue.active,
      password: formValue.password ? formValue.password : undefined,
    };
    this.punchoutFacade.updatePunchoutUser(user);
  }

  get formDisabled() {
    return this.form.invalid && this.submitted;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
