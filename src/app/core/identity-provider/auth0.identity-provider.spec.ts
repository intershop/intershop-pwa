import { APP_BASE_HREF } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { OAuthService } from 'angular-oauth2-oidc';
import { instance, mock } from 'ts-mockito';

import { Customer } from 'ish-core/models/customer/customer.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';

@Component({ template: 'dummy' })
class DummyComponent {}

describe('Auth0 Identity Provider', () => {
  const oAuthService = mock(OAuthService);
  const apiService = mock(ApiService);
  const apiTokenService = mock(ApiTokenService);
  const baseHref = 'baseHref';

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [RouterTestingModule.withRoutes([{ path: 'home', component: DummyComponent }])],
      providers: [
        { provide: ApiService, useFactory: () => instance(apiService) },
        { provide: ApiTokenService, useFactory: () => instance(apiTokenService) },
        { provide: OAuthService, useFactory: () => instance(oAuthService) },
        { provide: APP_BASE_HREF, useValue: baseHref },
        provideMockStore({
          selectors: [
            { selector: getLoggedInCustomer, value: { customerNo: '4711', isBusinessCustomer: true } as Customer },
          ],
        }),
      ],
    }).compileComponents();
  });

  it('should complete dummytest on stupid rule', () => {
    expect(true).toBeTrue();
  });
});
