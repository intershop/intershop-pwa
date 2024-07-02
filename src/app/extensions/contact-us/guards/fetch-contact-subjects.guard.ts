import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, concatMap, map, tap } from 'rxjs';

import { whenTruthy } from 'ish-core/utils/operators';

import { loadContact } from '../store/contact';
import { getContactUsState } from '../store/contact-us-store';

/**
 * Fetch subjects for the contact us form
 * wait for translation service and contactUs state to be initialized
 */
export function fetchContactSubjectsGuard(): boolean | Observable<boolean> {
  const store = inject(Store);
  const translateService = inject(TranslateService);

  return translateService.get('account.option.select.text').pipe(
    whenTruthy(),
    concatMap(() =>
      store.select(getContactUsState).pipe(
        whenTruthy(),
        tap(() => store.dispatch(loadContact())),
        map(() => true)
      )
    )
  );
}
