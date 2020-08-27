import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Locale } from 'ish-core/models/locale/locale.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { determineSalutations } from 'ish-shared/forms/utils/form-utils';

@Component({
  selector: 'ish-user-profile-form',
  templateUrl: './user-profile-form.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class UserProfileFormComponent implements OnInit, OnDestroy {
  @Input() form: FormGroup;
  @Input() error: HttpError;

  currentLocale$: Observable<Locale>;
  private destroy$ = new Subject();

  titles = [];

  constructor(private appFacade: AppFacade) {}

  ngOnInit() {
    this.currentLocale$ = this.appFacade.currentLocale$;

    // determine default language from session and available locales
    this.currentLocale$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(locale => {
      this.titles = locale?.lang ? determineSalutations(locale.lang.slice(3)) : undefined;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
