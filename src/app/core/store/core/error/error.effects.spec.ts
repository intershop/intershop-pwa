import { Location } from '@angular/common';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { communicationTimeoutError } from './error.actions';
import { ErrorEffects } from './error.effects';

describe('Error Effects', () => {
  let store: Store;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(['error'], [ErrorEffects]),
        RouterModule.forRoot([{ path: 'error', children: [] }]),
      ],
    });

    store = TestBed.inject(Store);
    location = TestBed.inject(Location);
  });

  it('should redirect to error page when general errors are encountered', fakeAsync(() => {
    store.dispatch(communicationTimeoutError({ error: makeHttpError({}) }));

    tick(500);

    expect(location.path()).toEqual('/error');
  }));
});
