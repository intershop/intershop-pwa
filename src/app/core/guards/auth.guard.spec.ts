import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { instance, mock } from 'ts-mockito';

import { Customer } from 'ish-core/models/customer/customer.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { loginUserSuccess } from 'ish-core/store/customer/user';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';

import { authGuard } from './auth.guard';

describe('Auth Guard', () => {
  let store: Store;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(),
        CustomerStoreModule.forTesting('user'),
        RouterTestingModule.withRoutes([
          {
            path: 'account',
            canActivate: [authGuard],
            children: [],
          },
          {
            path: 'login',
            children: [],
          },
        ]),
      ],
      providers: [{ provide: CookiesService, useFactory: () => instance(mock(CookiesService)) }],
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
  });

  it('should return to the desired page when user is authorized', fakeAsync(() => {
    store.dispatch(loginUserSuccess({ customer: {} as Customer }));

    router.navigate(['/account']);
    tick(2000);

    expect(router.url).toMatchInlineSnapshot(`"/account"`);
  }));

  it('should return to the login page when user is not authorized', fakeAsync(() => {
    router.navigate(['/account']);
    tick(2000);

    expect(router.url).toMatchInlineSnapshot(`"/login?returnUrl=%2Faccount"`);
  }));
});
