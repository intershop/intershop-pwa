import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { Customer } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';
import { ApiService } from 'ish-core/services/api/api.service';

import { AuthorizationService } from './authorization.service';

describe('Authorization Service', () => {
  let apiService: ApiService;
  let authorizationService: AuthorizationService;

  beforeEach(() => {
    apiService = mock(ApiService);
    when(apiService.get(anything())).thenReturn(of({}));

    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiService) }],
    });
    authorizationService = TestBed.inject(AuthorizationService);
  });

  it('should be created', () => {
    expect(authorizationService).toBeTruthy();
  });

  it('should fail when customer input is falsy', done => {
    authorizationService.getRolesAndPermissions(undefined, {} as User).subscribe({
      error: err => {
        expect(err).toBeTruthy();
        done();
      },
    });
  });

  it('should fail when user input is falsy', done => {
    authorizationService.getRolesAndPermissions({} as Customer, undefined).subscribe({
      error: err => {
        expect(err).toBeTruthy();
        done();
      },
    });
  });

  it('should call roles api when queried', done => {
    authorizationService
      .getRolesAndPermissions({ customerNo: 'FOOD' } as Customer, { login: 'email' } as User)
      .subscribe({
        next: () => {
          verify(apiService.get(anything())).once();
          expect(capture(apiService.get).last()[0]).toMatchInlineSnapshot(`"customers/FOOD/users/email/roles"`);
          done();
        },
        error: fail,
      });
  });
});
