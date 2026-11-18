import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { noop } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { getIdentityProvider } from 'ish-core/store/core/configuration';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';

import { IDENTITY_PROVIDER_IMPLEMENTOR, IdentityProviderFactory } from './identity-provider.factory';
import { IdentityProvider } from './identity-provider.interface';

class TestIdentityProvider {}

describe('Identity Provider Factory', () => {
  let store$: MockStore;
  let testIdentityProvider: Partial<IdentityProvider>;

  beforeEach(() => {
    const apiTokenService = mock(ApiTokenService);
    when(apiTokenService.hasUserApiTokenCookie()).thenReturn(true);
    testIdentityProvider = { init: noop };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: IDENTITY_PROVIDER_IMPLEMENTOR,
          multi: true,
          useValue: { type: 'TEST', implementor: TestIdentityProvider },
        },
        { provide: ApiTokenService, useFactory: () => instance(apiTokenService) },
        { provide: TestIdentityProvider, useFactory: () => testIdentityProvider },
        provideMockStore({ selectors: [{ selector: getIdentityProvider, value: { type: 'TEST' } }] }),
      ],
    });
    store$ = TestBed.inject(MockStore);
  });

  describe('hasUserSession$', () => {
    it('should use hasUserSession() of the identity provider instead of the user apiToken cookie', done => {
      testIdentityProvider.hasUserSession = () => false;

      TestBed.inject(IdentityProviderFactory)
        .hasUserSession$()
        .subscribe(hasUserSession => {
          expect(hasUserSession).toBeFalse();
          done();
        });
    });

    it('should check the user apiToken cookie when the identity provider does not implement hasUserSession()', done => {
      TestBed.inject(IdentityProviderFactory)
        .hasUserSession$()
        .subscribe(hasUserSession => {
          expect(hasUserSession).toBeTrue();
          done();
        });
    });

    it('should check the user apiToken cookie when no identity provider is found', done => {
      jest.spyOn(console, 'error').mockImplementation(noop);
      store$.overrideSelector(getIdentityProvider, { type: 'UNKNOWN' });

      TestBed.inject(IdentityProviderFactory)
        .hasUserSession$()
        .subscribe(hasUserSession => {
          expect(hasUserSession).toBeTrue();
          done();
        });
    });

    it('should wait until the identity provider is created', done => {
      store$.overrideSelector(getIdentityProvider, undefined);
      let configured = false;

      TestBed.inject(IdentityProviderFactory)
        .hasUserSession$()
        .subscribe(hasUserSession => {
          expect(configured).toBeTrue();
          expect(hasUserSession).toBeTrue();
          done();
        });

      configured = true;
      store$.overrideSelector(getIdentityProvider, { type: 'TEST' });
      store$.refreshState();
    });
  });
});
